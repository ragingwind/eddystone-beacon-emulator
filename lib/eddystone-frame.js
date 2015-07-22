'use strict';

var regexps = {
	uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
	fqdn: /^(?=.{1,254}$)((?=[a-z0-9-]{1,63}\.)(xn--+)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}$/i
};

var txPower = {
	default: 0,
	min: -100,
	max: 20,
	validate: function (pow) {
		return (!pow || pow < txPower.min || pow > txPower.max) ? txPower.default : pow;
	}
};

var urlEncoding = {
	prefix: [
		'http://www.', 'https://www.',
		'http://', 'https://'
	],
	tld: [
		'.com/', '.org/', '.edu/', '.net/',
		'.info/', '.biz/', '.gov/',
		'.com', '.org', '.edu', '.net',
		'.info', '.biz', '.gov'
	],
	findIndex: function findIndex(type, url) {
		var res = {
			pos: -1
		};

		urlEncoding[type].every(function(elem, idx) {
			var pos = url.indexOf(elem);
			if (pos !== -1) {
				res.pos = pos;
				res.matched = elem;
				res.encoded = idx;
				res.before = url.slice(0, res.pos);
				res.after = url.slice(res.pos + res.matched.length, url.length);
			}
			return res.pos !== 0;
		});

		if (res.pos === -1) {
			res.after = url;
		}

		return res;
	}
};

// code snippets from [node/buffer.js · joyent/node](https://goo.gl/Io1Ul5)
// to support v0.10.x
function checkInt(buffer, value, offset, ext, max, min) {
  if (!(buffer instanceof Buffer))
    throw new TypeError('buffer must be a Buffer instance');
  if (value > max || value < min)
    throw new TypeError('value is out of bounds');
  if (offset + ext > buffer.length)
    throw new RangeError('index out of range');
}

Buffer.prototype.writeIntLE = function(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    checkInt(this,
             value,
             offset,
             byteLength,
             Math.pow(2, 8 * byteLength - 1) - 1,
             -Math.pow(2, 8 * byteLength - 1));
  }

  var i = 0;
  var mul = 1;
  var sub = value < 0 ? 1 : 0;
  this[offset] = value;
  while (++i < byteLength && (mul *= 0x100))
    this[offset + i] = ((value / mul) >> 0) - sub;

  return offset + byteLength;
};

Buffer.prototype.writeIntBE = function(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    checkInt(this,
             value,
             offset,
             byteLength,
             Math.pow(2, 8 * byteLength - 1) - 1,
             -Math.pow(2, 8 * byteLength - 1));
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = value < 0 ? 1 : 0;
  this[offset + i] = value;
  while (--i >= 0 && (mul *= 0x100))
    this[offset + i] = ((value / mul) >> 0) - sub;

  return offset + byteLength;
};

function Frame() {
	this._buffers = [];
}

Frame.prototype.push = function (data, bytes) {
	var buf = null;
	if (Array.isArray(data) || typeof data === 'string') {
		buf = new Buffer(data.slice(0, bytes ? bytes : data.length));
	} else if (typeof data === 'number') {
		bytes = bytes || 1;
		buf = new Buffer(bytes);
		buf.writeIntLE(data, 0, bytes, true);
	}

	if (buf) {
		this._buffers.push(buf);
		console.info('BUFFER HAS BEEN UPDATED', data, buf, buf.length);
	}

	return this;
};

Frame.prototype.pushFQDN = function (fqdn) {
	var crypto = require('crypto');

	if (!fqdn || !regexps.fqdn.test(fqdn)) {
		throw new Error('FQDN has an invalid form ' + fqdn);
	}

	var sha = crypto.createHash('sha1');
	sha.update(fqdn);
	this.push(sha.digest('hex').slice(0, 10), 10);

	return this;
};

Frame.prototype.pushUUID = function (uuid) {
	if (!uuid || !regexps.uuid.test(uuid)) {
		throw new Error('UUID has an invalid form ' + uuid);
	}

	var ids = uuid.split('-');
	this.push(ids[0] + ids[4], 10);

	return this;
};

Frame.prototype.pushURL = function (url) {
	var res = urlEncoding.findIndex('prefix', url);

	if (res.pos !== 0) {
		throw new Error('URI must be started with URL prefix');
	}

	// push encoded the value of the prefix
	this.push(res.encoded);

	if (res.after) {
		// find top level domain pos
		res = urlEncoding.findIndex('tld', res.after);

		// push domain name
		if (res.before) {
			this.push(res.before);
		}

		// push encoded the value of the top level domain
		if (res.encoded) {
			this.push(res.encoded);
		}

		// push rest of the domain
		if (res.after) {
			this.push(res.after);
		}
	}
	return this;
};

Frame.prototype.pushTxPower = function (tx) {
	this.push(txPower.validate(tx), 1);
};

Frame.prototype.toBuffer = function() {
	var service = Buffer.concat(this._buffers);
	console.log(service.length, service.length + 3);
	var header = new Buffer([
		0x02, // Length of Flags. CSS v5, Part A, § 1.3
		0x01, // Flags data type value
		0x06, // Flags data
		0x03, // Length of Complete list of 16-bit Service UUIDs. Ibid. § 1.1
		0x03, // Complete list of 16-bit Service UUIDs data type value
		0xAA, // 16-bit Eddystone UUID, 0XFEAA
		0xFE,
		service.length + 3, // Length of Service Data. Ibid. § 1.11
		0x16, // Service Data data type value
		0xAA, // 16-bit Eddystone UUID
		0xFE
	]);

	return Buffer.concat([header, service]);
};


module.exports = Frame;
