'use strict';

var bleno = require('bleno');

function startAdvertising(url, opts) {
	function start(characteristics) {
		if (bleno.state === 'poweredOn') {
			bleno.startAdvertising('Eddy Stone Config Mode',['ee0c2080-8786-40ba-ab96-99b91ac981d8']);
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
