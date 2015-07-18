'use strict';

var util = require('util');
var bleno = require('bleno');
var BlenoCharacteristic = require('bleno').Characteristic;
var BlenoPrimaryService = bleno.PrimaryService;

var EddyStoneCharacteristics = {
	lockState: {
			uuid: 'ee0c2081-8786-40ba-ab96-99b91ac981d8',
			properties: ['read'],
			onReadRequest: lockStateOnReadRequest
	},
	lock: {
			uuid: 'ee0c2082-8786-40ba-ab96-99b91ac981d8',
			properties: ['read']
	},
	unlock: {
			uuid: 'ee0c2083-8786-40ba-ab96-99b91ac981d8',
			properties: ['writeWithoutResponse']
	},
	uriData: {
			uuid: 'ee0c2084-8786-40ba-ab96-99b91ac981d8',
			properties: ['read', 'write']
	},
	flags: {
			uuid: 'ee0c2085-8786-40ba-ab96-99b91ac981d8',
			properties: ['read']
	},
	txPowerLevel: {
			uuid: 'ee0c2086-8786-40ba-ab96-99b91ac981d8',
			properties: ['read']
	},
	txPowerMode: {
			uuid: 'ee0c2087-8786-40ba-ab96-99b91ac981d8',
			properties: ['read']
	},
	beconPeriod: {
			uuid: 'ee0c2088-8786-40ba-ab96-99b91ac981d8',
			properties: ['read']
	},
	reset: {
			uuid: 'ee0c2089-8786-40ba-ab96-99b91ac981d8',
			properties: ['writeWithoutResponse'],
			onWriteRequest: resetOnWriteRequest
	}
};

function Boolean(bool) {
  var buf = new Buffer(1);
  buf.fill(bool ? 1 : 0);
  return buf;
}

function lockStateOnReadRequest(offset, callback) {
	var state = Boolean(false);

	console.log('lockStateOnReadRequest', this.RESULT_SUCCESS, state);

	callback(this.RESULT_SUCCESS, state);
}

function resetOnWriteRequest(data, offset, withoutResponse, callback) {
	console.log('resetOnWriteRequest', data, offset);

	callback(this.RESULT_SUCCESS);
}

function generateCharacteristics() {
	return Object.keys(EddyStoneCharacteristics).map(function (ch) {
		var Characteristic = function() {
			Characteristic.super_.call(this, EddyStoneCharacteristics[ch]);
		};

		util.inherits(Characteristic, BlenoCharacteristic);
		return new Characteristic();
	});
}

function advertiseConfigService(opts, done) {
	function startAdvertising(characteristics) {
		if (bleno.state === 'poweredOn') {
			bleno.startAdvertising('Eddy Stone Config Mode',['ee0c2080-8786-40ba-ab96-99b91ac981d8']);
		} else {
			bleno.once('stateChange', function() {
				startAdvertising();
			});
		}
	}

	// After advertising is started, set up config services
	bleno.once('advertisingStart', function(err) {
	  console.log('CM:advertisingStart', err);

		if (err) {
			done(err);
			return;
		}

    bleno.setServices([
      new BlenoPrimaryService({
        uuid: 'ee0c2080-8786-40ba-ab96-99b91ac981d8',
        characteristics: generateCharacteristics()
      })
    ]);
	});

	bleno.once('advertisingStop', function(err) {
	  console.log('CM:advertisingStop', err);
		done(err);
	});

	bleno.once('advertisingStartError', function(err) {
	  console.log('CM:advertisingStartError', err);

		done(err);
	});

	bleno.once('servicesSetError', function (err) {
	  console.log('CM:servicesSetError', err);

		done(err);
	});

	startAdvertising();
}

module.exports = {
	advertise: advertiseConfigService
};
