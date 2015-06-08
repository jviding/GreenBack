var Firebase = require('firebase');

module.exports = {
  addData: function(data, url) {
  	var firebaseRef = new Firebase('https://radiant-heat-5119.firebaseio.com'+url);
  	firebaseRef.push(data);
  },
  updateYesterday: function(url) {
  	var firebaseRef = new Firebase('https://radiant-heat-5119.firebaseio.com'+url);
	var query = firebaseRef.orderByChild('timestamp').startAt(startUTCms()).endAt(endUTCms());
	query.once("value", function(snapshot) {
		createQuarters(snapshot, url);
	});
  }
}

function createQuarters(data, url) {
	var night = [];
	var morning = [];
	var day = [];
	var evening = [];
	data.forEach(function(item) {
		if (item['timestamp']<startUTCms+(1000*60*60*24/4)) {
			night.push(item.val());
		}
		else if (item['timestamp']>=startUTCms+(1000*60*60*24/4) && 
			item['timestamp']<startUTCms+(1000*60*60*24/4)*2) {
			morning.push(item.val());
		}
		else if (item['timestamp']>=startUTCms+(1000*60*60*24/4)*2 && 
			item['timestamp']<startUTCms+(1000*60*60*24/4)*3) {
			day.push(item.val());
		}
		else {
			evening.push(item);	
		}
	});
	setQuarters(night, morning, day, evening, url);
}

function setQuarters(night, morning, day, evening, url) {
	checkQuarter(night, url);
	checkQuarter(morning, url);
	checkQuarter(day, url);
	checkQuarter(evening, url);
}

function checkQuarter(data, url) {
	if (data.length < 2) {
		return;
	}
	if (url === '/voices') {
		setVoiceQuarter(data, url);
	}
	else if (url === '/humidities') {
		setAirQuarter(data,url);
	}
	else if (url === '/temperatures') {
		setAirQuarter(data,url);
	}
	else if (url === '/infraredandvisible') {
		setIVQuarter(data,url);
	}
	else if (url === '/lux') {
		setAirQuarter(data,url);
	}
}

function startUTCms() {
	return endUTCms() - 1000*60*60*24;
}

function endUTCms() {
	var date = new Date();
	return new Date(date.getFullYear(),date.getMonth(),date.getDate()).getTime();
}

function setAirQuarter(dataset,url) {
	var avgTotal = 0;
	var count = 0;
	var min = null;
	var max = null;
	dataset.forEach(function(item) {
		if (min===null || min > parseFloat(item.val()['min'])) {
			min = parseFloat(item.val()['min']);
		}
		if (max===null || max < parseFloat(item.val()['max'])) {
			max = parseFloat(item.val()['max']);
		}
		avgTotal += parseFloat(item.val()['average']);
		count++;
	});
	var timestamp = dataset[parseInt((count/2).toFixed(0))-1].val()['timestamp'];
	pushQuarter(createAirData(avgTotal,min,max,count,timestamp),dataset,url);
}

function setIVQuarter(dataset,url) {
	var iavg = 0;
	var ivcount = 0;
	var imin = null;
	var imax = null;
	var vavg = 0;
	var vmin = null;
	var vmax = null;
	dataset.forEach(function(item) {
		if (imin===null || imin > parseFloat(item.val()['infraredMin'])) {
			imin = parseFloat(item.val()['infraredMin']);
		}
		if (imax===null || imax < parseFloat(item.val()['infraredMax'])) {
			imax = parseFloat(item.val()['infraredMax']);
		}
		if (vmin===null || vmin > parseFloat(item.val()['visibleMin'])) {
			vmin = parseFloat(item.val()['visibleMin']);
		}
		if (vmax===null || vmax < parseFloat(item.val()['visibleMax'])) {
			vmax = parseFloat(item.val()['visibleMax']);
		}
		iavg += parseFloat(item.val()['infraredAverage']);
		vavg += parseFloat(item.val()['visibleAverage']);
		ivcount++;
	});
	var timestamp = dataset[parseInt((ivcount/2).toFixed(0))-1].val()['timestamp'];
	pushQuarter(createIVData(iavg,imin,imax,ivcount,vavg,vmin,vmax,timestamp),dataset,url);
}

function createIVData(iavg, imin, imax, ivcount, vavg, vmin, vmax, timestamp) {
	var data = {
		'infraredAverage': (iavg/ivcount).toFixed(2),
		'infraredMax': imax,
		'infraredMin': imin,
		'timestamp': timestamp,
		'visibleAverage': (vavg/ivcount).toFixed(2),
		'visibleMax': vmax,
		'visibleMin': vmin
	};
	return data;
}

function createAirData(avgTotal, min, max, count, timestamp) {
	var data = {
		'average': (avgTotal/count).toFixed(2),
		'min': min,
		'max': max,
		'timestamp': timestamp
	};
	return data;
}

function setVoiceQuarter(dataset, url) {
	var loudest = 0;
	var avgTotal = 0;
	var count = 0;
	dataset.forEach(function(item) {
		if (item.val()['loudest'] >= loudest) {
			loudest = parseInt(item.val()['loudest']);
		}
		avgTotal += parseFloat(item.val()['average']);
		count ++;
	});
	var timestamp = dataset[parseInt((count/2).toFixed(0))-1].val()['timestamp'];
	pushQuarter(createVoiceData(avgTotal,count,loudest,timestamp),dataset,url);
}

function createVoiceData(avgTotal, count, loudest, timestamp) {
	var data = {
		'average': (avgTotal/count).toFixed(2),
		'loudest': loudest,
		'timestamp': timestamp
	};
	return data;
}

function pushQuarter(data, dataset, url) {
	var firebaseRef = new Firebase('https://radiant-heat-5119.firebaseio.com'+url);
	firebaseRef.push(data, function() {
  		removeOld(dataset, url);
  	});
}

function removeOld(dataset, url) {
	dataset.forEach(function(item) {
		var firebaseRef = new Firebase('https://radiant-heat-5119.firebaseio.com'+url+'/'+item.key());
		firebaseRef.remove();
	});
}