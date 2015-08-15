# eddystone-beacon-simulator

> Simulator for Eddystone beacon device

## Install

```
$ npm install --global eddystone-beacon-simulator
```

```
$ eddystone-beacon-simulator --help

  Usage
    eddystone-beacon-simulator --config --uri=http://goo.gl/eddystone'
    eddystone-beacon-simulator --uri=http://goo.gl/eddystone'
		eddystone-beacon-simulator --nid=http://google.com --bid=123456'
		eddystone-beacon-simulator --volt=0 --temp=-128
		eddystone-beacon-simulator --volt=5000~10000 --temp=-128~128
```

## Options

-  --config Run config service firstly and then the other advertisings will be starting',
-  --uri URI for advertising',
-  --nid Namespace ID, FQDN or UUID which ID will be hashed and truncated in 10Byte',
-  --bid Beacon ID for UID advertising',
-  --voltage Battery voltage, default is 0mV, or using a range like 500~10000 to randomize',
-  --temperature Temperature, default is -128(0x8000), or using a range like -128~128 to randomize'

## Won't Support Yet

- Can't configure TLM period
- Can't configure TX Power Mode and TX Power Level
- Can't configure beacon period
- Can't configure flags

## License

MIT © [Jimmy Moon](http://ragingwind.me)
