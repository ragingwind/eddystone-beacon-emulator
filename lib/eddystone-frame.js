'use strict';

function Frame() {
	this._buffers = [];

	this.push([
		0x02, // Length of Flags. CSS v5, Part A, § 1.3
		0x01, // Flags data type value
		0x06, // Flags data
		0x03, // Length of Complete list of 16-bit Service UUIDs. Ibid. § 1.1
		0x03, // Complete list of 16-bit Service UUIDs data type value
		0xAA, // 16-bit Eddystone UUID, 0XFEAA
		0xFE,
		0x0B, // Length of Service Data. Ibid. § 1.11
		0x16, // Service Data data type value
		0xAA, // 16-bit Eddystone UUID
		0xFE
	]);
}

Frame.prototype.push = function(data, bytes) {
	var buf = null;
	if (Array.isArray(data) || typeof data === 'string') {
		buf = new Buffer(data);
	} else if (typeof data === 'number') {
		bytes = /^[1-2]$/.test(bytes) ? bytes : 1;
		buf = new Buffer(bytes);
		(bytes === 1) ? buf.writeInt8(data, 0) : buf.writeInt16LE(data, 0);
	}

	if (buf) {
		this._buffers.push(buf);
		console.log('BUFFER HAS BEEN UPDATED', data, buf, buf.length)
	}

	return this;
};

Frame.prototype.getBuffer = function() {
	var buf = Buffer.concat(this._buffers);
	buf.writeInt8(buf.length, 7);
	return buf;
};

module.exports = Frame;
