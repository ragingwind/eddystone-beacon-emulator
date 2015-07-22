'use strict';

var bleno = require('./bleno-extend');
var ESFrame = require('./eddystone-frame');
var timer = 0x00000000;
var count = 0x00000000

function advertise(opts, done) {
	opts = opts || {};

	var frame = new ESFrame();
	frame.push(0x20);
	frame.pushTxPower(0x00);
	frame.push(opts.vol, 2);
	frame.push(opts.temp, 2);
	frame.push(count += 0x1, 4);
	frame.push(timer += 0x1, 4);

	// bleno events handling
	var events = [
		'advertisingStart', 'advertisingStop', 'advertisingStartError', 'servicesSetError'
	];

	events.every(function (e) {
		bleno.once(e, function (err) {
			console.log('[TLM]', e, 'with', err ? err : 'no error');
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
