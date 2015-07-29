#!/usr/bin/env node
'use strict';

var meow = require('meow');
var eddystone = require('./');

var cli = meow({
	help: [
		'Usage',
		'  $ eddystone-beacon-simulator --name eddystone simulator --url http://goo.gl/eddystone --start-with-config',
		'',
		'Options',
		'  --name Name for URL advertising',
		'	 --url URL for URL advertising',
		'  --nid namespace ID, such as FQDN or UUID, for UID advertising as namespace. will be hashed and truncated in 10Byte',
		'	 --bid Beacon ID for UID advertising, 6Byte',
		'	 --tx TX Power start from -100 to 20. The value 0x12 is interpreted as +18dBm',
		'  --start-with-config Run into config service first and then start rest of advertisings services'
	]
}, {
	string: 'bid',
	default: {
		name: 'Eddystone Beacon Simulator',
		url: 'https://goo.gl/r8iJqW',
		nid: '8b0ca750-e7a7-4e14-bd99-095477cb3e77',
		bid: 'bid001',
		tx: 0x12,
		startWithConfig: false
	}
});

eddystone.advertise(cli.flags);
