/* global Module */

/* Magic Mirror
 * Module: MMM-FRITZ-Box-Callmonitor
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.create({
	
	// Default module config.
	defaults: {
		server: 'http://localhost:2344',
		title: "Incoming Call",
	},
	
	getScripts: function() {
		return [
			this.config.server + '/socket.io/socket.io.js',
			'sweetalert.js'
		];
	},
	
	start: function() {
		const callmonitor = io.connect(this.config.server);
		var title = this.config.title
		callmonitor.on('call', function (data){
			if (data != 'clear'){
				swal({
					title: title, 
					imageUrl: "modules/MMM-FRITZ-Box-Callmonitor/img/phone.png",  
					text: "<span style='font-size:30px'>" + data + "<span>",
					html: true,
					showConfirmButton: false 
					});
			}
			if (data == 'clear'){
				swal.close()
			}
		});
		    Log.info('Starting module: ' + this.name);
		},


	getStyles: function() {
		return [
			'sweetalert.css'
		];
	},


});