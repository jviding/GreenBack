var Firebase = require('./firebase');
var url = '/voices';

var avg = 0;
var highest = 0;
var count = 0;

module.exports = {
  setSound: function(sound) { // called every 0.5 seconds
    newSound(sound);
  }
}

function newSound (sound) {
	avg += sound;
	count++;
	checkHigh(sound);
	if (count === 2*60*2-1) { // every 2 minutes
		toFirebase();
		resetVals();
	}
}

function resetVals() {
	avg = 0;
	highest = 0;
	count = 0;
}

function toFirebase() {
	var data = {
		'average': (avg/count).toFixed(2),
		'loudest': highest,
		'timestamp': new Date().getTime()
	};
	Firebase.addData(data, url);
}

function checkHigh(sound) {
	if (sound >= highest) {
		highest = sound;
	}
}