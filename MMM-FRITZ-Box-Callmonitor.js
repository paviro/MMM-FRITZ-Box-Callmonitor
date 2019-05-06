/* global Module */

/* Magic Mirror
 * Module: MMM-FRITZ-Box-Callmonitor
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */
const CALL_TYPE = Object.freeze({
	INCOMING: "1",
	MISSED: "2",
	OUTGOING: "3"
})
Module.register("MMM-FRITZ-Box-Callmonitor", {

	requiresVersion: "2.0.0",

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
		debug: false,
		fadePoint: 0.25,
		username: "",
		password: "",
		reloadContactsInterval: 30, // 30 minutes, set to 0 to disable
		deviceFilter: [], // [] means no filtering
		showContactsStatus: false,
		showOutgoing: false,
		colorEnabled: false
	},

	// Define required translations.
	getTranslations: function () {
		return {
			en: "translations/en.json",
			de: "translations/de.json"
		};
	},

	/*
	 * ToDo: enable the following method after version MM 2.1.0 is released
	 */
	//getHeader: function() {
	//	return this.data.header + this.getContactsSymbol();
	//},

	getScripts: function () {
		return ["moment.js"];
	},

	getStyles: function () {
		return ["font-awesome.css", "MMM-FRITZ-Box-Callmonitor.css"];
	},

	start: function () {
		//Create callHistory array
		this.callHistory = [];
		this.activeAlert = null;
		//Set helper variable this so it is available in the timer
		var self = this;
		//Update doom every minute so that the time of the call updates and calls get removed after a certain time
		setInterval(function () {
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
			setInterval(function () {
				self.sendSocketNotification("RELOAD_CONTACTS");
			}, this.config.reloadContactsInterval * 60000);
		}

		Log.info("Starting module: " + this.name);
	},

	// Override socket notification handler.
	socketNotificationReceived: function (notification, payload) {
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
				// if we have an API connection, check if the call was really missed
				this.sendSocketNotification("RELOAD_CALLS");
			} else {
				//Add call to callHistory (timestamp and caller) or if minimumCallLength is set only missed calls
				if (this.config.minimumCallLength === 0 || payload.duration <= this.config.minimumCallLength) {
					this.callHistory.unshift({ "time": moment(), "caller": payload.caller });
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

			if (this.errorCode === "network_error") {
				// clear previous network errors, since we got a connection now
				this.contactLoadError = false;
				this.errorCode = "";
			}
			if (this.config.showContactsStatus) {
				this.updateDom();
			}
		}
	},

	getContactsSymbol: function () {
		var html = "";
		if (this.config.showContactsStatus && (this.config.vCard || this.config.password !== "")) {
			html += " (<span class='small fa fa-book'/></span>";

			if (this.contactsLoaded) {
				html += " " + this.numberOfContacts;
			}
			else {
				html += " <span class='small fa fa-refresh fa-spin fa-fw'></span>";
			}
			if (this.contactLoadError) {
				html += " <span class='small fa fa-exclamation-triangle'/></span> ";
				html += this.translate(this.errorCode);
			}
			html += ")";
		}
		return html;
	},

	sortHistory: function () {
		var history = this.callHistory;

		//Sort history by time
		history.sort(function (a, b) {
			return moment(moment(a.time)).diff(moment(b.time)) < 0;
		});

		this.callHistory = history;
	},

	trimHistory: function () {
		var history = this.callHistory;

		//For each call in callHistory
		for (var i = 0; i < history.length; i++) {
			//Check if call is older than maximumCallDistance
			if (moment(moment()).diff(moment(history[i].time)) > this.config.maximumCallDistance * 60000) {
				//is older -> remove from list
				history.splice(i, 1);
				i--;
			}
		}

		this.callHistory = history;
	},

	getDom: function () {
		//remove old calls
		this.sortHistory();
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

			// ToDo: remove this line after version MM 2.1.0 is released
			content += this.getContactsSymbol();

			wrapper.innerHTML = content;
			wrapper.className = "xsmall dimmed";
			return wrapper;
		}

		//For each call in calls
		for (var i = 0; i < calls.length; i++) {

			//Create callWrapper
			var callWrapper = document.createElement("tr");
			callWrapper.className = "normal";

			//Set icon
			var icon = document.createElement("i")
			icon.style = "padding-right: 10px"
			switch (calls[i].type) {
				case CALL_TYPE.INCOMING:
					icon.className = "fas fa-long-arrow-alt-down"
					break
				case CALL_TYPE.OUTGOING:
					//Skip outgoing calls if not wanted
					if (!this.config.showOutgoing)
						continue
					icon.className = "fas fa-long-arrow-alt-up"
					break
				case CALL_TYPE.MISSED:
					if (this.config.colorEnabled)
						icon.style += ";color: red"
					icon.className = "fas fa-times"
					break
			}
			callWrapper.appendChild(icon);

			//Set caller of row
			var caller = document.createElement("td");
			caller.innerHTML = calls[i].caller;
			caller.className = "title bright";
			callWrapper.appendChild(caller);

			//Set time of row
			var time = document.createElement("td");
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
	},

	/* cmpVersions(a,b)
	 * Compare two symantic version numbers and return the difference.
	 *
	 * argument a string - Version number a.
	 * argument a string - Version number b.
	 */
	cmpVersions: function (a, b) {
		var i, diff;
		var regExStrip0 = /(\.0+)+$/;
		var segmentsA = a.replace(regExStrip0, "").split(".");
		var segmentsB = b.replace(regExStrip0, "").split(".");
		var l = Math.min(segmentsA.length, segmentsB.length);

		for (i = 0; i < l; i++) {
			diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
			if (diff) {
				return diff;
			}
		}
		return segmentsA.length - segmentsB.length;
	}

});
