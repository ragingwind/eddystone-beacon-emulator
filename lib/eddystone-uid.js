'use strict';

var uuid = require('node-uuid');

var regexps = {
	uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
	fqdn: /^(?=.{1,254}$)((?=[a-z0-9-]{1,63}\.)(xn--+)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}$/i
};

function truncatFQDN(name) {
	var crypto = require('crypto');
	var sha = crypto.createHash('sha1');
	sha.update(name);
	return sha.digest('hex').slice(0, 10);
}

function elideUUID(name) {
	var id = name.split('-');
	return id[0] + id[4];
}

module.exports = {
	toHexInstanceId: function (iid) {
		if (iid && (iid.length !== 6)) {
			throw new Error('Invalid Instance ID for eddystone. ' + iid);
		} else if (!iid || iid.length !== 6){
			// generate random iid if iid has an invalid format
			iid = (Math.random().toString(36)+'00000000000000000').slice(2, 6 + 2);
		}
		return new Buffer(iid, 'binary').toString('hex');
	},
	toNamespace: function (name) {
		var namespace;

		if (regexps.uuid.test(name)) {
			namespace = elideUUID(name);
		} else if (regexps.fqdn.test(name)) {
			namespace = truncatFQDN(name);
		} else {
			// if name is unknown type or undefined it is using
			// auto generated uuid
			namespace = elideUUID(uuid.v1());
		}

		return namespace;
	}
};
