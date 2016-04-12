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
		title: "Incoming Call",
		NumberFontSize: "30px",
		fritzIP: '192.168.178.1',
		fritzPort: 1012
	},
	
	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'call') {
			if (payload != 'clear'){
				self.sendNotification("SHOW_ALERT", {
					title: this.config.title,
					message: "<span style='font-size:" + this.config.NumberFontSize + "'>" + payload + "<span>",
					imageFA: "phone"
				}); 
			}
			if (payload == 'clear'){
				self.sendNotification("HIDE_ALERT");
			}
			
		}
	},
	
	start: function() {
		//Open Socket connection
		this.sendSocketNotification('CONFIG', this.config);
		Log.info('Starting module: ' + this.name);
		}

});