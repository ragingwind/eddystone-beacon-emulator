/*global it:true */
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
	0x03,
	0x16,
	0xAA,
	0xFE
];

it('should returns valid header frame', function () {
	var buffer;
	var frame = new ESFrame();

	buffer = frame.toBuffer();
	assert(EDDYSTONE_FRAME.every(function (val, idx) {
		return val === buffer[idx];
	}));
});

it('should write to limit length', function () {
	var frame = new ESFrame();

	frame.push('1234567890', 5);
	assert(frame.toBuffer().length === 16);

	frame.push(0x02, 1);
	assert(frame.toBuffer().length === 17);

	frame.push(0x0203, 2);
	assert(frame.toBuffer().length === 19);
});

it('should written namespace with hashed domain', function () {
	var buffer;
	var frame = new ESFrame();

	frame.pushFQDN('host.eddystone.com');

	buffer = frame.toBuffer();
	assert(buffer[7] === (3 + 10));
	assert(buffer[11] === 0x37);
	assert(buffer[12] === 0x38);
	assert(buffer[13] === 0x34);
	assert(buffer[14] === 0x61);
	assert(buffer[15] === 0x64);
	assert(buffer[16] === 0x63);
	assert(buffer[17] === 0x30);
	assert(buffer[18] === 0x36);
	assert(buffer[19] === 0x64);
	assert(buffer[20] === 0x36);
});

it('should written namespace with truncated uuid', function () {
	var buffer;
	var frame = new ESFrame();

	frame.pushUUID('8b0ca750-e7a7-4e14-bd99-095477cb3e77');

	buffer = frame.toBuffer();
	assert(buffer[7] === (3 + 10));
	// 8b0ca750095477cb3e77
	assert(buffer[11] === 0x38);
	assert(buffer[12] === 0x62);
	assert(buffer[13] === 0x30);
	assert(buffer[14] === 0x63);
	assert(buffer[15] === 0x61);
	assert(buffer[16] === 0x37);
	assert(buffer[17] === 0x35);
	assert(buffer[18] === 0x30);
	assert(buffer[19] === 0x30);
	assert(buffer[20] === 0x39);
});

it('should written with encoded url', function () {
	var buffer;

	var frame = new ESFrame();
	frame.pushURL('http://www.1234.com/56789');
	buffer = frame.toBuffer();

	// verify bytes length written to buffer
	assert(buffer.length === (11 + 1 + 4 + 1 + 6));
	assert(buffer[7] === (3 + 1 + 4 + 1 + 6));

	// verify encoded URL
	assert(buffer[11] === 0x00);
	assert(buffer[12] === '1'.charCodeAt(0));
	assert(buffer[13] === '2'.charCodeAt(0));
	assert(buffer[14] === '3'.charCodeAt(0));
	assert(buffer[15] === '4'.charCodeAt(0));
	assert(buffer[16] === 0x07);
	assert(buffer[17] === '/'.charCodeAt(0));
	assert(buffer[18] === '5'.charCodeAt(0));
	assert(buffer[19] === '6'.charCodeAt(0));
	assert(buffer[20] === '7'.charCodeAt(0));
	assert(buffer[21] === '8'.charCodeAt(0));
	assert(buffer[22] === '9'.charCodeAt(0));

	frame = new ESFrame();
	frame.pushURL('https://goo.gl/Aq18zF');
	buffer = frame.toBuffer();

	// verify bytes length written to buffer
	assert(buffer.length === (11 + 1 + 13));
	assert(buffer[7] === (3 + 1 + 13));

	// verify encoded URL
	assert(buffer[11] === 0x03);
	assert(buffer[12] === 'g'.charCodeAt(0));
	assert(buffer[13] === 'o'.charCodeAt(0));
	assert(buffer[14] === 'o'.charCodeAt(0));
	assert(buffer[15] === '.'.charCodeAt(0));
	assert(buffer[16] === 'g'.charCodeAt(0));
	assert(buffer[17] === 'l'.charCodeAt(0));
	assert(buffer[18] === '/'.charCodeAt(0));
	assert(buffer[19] === 'A'.charCodeAt(0));
	assert(buffer[20] === 'q'.charCodeAt(0));
	assert(buffer[21] === '1'.charCodeAt(0));
	assert(buffer[22] === '8'.charCodeAt(0));
	assert(buffer[23] === 'z'.charCodeAt(0));
	assert(buffer[24] === 'F'.charCodeAt(0));
});

