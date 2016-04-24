/* global Module */

/* Magic Mirror
 * Module: MMM-FRITZ-Box-Callmonitor
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.register("MMM-FRITZ-Box-Callmonitor",{
	
	// Default module config.
	defaults: {
		NumberFontSize: "30px",
		vCard: false,
		fritzIP: "192.168.178.1",
		fritzPort: 1012,
		maximumEntrieDistance: 60,
		maximumEntries: 5,
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
	
	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "call") {
			if (payload != "clear"){
				
				this.call_history.push({"time": moment(), "caller": payload})
				console.log(moment());
				
				this.sendNotification("SHOW_ALERT", {
					title: this.translate("title"),
					message: "<span style='font-size:" + this.config.NumberFontSize + "'>" + payload + "<span>",
					imageFA: "phone"
				});
				this.updateDom(3000);
			}
			if (payload == "clear"){
				this.sendNotification("HIDE_ALERT");
			}
			
		}
	},
	
	start: function() {
		this.call_history = []
		// Schedule update interval.
		var self = this;
		
		//Update doom
		setInterval(function() {
			self.updateDom();
		}, 60000);
		
		//Open Socket connection
		this.sendSocketNotification("CONFIG", this.config);
		Log.info("Starting module: " + this.name);
	},
	
	getDom: function() {
		for (var i = 0; i < this.call_history.length; i++) {
			if ( moment(moment()).diff(moment(this.call_history[i].time)) > this.config.maximumEntrieDistance * 60000 ){
				this.call_history.splice(i, 1);
		}
	}
		
		var calls = this.call_history.slice(this.call_history.length - this.config.maximumEntries, this.call_history.length);
		
		var wrapper = document.createElement("table");
		wrapper.className = "small";

		if (calls.length === 0) {
			wrapper.innerHTML = this.translate("noCall");
			wrapper.className = "xsmall dimmed";
			return wrapper;
		}
		
		for (var i = 0; i < calls.length; i++) {
			
			var callWrapper = document.createElement("tr");
			callWrapper.className = "normal";

			var caller =  document.createElement("td");
			caller.innerHTML = calls[i].caller;
			caller.className = "title bright";
			callWrapper.appendChild(caller);

			var time =  document.createElement("td");
			time.innerHTML = moment(calls[i].time).fromNow();
			time.className = "time light xsmall";
			callWrapper.appendChild(time);

			wrapper.appendChild(callWrapper);
			
			
			// Create fade effect by MichMich (MIT)
			if (this.config.fade && this.config.fadePoint < 1) {
				if (this.config.fadePoint < 0) {
					this.config.fadePoint = 0;
				}
				var startingPoint = calls.length * this.config.fadePoint;
				var steps = calls.length - startingPoint;
				if (i >= startingPoint) {
					var currentStep = i - startingPoint;
					callWrapper.style.opacity = 1 - (1 / steps * currentStep);
				}
			}
			// End Create fade effect by MichMich (MIT)
		}
		return wrapper;
	}

});