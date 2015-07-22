'use strict';

var bleno = require('./bleno-extend');
var ESFrame = require('./eddystone-frame');

function advertise(opts, done) {
	opts = opts || {};

	if (!opts.fqdn && !opts.uuid) {
		throw new Error('Namespace, such as FQDN or UUID must be exist');
	} else if (!opts.bid) {
		throw new Error('Beacon ID must be exist');
	}

	var frame = new ESFrame();
	frame.push(0x10);
	frame.pushTxPower(opts.tx);
	frame.pushURL(opts.url);

	// bleno events handling
	var events = [
		'advertisingStart', 'advertisingStop', 'advertisingStartError', 'servicesSetError'
	];

	events.every(function (e) {
		bleno.once(e, function (err) {
			console.log('[URL]', e, 'with', err ? err : 'no error');
			if (done) {
				done(err, e);
			}
		});
	});

	bleno.startAdvertisingWithEIRDataOnPowered(frame.toBuffer());
}

module.exports = {
	advertise: advertise
};
