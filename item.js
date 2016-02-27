// Entry component with image and sound
enyo.kind({
	name: "Canope.Item",
	kind: enyo.Control,
	published: {
		code: "",
		title: "",
		subject: "",
		isLocal: false,
		isFavorite: false,
		imgSuffix: ""
	},
	events: {
		onVideoPlayed: ""
	},
	classes: "item",
	components: [
		{ name: "spinner", kind: "Image", src: "images/spinner-dark.gif", classes: "spinner" },
		{ name: "background", classes: "itemImage", kind: "Image", src: "images/notloaded.png" },
		{ name: "itemImage", classes: "itemImage", kind: "Image", showing: false, onload: "imageLoaded", onerror: "defaultImage", ontap: "showVideo" },
		{ name: "itemPlay", classes: "itemPlay", kind: "Image", showing: false, src: "icons/play.svg", ontap: "showVideo" },
		{ name: "itemFavorite", classes: "itemFavorite", kind: "Image", src: "icons/notfavorite.svg", showing: false, ontap: "showVideo" },
		{ name: "itemRemote", classes: "itemRemote", kind: "Image", src: "icons/remote.svg", showing: false, ontap: "showVideo" },
		{ name: "itemOverlay", classes: "itemOverlay" },
		{ name: "itemTitle", classes: "itemTitle", content: "" }
	],
	
	// Constructor
	create: function() {
		this.inherited(arguments);
		this.nameChanged();
		this.titleChanged();
		this.isLocalChanged();
		this.isFavoriteChanged();
	},
	
	// Item setup
	nameChanged: function() {
		if (this.isLocal)
			this.$.itemImage.setAttribute("src", "images/database/"+this.code+this.imgSuffix+".png");
		else if (Util.isCanopeServer()) {
			if (typeof chrome != 'undefined' && chrome.app && chrome.app.runtime) {
				// HACK: When in Chrome App image should be load using a XmlHttpRequest
				var xhr = new XMLHttpRequest();
				var that = this;
				xhr.open('GET', constant.canopeImages+this.code+this.imgSuffix+".png", true);
				xhr.responseType = 'blob';
				xhr.onload = function(e) {
					that.$.itemImage.setAttribute("src", window.URL.createObjectURL(this.response));
				};
				xhr.send();		
			} else {
				this.$.itemImage.setAttribute("src", constant.canopeImages+this.code+this.imgSuffix+".png");
			}
		} else
			this.$.itemImage.setAttribute("src", Util.getServer()+"/images/"+this.code+this.imgSuffix+".png");
	},
	
	titleChanged: function() {
		this.$.itemTitle.setContent(this.title);
		this.$.itemOverlay.removeClass("itemOverlayMath");
		this.$.itemOverlay.removeClass("itemOverlayFrench");
		this.$.itemOverlay.removeClass("itemOverlayScience");
		this.$.itemOverlay.removeClass("itemOverlayCivism");
		this.$.itemOverlay.addClass(Util.getClassFromSubject(this.subject));
	},
	
	isLocalChanged: function() {
		this.$.itemRemote.setShowing(!this.isLocal);	
	},
	
	isFavoriteChanged: function() {
		this.$.itemFavorite.setShowing(this.isFavorite);
	},
	
	imageLoaded: function() {
		this.$.itemImage.setShowing(true);
		this.$.itemPlay.setShowing(true);
		this.$.spinner.setShowing(false);
		this.$.background.setShowing(false);
	},
	
	defaultImage: function() {
		if (this.isLocal) {
			 // HACK: Local not load mean that video not present locally
			this.isLocal = false;
			this.nameChanged();
			this.isLocalChanged();
			this.render();
			return;
		}
		this.$.itemImage.setAttribute("src", "images/notloaded.png");
		this.$.itemImage.setShowing(true);
		this.$.itemPlay.setShowing(true);
		this.$.spinner.setShowing(false);
		this.$.background.setShowing(false);
	},
	
	videoURL: function() {
		if (this.isLocal)
			return "videos/database/"+this.code+"_"+constant.videoQuality+"."+constant.videoType;
		else if (Util.isCanopeServer())
			return constant.canopeServer+this.code+"_"+constant.videoQuality+".mp4";
		else
			return Util.getServer()+"/videos/"+this.code+"_"+constant.videoQuality+"."+constant.videoType;
	
	},
	
	// Handle event
	showVideo: function() {
		this.doVideoPlayed();
	}
});