'use strict';
const io = require('socket.io').listen(2344);
const net = require('net');
const CallMonitor = require('node-fritzbox-callmonitor');

process.on('uncaughtException', function (err) {
  console.log("[" + Date() + "]: " + err);
});

//Callmonitor
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
            io.sockets.emit('call', a_obj[call.caller]);
        }
        if (!a_obj[call.caller]) { 
            io.sockets.emit('call', call.caller);
        }
        };
});

monitor.on('disconnected', function (call) {
    io.sockets.emit('call', 'clear');
});

//End Callmonitor