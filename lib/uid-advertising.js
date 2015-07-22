'use strict';

var bleno = require('./bleno-extend');
var ESFrame = require('./eddystone-frame');

function advertise(opts, done) {
	opts = opts || {};

	if (!opts.url) {
		throw new Error('URL for advertising must be exist');
	}

	var frame = new ESFrame();
	frame.push(0x00);
	frame.pushTxPower(0);
	opts.fqdn ? frame.pushFQDN(opts.fqdn) : frame.pushUUID(opts.uuid);
 	frame.push(opts.bid, 6);
	frame.push(0x0000, 2);

	// bleno events handling
	var events = [
		'advertisingStart', 'advertisingStop', 'advertisingStartError', 'servicesSetError'
	];

	events.every(function (e) {
		bleno.once(e, function (err) {
			console.log('[UID]', e, 'with', err ? err : 'no error');
			done && done(err, e);
		});
	});

	bleno.startAdvertisingWithEIRDataOnPowered(frame.toBuffer());
}

module.exports = {
	advertise: advertise
};
