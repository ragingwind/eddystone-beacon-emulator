#!/usr/bin/env node
'use strict';

var meow = require('meow');
var eddystone = require('./');

var cli = meow({
	help: [
		'Usage',
		'  $ eddystone-beacon-simulator --config --name eddystone simulator --url http://goo.gl/eddystone ',
		'',
		'Options',
		'  --config Run into config service first and then start rest of advertisings services',
		'	 --url URL for URL advertising',
		'  --nid namespace ID, kind of FQDN or UUID, will be hashed and truncated in 10Byte',
		'	 --bid Beacon ID for UID advertising, 6Byte',
		'	 --tx TX Power start from -100 to 20, default is 0x12, will be interpreted as +18dBm',
		'  --volt Battery voltage, default is 0mV, or using a range like 500~10000 to randomize',
		'  --temp Temperature, default is -128(0x8000), or using a range like -128~128 to randomize',
		'  --tlm Frequency of TLM frame per 10 time of UID/URL advertising'
	]
}, {
	string: 'bid',
	default: {
		name: 'Eddystone beacon simulator',
		url: 'https://goo.gl/r8iJqW',
		nid: '8b0ca750-e7a7-4e14-bd99-095477cb3e77',
		bid: 'bid001',
		tx: 0x12,
		volt: 0,
		temp: -128,
		config: false
	}
});

eddystone.advertise(cli.flags);
