'use strict';

var bleno = require('bleno');

function startAdvertising(url, opts) {
	function start(characteristics) {
		if (bleno.state === 'poweredOn') {
			//
			bleno.startAdvertising();
		} else {
			bleno.once('stateChange', function() {
				start();
			});
		}
	}

	start();
}

function stopAdvertising() {
}

module.exports = {
	startAdvertising: startAdvertising,
	stopAdvertising: stopAdvertising
};
