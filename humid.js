var Firebase = require('./firebase');
var url = '/humidities';

module.exports = {
  setHumidity: function(humid) {
    toFirebase(humid); // every 5 minutes
  }
}

function toFirebase(humid) {
	var data = {
		'average': humid,
		'min': humid,
		'max': humid,
		'timestamp': new Date().getTime()
	};
	Firebase.addData(data,url);
}