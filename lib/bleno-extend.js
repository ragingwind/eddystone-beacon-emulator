'use strict';

var bleno = require('bleno');

bleno.startAdvertisingOnPowered = function (name, serviceUuids, callback) {
	function start() {
		if (bleno.state === 'poweredOn') {
			bleno.startAdvertising(name, uuids, done);
		} else {
			bleno.once('stateChange', function() {
				start();
			});
		}
	}

	start();
};

bleno.startAdvertisingWithEIRDataOnPowered = function (advertisementData, scanData, callback) {
	function start(characteristics) {
		if (bleno.state === 'poweredOn') {
			console.log('startAdvertisingWithEIRData', advertisementData, advertisementData.length);
			bleno.startAdvertisingWithEIRData(advertisementData, scanData, callback);
		} else {
			bleno.once('stateChange', function() {
				start();
			});
		}
	}

	start();
};

module.exports = bleno;
