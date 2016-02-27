// Utility functions


// Namespace
Util = {};


// Activity context handling
var app;
Util.context = {
	filter: {subject: "", text: "", favorite: false},
	server: constant.canopeServer,
	favorites: {"0393": true},
	readtimes: {},
	currentindex: 0
};
Util.saveContext = function() {
	if (Util.onSugar() || !app || !app.activity) return;
	var datastoreObject = app.activity.getDatastoreObject();	
	var jsonData = JSON.stringify(Util.context);
	datastoreObject.setDataAsText(jsonData);
	//console.log("SAVE CONTEXT <"+jsonData+">");
	datastoreObject.save(function() {});	
};
Util.loadContext = function(callback, loaded) {
	if (!Util.onSugar()) {
		var datastoreObject = app.activity.getDatastoreObject();
		datastoreObject.loadAsText(function (error, metadata, data) {
			//console.log("LOAD CONTEXT <"+data+">");	
			var context = JSON.parse(data);
			if (context) {
				Util.context = context;
			}
			callback();
		});
	} else {
		Util.context = loaded;
	}
};

// Context update
Util.setFilter = function(newfilter) {
	if (newfilter.favorite !== undefined) Util.context.filter.favorite = newfilter.favorite;
	if (newfilter.subject !== undefined) Util.context.filter.subject = newfilter.subject;
	if (newfilter.text !== undefined) Util.context.filter.text = newfilter.text;
	app.filterChanged();
}
Util.getFilter = function() {
	return Util.context.filter;
}

Util.getCollection = function() {
	var database;
	database = database_fr;
	var filter = [];
	for (var i = 0 ; i < database.length ; i++) {
		if (Util.context.filter.favorite && !Util.getFavorite(database[i].id))
			continue;
		if (Util.context.filter.subject.length > 0 && database[i].subject != Util.getSubjectFromFilter(Util.context.filter.subject) )
			continue;
		filter.push(database[i]);
	}
	return filter;
}

Util.setFavorite = function(id, value) {
	if (value)
		Util.context.favorites[id] = value;
	else
		Util.context.favorites[id] = undefined;
}
Util.getFavorite = function(id) {
	return Util.context.favorites[id];
}

Util.setReadTime = function(id, time) {
	if (time)
		Util.context.readtimes[id] = time;
	else
		Util.context.readtimes[id] = undefined;
}
Util.getReadTime = function(id) {
	return Util.context.readtimes[id];
}

Util.setServer = function(server) {
	Util.context.server = server;
}
Util.getServer = function() {
	return Util.context.server;
}
Util.isCanopeServer = function() {
	return Util.context.server == constant.canopeServer;
}

Util.setIndex = function(index) {
	Util.context.currentindex = index;
}
Util.getIndex = function() {
	return Util.context.currentindex;
}

// Misc
Util.onSugar = function() {
	var getUrlParameter = function(name) {
		var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    };
	return getUrlParameter("onsugar");
}

Util.getClassFromSubject = function(subject) {
	var result = "itemOverlay";
	if (subject == "Langue française") {
		result += "French";
	} else if (subject == "Mathématiques") {
		result += "Math";
	} else if (subject == "Sciences") {
		result += "Science";
	} else if (subject == "Instruction civique et histoire géographie") {
		result += "Civism";
	}
	return result;
}

Util.getSubjectFromFilter = function(filter) {
	if (filter == "French") {
		return "Langue française";
	} else if (filter == "Math") {
		return "Mathématiques";
	} else if (filter == "Science") {
		return "Sciences";
	} else if (filter == "Civism") {
		return "Instruction civique et histoire géographie";
	}
	return "";
}