# eddystone-beacon-emulator

> Emulator for Eddystone beacon peripherals

## Install

```
$ npm install --global eddystone-beacon-emulator
```

```
$ eddystone-beacon-emulator --help

  Usage
    eddystone-beacon-emulator --config --uri=http://goo.gl/eddystone'
    eddystone-beacon-emulator --uri=http://goo.gl/eddystone'
  	eddystone-beacon-emulator --nid=http://google.com --bid=123456'
  	eddystone-beacon-emulator --voltage=0 --temperature=-128
  	eddystone-beacon-emulator --voltage=5000~10000 --temperature=-128~128
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
