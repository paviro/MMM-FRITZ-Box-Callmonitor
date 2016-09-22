"use strict";

const NodeHelper = require("node_helper");
const CallMonitor = require("node-fritzbox-callmonitor");
const vcard = require("vcard-json");
const phoneFormatter = require("phone-formatter");
const xml2js = require("xml2js");
const moment = require('moment');
const fs = require('fs');
const exec = require('child_process').exec;

const CALL_TYPE = Object.freeze({
	INCOMING : 1,
	MISSED : 2,
	OUTGOING : 3
})
// outgoing missed calls are not in the list

module.exports = NodeHelper.create({
	// Subclass start method.
	start: function() {
		this.started = false;
		//create adressbook dictionary
		this.AddressBook = {};
		console.log("Starting module: " + this.name);
	},

	normalizePhoneNumber(number) {
		return phoneFormatter.normalize(number.replace(/\s/g, ""));
	},

	getName: function(number) {
		//Normalize number
		var number_formatted = this.normalizePhoneNumber(number);
		//Check if number is in AdressBook if yes return the name
		if (number_formatted in this.AddressBook) {
			return this.AddressBook[number_formatted];
		} else {
			//Not in AdressBook return original number
			return number;
		}
	},

	socketNotificationReceived: function(notification, payload) {
		//Received config from client
		if (notification === "CONFIG") {
			//set config to config send by client
			this.config = payload;
			//if monitor has not been started before (makes sure it does not get started again if the web interface is reloaded)
			if (!this.started) {
				//set started to true, so it won't start again
				this.started = true;
				console.log("Received config for " + this.name);

				this.parseVcardFile();
				this.setupMonitor();
				if (this.config.password !== "")
				{
					this.loadDataFromAPI();
				}
			};
		}
	},

	setupMonitor: function() {
		//helper variable so that the module-this is available inside our callbacks
		var self = this;

		//Set up CallMonitor with config received from client
		var monitor = new CallMonitor(this.config.fritzIP, this.config.fritzPort);

		//Incoming call
		monitor.on("inbound", function(call) {
			//If caller is not empty
			if (call.caller != "") {
				self.sendSocketNotification("call", self.getName(call.caller));
			};
		});

		//Call accepted
		monitor.on("connected", function(call) {
			self.sendSocketNotification("connected", self.getName(call.caller));
		});

		//Caller disconnected
		monitor.on("disconnected", function(call) {
			//send clear command to interface
			self.sendSocketNotification("disconnected", {"caller": self.getName(call.caller), "duration": call.duration});
		});
		console.log(this.name + " is waiting for incoming calls.");
	},

	parseVcardFile: function() {
		var self = this;

		if (!this.config.vCard) {
			return;
		}
		vcard.parseVcardFile(self.config.vCard, function(err, data) {
			//In case there is an error reading the vcard file
			if (err) {
				self.sendSocketNotification("contacts_loaded", -1);
				console.log("[" + self.name + "] " + err);
				return
			}

			//For each contact in vcf file
			for (var i = 0; i < data.length; i++) {
				//For each phone number in contact
				for (var a = 0; a < data[i].phone.length; a++) {
					//normalize and add to AddressBook
					self.AddressBook[self.normalizePhoneNumber(data[i].phone[a].value)] = data[i].fullname;
				}
			}
			self.sendSocketNotification("contacts_loaded", data.length);
		});
	},

	loadCallList: function(body) {
		var self = this;

		xml2js.parseString(body, function (err, result) {
			if (err) {
				self.sendSocketNotification("contacts_loaded", -1);
				console.error(self.name + " error while parsing call list: " + err);
				return;
			}
			var callArray = result.root.Call;
			var callHistory = []
			for (var index in callArray)
			{
				var call = callArray[index];
				if (call.Type == CALL_TYPE.MISSED)
				{
					var callInfo = {"time": moment(call.Date[0], "DD-MM-YY HH:mm"), "caller": self.getName(call.Caller[0])};
					if (call.Name[0])
					{
						callInfo.caller = call.Name[0];
					}
					callHistory.push(callInfo)
				}
			}
			self.sendSocketNotification("call_history", callHistory);
		});
	},

	loadPhonebook: function(body) {
		var self = this;

		xml2js.parseString(body, function (err, result) {
			if (err) {
				self.sendSocketNotification("contacts_loaded", -1);
				console.error(self.name + " error while parsing phonebook: " + err);
				return;
			}
			var contactsArray = result.phonebooks.phonebook[0].contact;
			for (var index in contactsArray)
			{
				var contact = contactsArray[index];


				var contactNumbers = contact.telephony[0].number;
				var contactName = contact.person[0].realName;

				for (var index in contactNumbers)
				{
					var currentNumber = self.normalizePhoneNumber(contactNumbers[index]._);
					self.AddressBook[currentNumber] = contactName[0];
				}
			}
			self.sendSocketNotification("contacts_loaded", contactsArray.length);
		});
	},

	loadDataFromAPI: function() {
		const PARENT_DIR = 'modules/MMM-FRITZ-Box-Callmonitor/';

		var self = this;

		var options = ['fritz_access.py', '-d', 'data']
		if (self.config.password !== "")
		{
			options.push('-p');
			options.push(self.config.password);
		}
		if (self.config.username !== "")
		{
			options.push('-u');
			options.push(self.config.username);
		}
		exec("python " + options.join(" "), {cwd: PARENT_DIR}, function (error, stdout, stderr) {
			if (error) {
				self.sendSocketNotification("contacts_loaded", -1);
				console.error(self.name + " error while accessing FRITZ!Box: " + stderr + "\n" + stdout);
				throw error;
			}
			var files = stdout.split("\n");
			console.log(files.length);
			for (var i = 0; i + 1 < files.length; i += 2)
			{
				var filename = files[i];
				var content = files[i + 1];

				if (filename.indexOf("calls") !== -1)
				{
					// call list file
					self.loadCallList(content);
				} else {
					// phone book file
					self.loadPhonebook(content);
				}
			}
		});
	}
});
