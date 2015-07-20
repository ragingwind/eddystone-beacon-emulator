'use strict';

var util = require('util');

function EddyStoneFrame() {
	// EddyStone frame header
	// [eddystone protocol-specification.md](https://goo.gl/2Z5u41)
	// this.prototype = new Buffer([
	// Characteristic.super_.call(this, EddyStoneCharacteristics[ch]);
	Buffer.call(this, [
		0x00, // Length of Flags. CSS v5, Part A, § 1.3
		0x01, // Flags data type value
		0x06, // Flags data
		0x03, // Length of Complete list of 16-bit Service UUIDs. Ibid. § 1.1
		0xAA, // 16-bit Eddystone UUID, 0XFEAA
		0xFE,
		0x10, // Length of Service Data. Ibid. § 1.11
		0x16, // Service Data data type value
		0xAA, // 16-bit Eddystone UUID
		0xFE
	]);

	return this;
}

util.inherits(EddyStoneFrame, Buffer);

EddyStoneFrame.prototype.writeUID = function (uid) {
};

EddyStoneFrame.prototype.writeURL = function (url) {
};

EddyStoneFrame.prototype.writeTLM = function (tlm) {
};

module.exports = EddyStoneFrame;
