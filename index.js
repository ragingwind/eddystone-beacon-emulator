'use strict';

var bleno = require('bleno');
var configService = require('./libs/config-service');

function advertise(opts) {
	if (bleno.state === 'poweredOn') {
		if (opts.configable) {
			configService.advertise(opts, function(err) {
				console.log('Ended of config service', err);
			});
		}
	} else {
		bleno.once('stateChange', function() {
			advertise(opts);
		});
	}
}

module.exports = {
	advertise: advertise
};
