"use strict";

const NodeHelper = require("node_helper");
const CallMonitor = require("node-fritzbox-callmonitor");
const vcard = require("vcard-json");
const phone = require("phone-formatter");
const tr = require("tr-064");
const xml2js = require("xml2js");
const https = require("https");
const url = require('url');

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

	},

	getName: function(number) {
		//Normalize number
		var number_formatted = self.normalizePhoneNumber(number);
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
				this.setupApiAccess();
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
		if (!this.config.vCard) {
			return;
		}
		vcard.parseVcardFile(this.config.vCard, function(err, data) {
			//In case there is an error reading the vcard file
			if (err) console.log("[" + this.name + "] " + err);
			//success
			else {
				//For each contact in vcf file
				for (var i = 0; i < data.length; i++) {
					//For each phone number in contact
					for (var a = 0; a < data[i].phone.length; a++) {
						//normalize and add to AddressBook
						self.AddressBook[self.normalizePhoneNumber(data[i].phone[a].value)] = data[i].fullname;
					}
				}
			}
		});
	},

// https://192.168.178.1:49443/phonebook.lua?sid=daf3d377ab4c27ad&pbid=0
// https://192.168.178.1:49443/calllist.lua?sid=daf3d377ab4c27ad

	insecureBoxRequest(self, targetUrl, callback) {
		// WARNING: use this method ONLY for requests to your fritz.box
		// it ignores self-signed certificates
		// the fritz.box uses this kind of generated certificate
		var parsedUrl = url.parse(targetUrl);
		var options = { 
			protocol: parsedUrl.protocol,
			host: parsedUrl.hostname,
			port: parsedUrl.port,
			path: parsedUrl.path,
			rejectUnauthorized: false,
			requestCert: true,
			agent: false
		};
		return https.get(options, function(response) {
			if (response.statusCode !== 200)
			{
				console.error("Error code " + response.statusCode + " on request: " + targetUrl);
			}
			// Continuously update stream with data
			var body = '';
			response.on('data', function(d) {
				body += d;
			});
			response.on('end', function() {
				callback(self, body);
			});
		});
	},

	loadCallList: function(self, body) {
		xml2js.parseString(body, function (err, result) {
			if (err) {
				console.error(self.name + " error while parsing call list: " + err);
				return;
			}
			var callArray = result.root.Call;
			for (var index in callArray)
			{
				var call = callArray[index];
				if (call.Type == CALL_TYPE.MISSED)
				{
					console.log(call.Id);
				}
			}
		});
	},

	loadPhonebook: function(self, body) {
		console.log(self.AddressBook);

		xml2js.parseString(body, function (err, result) {
			if (err) {
				console.error(self.name + " error while parsing phonebook: " + err);
				return;
			}
			var contactsArray = result.phonebooks.phonebook[0].contact;
			for (var index in contactsArray)
			{
				var contact = contactsArray[index];


				var contactNumbers = contact.telephony[0].number;
				var contactName = contact.person[0].realName;

				console.log(self.AddressBook);
				for (var index in contactNumbers)
				{
					var currentNumber = contactNumbers[index]._;
					console.log(currentNumber + " -> " + contactName);
					self.AddressBook[self.normalizePhoneNumber(currentNumber)] = contactName;
				}
			}
		});
	},

	setupApiAccess: function() {
		var self = this;

		var tr064Api = new tr.TR064();
		tr064Api.initTR064Device(self.config.fritzIP, self.config.tr064Port, function (err, device) {
			if (err) {
				console.error(self.name + " error: " + err);
				return;
			}
			device.startEncryptedCommunication(function (err, sslDev) {
				if (err) {
					console.error(self.name + " error: " + err);
					return;
				}
				sslDev.login(self.config.username, self.config.password);
				console.log(self.name + " login");
				var phoneservice = sslDev.services["urn:dslforum-org:service:X_AVM-DE_OnTel:1"];
				phoneservice.actions.GetCallList(function (err, result) {
					if (err) {
						console.error(self.name + " error: " + err);
						return;
					}
					self.insecureBoxRequest(self, result["NewCallListURL"], self.loadCallList);
				});
				phoneservice.actions.GetPhonebookList(function (err, result) {
					if (err) {
						console.error(self.name + " error: " + err);
						return;
					}
					var phonebooks = result["NewPhonebookList"];

					for (var phonebookID in phonebooks.split(",")) {
						var filter = self.config.loadSpecificPhonebook;
						if (filter == "" || filter == phonebookID)
						{
							phoneservice.actions.GetPhonebook({'NewPhonebookID' : phonebookID}, function (err, result) {
								if (err) {
									console.error(self.name + " error: " + err);
									return;
								}
								self.insecureBoxRequest(self, result["NewPhonebookURL"], self.loadPhonebook);
							});
						}
					}
				});
			});
		});
	}
});
