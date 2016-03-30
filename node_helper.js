'use strict';

const MMSocket = require('../../js/socketclient.js');
const socket = new MMSocket('MMM-FRITZ-Box-Callmonitor');
const CallMonitor = require('node-fritzbox-callmonitor');

process.on('uncaughtException', function (err) {
  console.log("[" + Date() + "]: " + err);
});

//Setup
require('./addressbook.js');
var fritzbox = {
  address: '192.168.178.1', //change IP here!
  port: '1012'
};
var monitor = new CallMonitor(fritzbox.address, fritzbox.port);

//Logic
monitor.on('inbound', function (call) {
    if (call.caller != "") {
        if (a_obj[call.caller]) { 
          socket.sendNotification('call', a_obj[call.caller]);
        }
        if (!a_obj[call.caller]) { 
          socket.sendNotification('call', call.caller);
        }
        };
});

monitor.on('disconnected', function (call) {
    socket.sendNotification('call', 'clear');
});