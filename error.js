var Firebase = require('./firebase');
var url = '/errors';

module.exports = {
  setError: function(er) {
    toFirebase(er); // every time that occurs
  }
}

function toFirebase(er) {
	var data = {
		'error': er.toString(),
		'timestamp': new Date().getTime()
	};
	Firebase.addData(data,url);
}