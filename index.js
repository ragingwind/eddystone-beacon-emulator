'use strict';

var config = require('./lib/config-advertising');
var uid = require('./lib/uid-advertising');
var url = require('./lib/url-advertising');
var tlm = require('./lib/tlm-advertising');

function advertiseAll(opts) {
	uid.advertise(opts);
	url.advertise(opts);
	tlm.advertise(opts);
}

function start(opts, done) {
	if (opts.config) {
		config.advertise(function(err) {
			if (!err) {
				advertiseAll(opts);
			} else {
				done(err);
			}
		});
	} else {
		advertiseAll(opts);
	}
}

module.exports = {
	advertise: start
};
