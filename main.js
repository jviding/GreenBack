var Sound = require('./sounds');
var Temp = require('./temp');
var Humid = require('./humid');
var Lux = require('./lux');
var Error = require('./error');
var Firebase = require('./firebase');
var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort("/dev/ttyACM0", {
  baudrate: 4800
});

var day = -1;
var dataStr = '';
var helper = '';

serialPort.on("open", function () {
  console.log('Connecting...');
  serialPort.on('data', function(data) {
    newData(data);
  });
});

function newData(data) {
	if (data.toString().indexOf("\n") != -1) {
		helper = dataStr;
		dataStr = '';
		setData(helper);
	}
	else {
		dataStr += data;
	}
};

function setData(data) {
	if (isNaN(parseInt(data.substring(1)))) {
		Error.setError(data);
	} 
	else {
		if (data.toString().indexOf("s") != -1) {
			Sound.setSound(parseInt(data.substring(1)));
		}
		else if (data.toString().indexOf("t") != -1) {
			Temp.setTemp(parseFloat(data.substring(1)));
		}
		else if (data.toString().indexOf("h") != -1) {
			Humid.setHumidity(parseFloat(data.substring(1)));
		}
		else if (data.toString().indexOf("i") != -1) {
			Lux.setLight(data.substring(1));
		}
		else if (data.toString().indexOf("l") != -1) {
			Lux.setLux(parseInt(data.substring(1)));
		}
	}
}

setInterval(function() {
	var newDay = new Date().getDay();
	if (newDay != day) {
		Firebase.updateYesterday('/voices');
		Firebase.updateYesterday('/humidities');
		Firebase.updateYesterday('/temperatures');
		Firebase.updateYesterday('/lux');
		Firebase.updateYesterday('/infraredandvisible');
		Firebase.updateYesterday('/errors')
		day = newDay;
	}
}, 1000*60*60); //every 1 hour
