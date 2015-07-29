'use strict';

var bleno = require('bleno');
var beacon = require('eddystone-beacon');
var uid = require('./lib/eddystone-uid');
var PulseBeat = require('pulsebeat');

// randomize functions for simulator.
// code copy from [node-eddystone-beacon](https://goo.gl/9BbmDW)
function randomBatteryVoltage() {
	// between 500 and 10,000
	return Math.floor((Math.random() * 10000) + 500);
}

function randomTemprature() {
	// between -128.0(0x8000) ~ 128.0
	return (Math.random() * 256.0) - 128.0;
}

function advertise(opts) {
	console.log('Start advertising TLM', opts);

	var options = {
	  tlmCount: 2,  // 2 TLM frames
	  tlmPeriod: 10, // every 10 frames
		txPowerLevel: opts.tx
	};

	var advertiers = new PulseBeat([
		function() {
			var namespace = uid.toNamespace(opts.nid);
			var instanceId = uid.toHexInstanceId(opts.bid);

			console.log('Start advertising for UID. namespace: %s, instance ID: %s', namespace, instanceId);
			beacon.advertiseUid(namespace, instanceId, options);
		},
		function() {
			console.log('Start advertising for URL', opts.url);
			beacon.advertiseUrl(opts.url, options);
		},
		function() {
			var volt = opts.volt || randomBatteryVoltage();
			var temp = opts.temp || randomTemprature();

			console.log('Update telemetry data to voltage: %s, temprature: %s', volt, temp);

			beacon.setBatteryVoltage(volt);
			beacon.setTemperature(temp);
		}
	]);

	advertiers.beat({timeout: 2000, interval:true});

	bleno.on('advertisingError', function (err) {
		console.log('Advertising has been failed');
	});
}

function start(opts) {
	advertise(opts);
}

module.exports = {
	advertise: start
};
