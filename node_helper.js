"use strict";
const NodeHelper = require("node_helper");
const vcard = require("vcard-json");
const phone = require("phone-formatter");

module.exports = NodeHelper.create({
	// Subclass start method.
	start: function() {
		this.started = false;
		//create adressbook dictionary
		this.AddressBook = {};
		console.log("Starting module: " + this.name);
	},

	getName: function(number) {
		//Normalize number
		var number_formatted = phone.normalize(number.replace(/\s/g, ""));
		//Check if number is in AdressBook if yes return the name
		if (number_formatted in this.AddressBook) {
			return this.AddressBook[number_formatted];
		}
		//Not in AdressBook return original number
		else {
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
				//set started to true, so it won"t start again
				this.started = true;
				console.log("Received config for " + this.name);

				//If path to contact file is given
				if (this.config.vCard) {
					//Parse contact file
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
												this.AddressBook[phone.normalize(data[i].phone[a].value.replace(/\s/g, ""))] = data[i].fullname;
											}
										}
									}
								}.bind(this));
				} else {
					console.log("Missing vCard, module is useless");
				}
			};
		}
		if (notification === "PHONE_LOOKUP") {
			console.log("Requested Lookup for " + payload.number);

			var name = this.getName(payload.number);
			var label = "";
			var resolved = false;
			if (name !== payload.number) {
				resolved = true;
			}
			// Always send results
			var info = {
				name: name,
				label: "", // not implemented
				number: phone.normalize(payload.number.replace(/\s/g, "")),
				request: payload.number,
				original_sender: payload.sender,
				resolved: resolved,
			};
			this.sendSocketNotification("PHONE_LOOKUP_RESULT", info);
		}
	}
});
