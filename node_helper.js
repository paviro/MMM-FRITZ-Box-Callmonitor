'use strict';
const NodeHelper = require('node_helper');
const CallMonitor = require('node-fritzbox-callmonitor');
var vcard = require('vcard-json');
var phone = require('phone-formatter');

module.exports = NodeHelper.create({
  // Subclass start method.
  start: function() {
    this.started = false
    console.log('Starting module: ' + this.name);
  },
  
  getName: function (number) {
    //Normalize number
    var number_formatted = phone.normalize(number.replace(/\s/g, ''))
    //Check if number is in AdressBook if yes return the name
    if (number_formatted in this.AddressBook){
      return this.AddressBook[number_formatted]
    }
    //Not in AdressBook return original number
    else {
      return number
    }
  },
  
  socketNotificationReceived: function(notification, payload) {
    //Received config from client
    if(notification === 'CONFIG') {
      //set config to config send by client
      this.config = payload
      //if monitor has not been started before (makes sure it does not get started again if the web interface is reloaded)
      if(!this.started) {
        //set started to true, so it won't start again
        this.started = true;
        console.log('Received config for ' + this.name);
        //helper variable so that the module-this is available inside our monitor
        var self = this;
        //Set up CallMonitor with config received from client
        var monitor = new CallMonitor(this.config.fritzIP, this.config.fritzPort);
        
        //If path to contact file is given
        if (this.config.vCard){
          //create adressbook dictionary 
          this.AddressBook = {}
          //Parse contact file
          vcard.parseVcardFile(this.config.vCard, function(err, data){
            //In case there is an error reading the vcard file
            if(err) console.log('[' + this.name + '] ' + err);
            //success
            else {
              //For each contact in vcf file
              for (var i = 0; i < data.length; i++) {
                //For each phone number in contact
                for (var a = 0; a < data[i].phone.length; a++) {
                    //normalize and add to AddressBook
                    self.AddressBook[phone.normalize(data[i].phone[a].value.replace(/\s/g, ''))] = data[i].fullname
                  }
                }
            }
          })
        }
        
        //Incoming call
        monitor.on('inbound', function (call) {
            //If caller is not empty
            if (call.caller != "") {
                //if path to contact file is given
                if (self.config.vCard){
                  //Get name via getName() and send to interface
                  self.sendSocketNotification('call', self.getName(call.caller));
                }
                //path to contact file is not given
                else {
                  //send raw number to interface
                  self.sendSocketNotification('call', call.caller);
                }
            };
        });

        //Caller disconnected / Call accepted
        monitor.on('disconnected', function (call) {
             //send clear command to interface
             self.sendSocketNotification('call', 'clear');
        });
        console.log(this.name + " is waiting for incoming calls.");
      };
    };
  }
});
