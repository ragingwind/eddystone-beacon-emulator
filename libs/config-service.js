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
			properties: ['read', 'write'],
			onReadRequest: readUriData,
			onWriteRequest: writeUriData
	},
	flags: {
			uuid: 'ee0c2085-8786-40ba-ab96-99b91ac981d8',
			properties: ['read', 'write'],
			onReadRequest: readFlags,
			onWriteRequest: writeFlags
	},
	txPowerLevel: {
			uuid: 'ee0c2086-8786-40ba-ab96-99b91ac981d8',
			properties: ['read', 'write'],
			onReadRequest: readTxPowerLevel,
			onWriteRequest: writeTxPowerLevel
	},
	txPowerMode: {
			uuid: 'ee0c2087-8786-40ba-ab96-99b91ac981d8',
			properties: ['read', 'write'],
			onReadRequest: readTxPowerMode,
			onWriteRequest: writeTxPowerMode
	},
	beaconPeriod: {
			uuid: 'ee0c2088-8786-40ba-ab96-99b91ac981d8',
			properties: ['read', 'write'],
			onReadRequest: readBeaconPeriod,
			onWriteRequest: writeBeaconPeriod
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

var uri;
var flags;
var txPowerLevel;
var txPowerMode;
var period;
var zeroPeriod = false;
var lowPeriod = false;

function lockStateOnReadRequest(offset, callback) {
	var state = Boolean(false);

	console.log('lockStateOnReadRequest', this.RESULT_SUCCESS, state);

	callback(this.RESULT_SUCCESS, state);
}

function resetOnWriteRequest(data, offset, withoutResponse, callback) {
	console.log('resetOnWriteRequest', data, offset);

	callback(this.RESULT_SUCCESS);
}

// uri data reading / writing, uint8[0..18]
// The first byte contains the URI Scheme Prefix.
// The remaining bytes contain the HTTP URL encoding.
function writeUriData(data, offset, withoutResponse, callback) {
	console.log('writeUriData len:%d', data.length, offset);

	uri = new Buffer(data);

	callback(this.RESULT_SUCCESS);
}

function readUriData(offset, callback) {
	console.log('readUriData', this.RESULT_SUCCESS, uri);

	callback(this.RESULT_SUCCESS, uri);
}

// flag writing, uint8[1]
// Flags characteristic is a single unsigned byte value
// containing the Eddystone-URL Flags
function writeFlags(data, offset, withoutResponse, callback) {
	console.log('writeFlags len:%d', data.length, offset);

	flags = new Buffer(data);

	callback(this.RESULT_SUCCESS);
}

function readFlags(offset, callback) {
	console.log('readFlags', this.RESULT_SUCCESS, flags);

	callback(this.RESULT_SUCCESS, flags);
}

// TX Power Level, int8[4]
// This characteristic is a fixed length array of values, in dBm,
// to be included in the Eddystone-URL TX Power Level field of the
// advertisement when that mode is active. The index into the array
// is TX Power Mode
// Tx power is the received power at 0 meters, in dBm, and the value
// ranges from -100 dBm to +20 dBm to a resolution of 1 dBm
// [Tx Power Level](https://goo.gl/31sDod)
function writeTxPowerLevel(data, offset, withoutResponse, callback) {
	console.log('writeTxPowerLevel len:%d', data.length, offset);

	txPowerLevel = new Buffer(data);

	callback(this.RESULT_SUCCESS);
}

function readTxPowerLevel(offset, callback) {
	console.log('readTxPowerLevel', this.RESULT_SUCCESS, txPowerLevel);

	callback(this.RESULT_SUCCESS, txPowerLevel);
}

// TX Power Mode, uint8
var TX_POWER_MODE_HIGH = 3;
var TX_POWER_MODE_MEDIUM = 2;
var TX_POWER_MODE_LOW = 1;
var TX_POWER_MODE_LOWEST = 0;

function writeTxPowerMode(data, offset, withoutResponse, callback) {
	console.log('writeTxPowerMode len:%d', data.length, offset);

	txPowerMode= new Buffer(data);

	callback(this.RESULT_SUCCESS);
}

function readTxPowerMode(offset, callback) {
	console.log('readTxPowerMode', this.RESULT_SUCCESS, txPowerMode);

	callback(this.RESULT_SUCCESS, txPowerMode);
}

// Becon Period, uint16, For write, must be unlocked
// The period in milliseconds that a Eddystone-URL packet is transmitted.
// A value of zero disables Eddystone-URL transmissions
// Setting a period value that the hardware doesn't support should default
// to minimum value the hardware supports.
var BEACON_PERIOD_LOWEST = 10;

function writeBeaconPeriod(data, offset, withoutResponse, callback) {
	var updatePeriod = data.readUInt16LE(0);

	if (updatePeriod >= BEACON_PERIOD_LOWEST) {
		period = new Buffer(data);
		zeroPeriod = false;
		lowPeriod = false;
		console.log('Beacon period has been updated to', period.readUInt16LE(0), period);
	} else if (updatePeriod === 0) {
		console.log('Becaon period === 0, advertising will be stopped')
		zeroPeriod = true;
	} else {
		lowPeriod = true;
		zeroPeriod = false;
	}

	callback(this.RESULT_SUCCESS);
}

function readBeaconPeriod(offset, callback) {
	var currentPeriod = period;
	var result = this.RESULT_SUCCESS;

	if (zeroPeriod) {
		currentPeriod = new Buffer(2);
		currentPeriod.fill(0);
	}

	if (lowPeriod) {
		// result = 0x03;
	}

	console.log('Response beacon period', result,
								period.readUInt16LE(0), currentPeriod.readUInt16LE(0));

	callback(result, currentPeriod);
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
	function start() {
		if (bleno.state === 'poweredOn') {
			bleno.startAdvertising('Eddy Stone Config Mode',['ee0c2080-8786-40ba-ab96-99b91ac981d8']);
		} else {
			bleno.once('stateChange', function() {
				start();
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

	start();
}

module.exports = {
	advertise: advertiseConfigService
};
