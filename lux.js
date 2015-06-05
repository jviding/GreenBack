var Firebase = require('./firebase');
var ivurl = '/infraredandvisible';
var lurl = '/lux';

var iavg = 0;
var imin = null;
var imax = null;

var vavg = 0;
var vmin = null;
var vmax = null;

var ivcount = 0;

var lavg = 0;
var lmin = null;
var lmax = null;
var lcount = 0;

module.exports = {
  setLight: function(light) { // called every 0.5 seconds // first infrared then visible
  	if (isNaN(parseInt(light.split(' ')[0])) === false && isNaN(parseInt(light.split(' ')[1])) === false) {
  		newLight(light.split(' ')[0], light.split(' ')[1]);
  	}
  },
  setLux: function(lux) { // called every 0.5 seconds
    newLux(lux);
  }
}

function newLight (infrared, visible) {
	iavg += infrared;
	vavg += visible;
	ivcount++;
	checkHighAndLowInfra(infrared);
	checkHighAndLowVisible(visible);
	if (ivcount === 2*60*2) { // every 2 minutes
		lightToFirebase();
		resetLightVals();
	}
}

function newLux (lux) {
	lavg += lux;
	lcount++;
	checkHighAndLowLux(lux);
	if (lcount === 2*60*2) { // every 2 minutes
		luxToFirebase();
		resetLuxVals();
	}
}

function resetLightVals() {
	var iavg = 0;
	var imin = null;
	var imax = null;
	var vavg = 0;
	var vmin = null;
	var vmax = null;
	var ivcount = 0;
}

function resetLuxVals() {
	var lavg = 0;
	var lmin = null;
	var lmax = null;
	var lcount = 0;
}

function lightToFirebase() {
	var data = {
		'infrared-average': (iavg/ivcount).toFixed(2),
		'visible-average': (vavg/ivcount).toFixed(2),
		'infrared-min': imin,
		'infrared-max': imax,
		'visible-min': vmin,
		'visible-max': vmax,
		'timestamp': new Date().getTime()
	};
	Firebase.addData(data, ivurl);
}

function luxToFirebase() {
	var data = {
		'average': (lavg/lcount).toFixed(2),
		'min': lmin,
		'max': lmax,
		'timestamp': new Date().getTime()
	};
	Firebase.addData(data, lurl);
}

function checkHighAndLowInfra(light) {
	if (imax === null || light >= imax) {
		imax = light;
	}
	if (imin === null || light <= imin) {
		imin = light;
	}
}
function checkHighAndLowVisible(light) {
	if (vmax === null || light >= vmax) {
		vmax = light;
	}
	if (vmin === null || light <= vmin) {
		vmin = light;
	}
}
function checkHighAndLowLux(light) {
	if (lmax === null || light >= lmax) {
		lmax = light;
	}
	if (lmin === null || light <= lmin) {
		lmin = light;
	}
}