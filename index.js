'use strict';

var bleno = require('bleno');
var beacon = require('eddystone-beacon');
var uid = require('eddystone-uid');
var RandomMeasure = require('random-measure');
var PulseBeat = require('pulsebeat');

function createMeasurer(range) {
	return RandomMeasure.isRange(range) ? new RandomMeasure(range) : {
		measure: function() {
			return range;
		}
	};
}

function advertise(opts) {
	var voltMeasurer = createMeasurer(opts.volt);
	var tempMeasurer = createMeasurer(opts.temp);
	var namespace = uid.toNamespace(opts.nid);
	var instanceId = uid.toBeaconId(opts.bid);
	var advertiseOpts = {
	  tlmCount: opts.tlm || 2,
	  tlmPeriod: 10,
		txPowerLevel: opts.tx
	};

	var advertiers = new PulseBeat([
		function() {
			console.log('Advertise for UID with namespace: %s, instance ID: %s', namespace, instanceId);
			beacon.advertiseUid(namespace, instanceId, advertiseOpts);
		},
		function() {
			console.log('Advertise for URL with url: %s', opts.url);
			beacon.advertiseUrl(opts.url, advertiseOpts);
		},
		function() {
			var volt = voltMeasurer.measure();
			var temp = tempMeasurer.measure();

			console.log('TLM data is updated to voltage: %s, temprature: %s', volt, temp);

			beacon.setBatteryVoltage(volt);
			beacon.setTemperature(temp);
		}
	]);

	console.log('UID/URL/TLM advertising services will be starting');

	// start TLM advertising
	beacon.advertiseTlm();

	// start UID/URL advertising
	advertiers.beat({timeout: 2000, interval:true});

	// bind to bleno events
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
