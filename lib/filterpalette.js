define(["sugar-web/graphics/palette"], function (palette) {

    'use strict';

    var filterpalette = {};

    filterpalette.FilterPalette = function (invoker, primaryText, menuData) {
        palette.Palette.call(this, invoker, primaryText);

		this.filterEvent = document.createEvent("CustomEvent");
		this.filterEvent.initCustomEvent('filter', true, true, {});
		this.remoteEvent = document.createEvent("CustomEvent");
		this.remoteEvent.initCustomEvent('remote', true, true, {});

		var div = document.createElement('div');

		var that = this;

		var frenchbutton = document.createElement('button');
		frenchbutton.className = 'toolbutton palette-button palette-button-notselected';
		frenchbutton.setAttribute('id','french-button');
		frenchbutton.setAttribute('title','Langue française');
		frenchbutton.onclick = function() {
			that.setFilter('French');
		}
		var mathbutton = document.createElement('button');
		mathbutton.className = 'toolbutton palette-button palette-button-notselected';
		mathbutton.setAttribute('id','math-button');
		mathbutton.setAttribute('title','Mathématiques');
		mathbutton.onclick = function() {
			that.setFilter('Math');
		}
		var sciencebutton = document.createElement('button');
		sciencebutton.className = 'toolbutton palette-button palette-button-notselected';
		sciencebutton.setAttribute('id','science-button');
		sciencebutton.setAttribute('title','Science');
		sciencebutton.onclick = function() {
			that.setFilter('Science');
		}
		var civismbutton = document.createElement('button');
		civismbutton.className = 'toolbutton palette-button palette-button-notselected';
		civismbutton.setAttribute('id','civism-button');
		civismbutton.setAttribute('title','Instruction civique et histoire géographie');
		civismbutton.onclick = function() {
			that.setFilter('Civism');
		}
		this.setFilter = function(lang) {
			var noFilter = (this.getFilter() == lang);
			frenchbutton.className = 'toolbutton palette-button palette-button-notselected';
			mathbutton.className = 'toolbutton palette-button palette-button-notselected';
			sciencebutton.className = 'toolbutton palette-button palette-button-notselected';
			civismbutton.className = 'toolbutton palette-button palette-button-notselected';
			if (noFilter) {
				this.getPalette().dispatchEvent(this.filterEvent);
				return;
			}
			if (lang == 'French') {
				frenchbutton.className = 'toolbutton palette-button palette-button-selected';
				that.getPalette().dispatchEvent(that.filterEvent);
			} else if (lang == 'Math') {
				mathbutton.className = 'toolbutton palette-button palette-button-selected';
				that.getPalette().dispatchEvent(that.filterEvent);
			} else if (lang == 'Science') {
				sciencebutton.className = 'toolbutton palette-button palette-button-selected';
				that.getPalette().dispatchEvent(that.filterEvent);
			} else if (lang == 'Civism') {
				civismbutton.className = 'toolbutton palette-button palette-button-selected';
				that.getPalette().dispatchEvent(that.filterEvent);
			}
		}

		div.appendChild(frenchbutton);
		div.appendChild(mathbutton);
		div.appendChild(sciencebutton);
		div.appendChild(civismbutton);

		this.setContent([div]);

        // Pop-down the palette when a item in the menu is clicked.

        this.buttons = div.querySelectorAll('button');
    };

    var addEventListener = function (type, listener, useCapture) {
        return this.getPalette().addEventListener(type, listener, useCapture);
    };

    filterpalette.FilterPalette.prototype =
        Object.create(palette.Palette.prototype, {
            addEventListener: {
                value: addEventListener,
                enumerable: true,
                configurable: true,
                writable: true
            }
        });
	filterpalette.FilterPalette.prototype.setFilter = function(lang) {
		this.setFilter(lang);
	}
	filterpalette.FilterPalette.prototype.getFilter = function() {
		if (document.getElementById("french-button").className == 'toolbutton palette-button palette-button-selected')
			return "French";
		else if (document.getElementById("math-button").className == 'toolbutton palette-button palette-button-selected')
			return "Math";
		else if (document.getElementById("science-button").className == 'toolbutton palette-button palette-button-selected')
			return "Science";
		else if (document.getElementById("civism-button").className == 'toolbutton palette-button palette-button-selected')
			return "Civism";
		else
			return "";
	}
    return filterpalette;
});
