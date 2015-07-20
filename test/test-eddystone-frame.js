'use strict';

var assert = require('assert');
var EddyStoneFrame = require('../lib/eddystone-frame.js');

var EDDYSTONE_FRAME = [
	0x00,
	0x01,
	0x06,
	0x03,
	0xAA,
	0xFE,
	0x10,
	0x16,
	0xAA,
	0xFE
];

it('should returns valid frame has been ordered', function () {
	var frame = new EddyStoneFrame();
	assert(EDDYSTONE_FRAME.every(function (val, idx) {
		return val === frame[idx];
	}));
});
