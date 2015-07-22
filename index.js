'use strict';

var config = require('./lib/config-advertising');
var uid = require('./lib/uid-advertising');
var url = require('./lib/url-advertising');
var tlm = require('./lib/tlm-advertising');

function advertiseAll(opts) {
	// uid.advertise(opts); // disabled, It cause of xpc connection error
	console.log('Start advertising TLM');
	tlm.advertise(opts, function () {
		setTimeout(function () {
			console.log('Start advertising URL');
			url.advertise(opts, function () {
				setTimeout(function () {
					advertiseAll(opts);
				}, 3000);
			});
		}, 1000);
	});
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
