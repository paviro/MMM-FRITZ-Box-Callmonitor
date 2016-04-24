/* global Module */

/* Magic Mirror
 * Module: MMM-FRITZ-Box-Callmonitor
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.register('MMM-FRITZ-Box-Callmonitor',{
	
	// Default module config.
	defaults: {
		NumberFontSize: "30px",
		vCard: false,
		fritzIP: '192.168.178.1',
		fritzPort: 1012
	},
	
	// Define required translations.
	getTranslations: function() {
		return {
			en: "translations/en.json",
			de: "translations/de.json"
		};
	},
	
	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'call') {
			if (payload != 'clear'){
				this.sendNotification("SHOW_ALERT", {
					title: this.translate("title"),
					message: "<span style='font-size:" + this.config.NumberFontSize + "'>" + payload + "<span>",
					imageFA: "phone"
				}); 
			}
			if (payload == 'clear'){
				this.sendNotification("HIDE_ALERT");
			}
			
		}
	},
	
	start: function() {
		//Open Socket connection
		this.sendSocketNotification('CONFIG', this.config);
		Log.info('Starting module: ' + this.name);
		}

});