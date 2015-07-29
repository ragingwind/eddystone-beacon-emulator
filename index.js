'use strict';

var bleno = require('bleno');
var beacon = require('eddystone-beacon');
var uid = require('./lib/eddystone-uid');
var PulseBeat = require('pulsebeat');

function randomBatteryVoltage() {
	// between 500 and 10,000
	return Math.floor((Math.random() * 10000) + 500);
}

function randomTemprature() {
	// between -128.0(0x8000) ~ 128.0
	return (Math.random() * 60.0);
}
function advertise(opts) {
	console.log('Start advertising TLM', opts);

	var advertiers = new PulseBeat([
		function() {
			console.log('Start advertising for UID');
			beacon.advertiseUid(uid.toNamespace(opts.nid), uid.toHexInstanceId(opts.bid), {
				txPowerLevel: opts.tx
			});
		},
		// function() {
		// 	console.log('Start advertising for URL');
		// 	beacon.advertiseUrl(opts.url, {txPowerLevel: opts.tx});
		// },
		function() {
			console.log('Start advertising for TLM');
			var volt = opts.volt || randomBatteryVoltage();
			var temp = opts.temp || randomTemprature();

			// console.log(volt, temp);
			beacon.setBatteryVoltage(volt);
			beacon.setTemperature(temp);
			beacon.advertiseTlm();
		}
	]);

	beacon.advertiseUid(uid.toNamespace(opts.nid), uid.toHexInstanceId(opts.bid), {
		txPowerLevel: opts.tx
	});

	beacon.advertiseUrl(opts.url, {txPowerLevel: opts.tx});

	// advertiers.beat();
	var volt = opts.volt || randomBatteryVoltage();
	var temp = opts.temp || randomTemprature();

	console.log(volt, temp);
	beacon.setBatteryVoltage(volt);
	beacon.advertiseTlm();

	bleno.on('advertisingStart', function (err) {
		console.log('Advertising has been started. next advertising will being started after 2sec');
		// advertiers.beat({timeout: 2000});
	});

	// advertise-queue

	// 	opts, function () {
	// // tlm.advertise(opts, function () {
	// 	setTimeout(function () {
	// 		console.log('Start advertising URL');
	// 		url.advertise(opts, function () {
	// 			setTimeout(function () {
	// 				advertise(opts);
	// 			}, 3000);
	// 		});
	// 	}, 1000);
	// });
}

function start(opts) {
	// if (opts.config) {
	// 	config.advertise(function(err) {
	// 		if (!err) {
	// 			advertise(opts);
	// 		} else {
	// 			done(err);
	// 		}
	// 	});
	// } else {
	advertise(opts);
	// }
}

module.exports = {
	advertise: start
};
