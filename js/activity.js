define(function (require) {
    var activity = require("sugar-web/activity/activity");
	var env = require("sugar-web/env");
	var isFavorite = false;

    // Manipulate the DOM only when it is ready.
    require(['domReady!'], function (doc) {
        // Initialize the activity.
        activity.setup();

		// Create palette
		document.getElementById("settings-button").onclick = function(s, e) {
			settingspalette.popDown();
			app.remotePopUp();
		};
		document.getElementById("favorite-button").onclick = function(s, e) {
			var invoker = s.toElement;
			isFavorite = !isFavorite;
			if (isFavorite)
				invoker.style.backgroundImage = 'url(icons/favorite.svg)';
			else
				invoker.style.backgroundImage = 'url(icons/notfavorite.svg)';
			app.favoriteChanged(isFavorite);
		};
		
		// Launch main screen
		app = new Canope.App({activity: activity});
		app.renderInto(document.getElementById("viewer"));
		
		// Load context
		Util.loadContext(function() {
			app.localeChanged(Util.getIndex());
			app.draw();
		});
    });

});
