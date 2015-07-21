'use strict';

var assert = require('assert');
var ESFrame = require('../lib/eddystone-frame.js');

var EDDYSTONE_FRAME = [
	0x02,
	0x01,
	0x06,
	0x03,
	0x03,
	0xAA,
	0xFE,
	0x0B,
	0x16,
	0xAA,
	0xFE
];

it('should returns valid header frame', function () {
	var frame = new ESFrame();
	var buffer = frame.getBuffer();

	assert(EDDYSTONE_FRAME.every(function (val, idx) {
		return val === buffer[idx];
	}));
});

it('should returns valid Eddystone UID frames', function () {
	var frame = new ESFrame();
	var buffer;

	frame.push(0x00)
			 .push(-21)
			 .push('namespaces')
			 .push('beacon')
			 .push(0x0001, 2);

	buffer = frame.getBuffer();

	// verify bytes written to buffer
	assert(buffer.length === 31);
	// verify UID service flag
	assert(buffer[11] === 0x00);
	// verify TX Power 0xEB is interpreted as -21dBm
	assert(buffer[12] === 0xeb);
	// verify namespaces
	assert(buffer[13] === 'n'.charCodeAt(0));
	assert(buffer[14] === 'a'.charCodeAt(0));
	assert(buffer[15] === 'm'.charCodeAt(0));
	assert(buffer[16] === 'e'.charCodeAt(0));
	assert(buffer[17] === 's'.charCodeAt(0));
	assert(buffer[18] === 'p'.charCodeAt(0));
	assert(buffer[19] === 'a'.charCodeAt(0));
	assert(buffer[20] === 'c'.charCodeAt(0));
	assert(buffer[21] === 'e'.charCodeAt(0));
	assert(buffer[22] === 's'.charCodeAt(0));
	// verify beacon id
	assert(buffer[23] === 'b'.charCodeAt(0));
	assert(buffer[24] === 'e'.charCodeAt(0));
	assert(buffer[25] === 'a'.charCodeAt(0));
	assert(buffer[26] === 'c'.charCodeAt(0));
	assert(buffer[27] === 'o'.charCodeAt(0));
	assert(buffer[28] === 'n'.charCodeAt(0));
	// verify RFU
	assert(buffer[29] === 0x01);
	assert(buffer[30] === 0x00);
});