it('should returns valid Eddystone UID frames', function () {
	var buffer;
	var frame = new ESFrame();

	frame.push(0x00)
			 .push(-21)
			 .push('namespaces')
			 .push('beacon')
			 .push(0x0001, 2);

	buffer = frame.toBuffer();

	// verify bytes length written to buffer
	assert(buffer.length === (11 + 1 + 1 + 10 + 6 + 2));
	assert(buffer[7] === (3 + 1 + 1 + 10 + 6 + 2));
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

it('should returns valid Eddystone URL frames', function () {
	var buffer;
	var frame = new ESFrame();

	frame.push(0x10)
			 .push(18)
			 .push(1)
			 .push('google')
			 .push(0)
			 .push('eddy');

	buffer = frame.toBuffer();

	// verify bytes length written to buffer
	assert(buffer.length === (11 + 1 + 1 + 1 + 6 + 1 + 4));
	assert(buffer[7] === (3 + 1 + 1 + 1 + 6 + 1 + 4));
	// verify UID service flag
	assert(buffer[11] === 0x10);
	// verify TX Power 0x12 is interpreted as -18dBm
	assert(buffer[12] === 0x12);
	// verify URL Scheme
	assert(buffer[13] === 1);
	// verify URL plain text
	assert(buffer[14] === 'g'.charCodeAt(0));
	assert(buffer[15] === 'o'.charCodeAt(0));
	assert(buffer[16] === 'o'.charCodeAt(0));
	assert(buffer[17] === 'g'.charCodeAt(0));
	assert(buffer[18] === 'l'.charCodeAt(0));
	assert(buffer[19] === 'e'.charCodeAt(0));
	// verify .com/
	assert(buffer[20] === 0);
	// rest parst of the URL
	assert(buffer[21] === 'e'.charCodeAt(0));
	assert(buffer[22] === 'd'.charCodeAt(0));
	assert(buffer[23] === 'd'.charCodeAt(0));
	assert(buffer[24] === 'y'.charCodeAt(0));
});

it('should returns valid Eddystone TLM frames', function () {
	var buffer;
	var frame = new ESFrame();

	frame.push(0x20)
			 .push(0x00)
			 .push(0x0000, 2)
			 .push(0x8000, 2)
			 .push(10000, 4)
			 .push(12345, 4);

	buffer = frame.toBuffer();

	// verify bytes length written to buffer
	assert(buffer.length === (11 + 1 + 1 + 2 + 2 + 4 + 4));
	assert(buffer[7] === 0x11); // Fixed length
	// verify UID service flag
	assert(buffer[11] === 0x20);
	// TLM Vresion
	assert(buffer[12] === 0x00);
	// Battery voltage, If not supported to use 0x0000
	assert(buffer[13] === 0x00);
	assert(buffer[14] === 0x00);
	// Beacon temprature, If not supported to use 0x8000
	assert(buffer[15] === 0x00);
	assert(buffer[16] === 0x80);
	// Advertising count
	assert(buffer[17] === 0x10);
	assert(buffer[18] === 0x27);
	assert(buffer[19] === 0x00);
	assert(buffer[20] === 0x00);
	// Time since power-on
	assert(buffer[21] === 0x39);
	assert(buffer[22] === 0x30);
	assert(buffer[23] === 0x00);
	assert(buffer[24] === 0x00);
});
