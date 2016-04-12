'use strict';
const NodeHelper = require('node_helper');
const CallMonitor = require('node-fritzbox-callmonitor');
require('./addressbook.js');

module.exports = NodeHelper.create({
  // Subclass start method.
  start: function() {
    var self = this;
    var fritzbox = {
      address: '192.168.178.1', //change IP here!
      port: '1012'
      };
    console.log('Starting module: ' + this.name);
    var monitor = new CallMonitor(fritzbox.address, fritzbox.port);

    //Logic
    monitor.on('inbound', function (call) {
        if (call.caller != "") {
            if (a_obj[call.caller]) {
              self.sendSocketNotification('call', a_obj[call.caller]);
            }
            if (!a_obj[call.caller]) {
              self.sendSocketNotification('call', call.caller);
            }
            };
    });

    monitor.on('disconnected', function (call) {
         self.sendSocketNotification('call', 'clear');
    });
  }
});
