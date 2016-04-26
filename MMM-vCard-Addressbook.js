/* global Module */

/* Magic Mirror
 * Module: MMM-FRITZ-Box-Callmonitor
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.register("MMM-FRITZ-Box-Callmonitor", {

	// Default module config.
	defaults: {
		numberFontSize: 30,
		vCard: false,
		fritzIP: "192.168.178.1",
		fritzPort: 1012,
		minimumCallLength: 0,
		maximumCallDistance: 60,
		maximumCalls: 5,
		fade: true,
		fadePoint: 0.25

	},

	// Define required translations.
	getTranslations: function() {
		return {
			en: "translations/en.json",
			de: "translations/de.json"
		};
	},

	notificationReceived: function(notification, payload, sender) {
		if (notification === "PHONE_LOOKUP") {
			this.sendSocketNotification("PHONE_LOOKUP", {number: payload, sender: sender.name});
		}
	},

	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "PHONE_LOOKUP_RESULT") {
			this.sendNotification("PHONE_LOOKUP_RESULT", payload);
		}
	},

	start: function() {
		//Send config to the node helper
		this.sendSocketNotification("CONFIG", this.config);
		Log.info("Starting module: " + this.name);
	},

});
