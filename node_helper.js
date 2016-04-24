"use strict";
const NodeHelper = require("node_helper");
const CallMonitor = require("node-fritzbox-callmonitor");
require("./addressbook.js");

module.exports = NodeHelper.create({
	// Subclass start method.
	start: function() {
		this.started = false;
		console.log("Starting module: " + this.name);
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === "CONFIG") {
			this.config = payload;
			if (!this.started) {
				console.log("Received config for" + this.name);
				var self = this;
				this.started = true;
				var monitor = new CallMonitor(this.config.fritzIP, this.config.fritzPort);

				monitor.on("inbound", function(call) {
					if (call.caller != "") {
						if (a_obj[call.caller]) {
							self.sendSocketNotification("call", a_obj[call.caller]);
						}
						if (!a_obj[call.caller]) {
							self.sendSocketNotification("call", call.caller);
						}
					};
				});

				monitor.on("disconnected", function(call) {
					self.sendSocketNotification("call", "clear");
				});
				console.log(this.name + " is waiting for incoming calls.");
			};
		};
	}
});
