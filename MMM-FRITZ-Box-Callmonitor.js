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
		fadePoint: 0.25,
		username: "",
		password: "",
		reloadContactsInterval: 30, // 30 minutes, set to 0 to disable
		showContactsStatus: false
	},

	// Define required translations.
	getTranslations: function() {
		return {
			en: "translations/en.json",
			de: "translations/de.json"
		};
	},

	getScripts: function() {
		return ["moment.js"];
	},

	getStyles: function() {
		return ["font-awesome.css"];
	},

	start: function() {
		//Create callHistory array
		this.callHistory = [];
		this.activeAlert = null;
		//Set helper variable this so it is available in the timer
		var self = this;
		//Update doom every minute so that the time of the call updates and calls get removed after a certain time
		setInterval(function() {
			self.updateDom();
		}, 60000);

		this.contactsLoaded = false;
		this.numberOfContacts = 0;
		this.contactLoadError = false;
		this.errorCode = "";

		//Send config to the node helper
		this.sendSocketNotification("CONFIG", this.config);

		//set up the contact reloading
		if (this.config.password !== "" && this.config.reloadContactsInterval !== 0) {
			setInterval(function() {
				self.sendSocketNotification("RELOAD_CONTACTS");
			}, this.config.reloadContactsInterval * 60000);
		}

		Log.info("Starting module: " + this.name);
	},

	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "call") {
			//Show alert on UI
			this.sendNotification("SHOW_ALERT", {
				title: this.translate("title"),
				message: "<span style='font-size:" + this.config.numberFontSize.toString() + "px'>" + payload + "<span>",
				imageFA: "phone"
			});

			//Set active Alert to current call
			this.activeAlert = payload;
		}
		if (notification === "connected") {
			//Send notification for currentCall module
			this.sendNotification("CALL_CONNECTED", payload);

			//Remove alert only on connect if it is the current alert shown
			if (this.activeAlert === payload) {
				//Remove alert from UI when call is connected
				this.sendNotification("HIDE_ALERT");
				this.activeAlert = null;
			}
		}
		if (notification === "disconnected") {
			//Send notification for currentCall module
			this.sendNotification("CALL_DISCONNECTED", payload.caller);

			if (this.config.password !== "") {
				// if we have an API connection, check if the calls was really missed
				this.sendSocketNotification("RELOAD_CALLS");
			} else {
				//Add call to callHistory (timestamp and caller) or if minimumCallLength is set only missed calls
				if (payload.duration <= this.config.minimumCallLength) {
					this.callHistory.unshift({"time": moment(), "caller": payload.caller});
				}
				//Update call list on UI
				this.updateDom(3000);
			}

			//Remove alert only on disconnect if it is the current alert shown
			if (this.activeAlert === payload.caller) {
				//Remove alert from UI when call is connected
				this.sendNotification("HIDE_ALERT");
				this.activeAlert = null;
			}
		}
		if (notification === "call_history") {
			//update call history from API
			this.callHistory = payload;
			this.sortHistory();
			this.trimHistory();

			this.updateDom(3000);
		}
		if (notification === "error") {
			this.contactsLoaded = true;
			this.contactLoadError = true;
			this.errorCode = payload;

			if (this.config.showContactsStatus) {
				this.updateDom();
			}
		}
		if (notification === "contacts_loaded") {
			this.contactsLoaded = true;
			this.numberOfContacts = payload;

			if (this.config.showContactsStatus) {
				this.updateDom();
			}
		}
	},

	sortHistory: function() {
		var history = this.callHistory;

		//Sort history by time
		history.sort(function(a, b) {
			return moment(moment(a.time)).diff(moment(b.time)) < 0;
		});

		this.callHistory = history;
	},

	trimHistory: function() {
		var history = this.callHistory;

		//For each call in callHistory
		for (var i = 0; i < history.length; i++) {
			//Check if call is older than maximumCallDistance
			if (moment(moment()).diff(moment(history[i].time)) > this.config.maximumCallDistance * 60000) {
				//is older -> remove from list
				history.splice(i, i + 1);
				i--;
			}
		}

		this.callHistory = history;
	},

	getDom: function() {
		//remove old calls
		this.trimHistory();

		//get maximum number of calls from call history
		var calls = this.callHistory.slice(0, this.config.maximumCalls);

		//Create table
		var wrapper = document.createElement("table");
		//set table style
		wrapper.className = "small";

		//If there are no calls, set "noCall" text.
		if (calls.length === 0) {
			content = this.translate("noCall");
			if (this.config.showContactsStatus && (this.config.vCard || this.config.password !== ""))
			{
				content += " (<span class='small fa fa-book'/></span>";

				if (this.contactsLoaded)
				{
					content += " " + this.numberOfContacts;
				}
				else
				{
					content += " <span class='small fa fa-refresh fa-spin fa-fw'></span>";
				}
				if (this.contactLoadError)
				{
					content += " <span class='small fa fa-exclamation-triangle'/></span> ";
					content += this.translate(this.errorCode);
				}
				content += ")";
			}
			wrapper.innerHTML = content;
			wrapper.className = "xsmall dimmed";
			return wrapper;
		}

		//For each call in calls
		for (var i = 0; i < calls.length; i++) {

			//Create callWrapper
			var callWrapper = document.createElement("tr");
			callWrapper.className = "normal";

			//Set caller of row
			var caller =  document.createElement("td");
			caller.innerHTML = calls[i].caller;
			caller.className = "title bright";
			callWrapper.appendChild(caller);

			//Set time of row
			var time =  document.createElement("td");
			time.innerHTML = moment(calls[i].time).fromNow();
			time.className = "time light xsmall";
			callWrapper.appendChild(time);

			//Add to wrapper
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
