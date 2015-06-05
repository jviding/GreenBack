var Firebase = require('./firebase');
var url = '/temperatures';

var count = 0;
var tempMin = null;
var tempMax = null;
var average = 0;

module.exports = {
  setTemp: function(temp) { // called every 5 seconds
    newData(temp);
  }
}

function newData (temp) {
	count++;
	checkTemps(temp);
	if (count == 12*5) { // every 5 minutes
		toFirebase();
		resetVals();
	}
}

function toFirebase() {
	var data = {
		'min': tempMin,
		'max': tempMax,
		'average': (average/count).toFixed(2),
		'timestamp': new Date().getTime()
	};
	Firebase.addData(data,url);
}

function checkTemps(temp) {
	if (tempMax == null || temp >= tempMax) {
		tempMax = temp;
	}
	if (tempMin == null || temp <= tempMin) {
		tempMin = temp;
	}
	average+=temp;
}

function resetVals() {
	count = 0;
	tempMin = null;
	tempMax = null;
	average = 0;
}