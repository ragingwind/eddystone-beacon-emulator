#!/usr/bin/env node
'use strict';

var meow = require('meow');
var eddystone = require('./');

var cli = meow({
	help: [
		'Usage',
		'  $ eddystone --name eddystone simulator --url http://goo.gl/eddystone --configable',
		'',
		'Options',
		'  --name The name for URL advertising',
		'	 --url The URL for URL advertising',
		'  --fqdn FQDN for UID advertising as namespace. will be hashed and truncated in 10Byte',
		'  --uuid UUID for UID advertising as namespace. will be truncated in 10Byte',
		'	 --bid The beacon ID for UID advertising, 6Byte',
		'	 --tx The TX Power start from -100 to 20. The value 0x12 is interpreted as +18dBm',
		'	 --vol Battery voltage, 2Byte',
		'	 --temp Beacon temperature, 2Byte',
		'  --config Run into config service first and then start rest of the advertisings'
	]
}, {
	default: {
		name: 'Eddy Stone Beacon',
		url: 'https://goo.gl/r8iJqW',
		uuid: '8b0ca750-e7a7-4e14-bd99-095477cb3e77',
		bid: 'beaconid',
		tx: 0x12,
		vol: 0x0000,
		temp: 0x8000,
		config: false
	}
});

eddystone.advertise(cli.flags);
