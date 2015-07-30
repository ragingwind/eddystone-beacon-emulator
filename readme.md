# eddystone-beacon-simulator

> Simulator for Eddystone beacon

## Install

```
$ npm install --global eddystone-beacon-simulator
```

```
$ eddystone-beacon-simulator --help

  Usage
    eddystone-beacon-simulator --url=http://goo.gl/eddystone'
		eddystone-beacon-simulator --nid=http://google.com --bid=123456'
		eddystone-beacon-simulator --volt=0 --temp=-128
		eddystone-beacon-simulator --volt=5000~10000 --temp=-128~128
```

## Options

- --config Run into config service first and then start rest of advertisings services',
- --url URL for URL advertising',
- --nid namespace ID, kind of FQDN or UUID, will be hashed and truncated in 10Byte',
- --bid Beacon ID for UID advertising, 6Byte',
- --tx TX Power start from -100 to 20, default is 0x12, will be interpreted as +18dBm',
- --volt Battery voltage, default is 0mV, or using a range like 500~10000 to randomize',
- --temp Temperature, default is -128(0x8000), or using a range like -128~128 to randomize',
- --tlm Frequency of TLM frame per 10 time of UID/URL advertising'

## License

MIT © [Jimmy Moon](http://ragingwind.me)
