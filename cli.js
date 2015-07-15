#!/usr/bin/env node
'use strict';
var meow = require('meow');
var eddystone = require('./');

var cli = meow({
	help: [
		'Usage',
		'  $ eddystone [input]',
		'',
		'Examples',
		'  $ eddystone',
		'  unicorns & rainbows',
		'',
		'  $ eddystone ponies',
		'  ponies & rainbows',
		'',
		'Options',
		'  --foo  Lorem ipsum. Default: false'
	]
});

console.log(eddystone(cli.input[0] || 'unicorns'));
