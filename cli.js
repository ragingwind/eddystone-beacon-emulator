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
		'  --name The name of advertiser',
		'	 --url The url for advertising',
		'  --configable Run into config service first and then start advertising'
	]
}, {
	default: {
		name: 'Eddy Stone Beacon',
		url: 'https://goo.gl/r8iJqW',
		configable: false
	}
});

eddystone.advertise(cli.flags);
