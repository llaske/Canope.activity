// Utility functions


// Namespace
Util = {};


// Activity context handling
var app;
Util.context = {
	language: "fr",
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
Util.setLanguage = function(lang) {
	Util.context.language = lang;
	app.localeChanged();
}
Util.getLanguage = function() {
	return Util.context.language;
}

Util.getCollection = function(favorite) {
	var database;
	database = database_fr;
	if (!favorite)
		return database;
	var filter = [];
	for (var i = 0 ; i < database.length ; i++)
		if (Util.getFavorite(database[i].id))
			filter.push(database[i]);
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