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
		number_font_size: "30px"
	},
	
	getScripts: function() {
		return ['sweetalert.js'];
	},
	
	getStyles: function() {
		return ['sweetalert.css'];
	},
	
	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'call') {
			if (payload != 'clear'){
				swal({
					title: this.config.title, 
					imageUrl: "modules/" + this.name + "/img/phone.png",  
					text: "<span style='font-size:" + this.config.number_font_size + "'>" + payload + "<span>",
					html: true,
					showConfirmButton: false 
					});
			}
			if (payload == 'clear'){
				swal.close()
			}
			
		}
	},
	
	start: function() {
		//Open Socket connection
		this.sendSocketNotification('connect', null);
		
		Log.info('Starting module: ' + this.name);
		}

});