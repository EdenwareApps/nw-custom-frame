/*jshint esversion: 6 */
/*jshint node: true */
(function() {
	
	"use strict";
	
				
	var json = require('./package.json'), fs = require('fs'), path = require('path');

	function extend(obj) {
		Array.prototype.slice.call(arguments, 1).forEach(function(source) {
			if (source) {
				for (var prop in source) {
					if (source[prop].constructor === Object) {
						if (!obj[prop] || obj[prop].constructor === Object) {
							obj[prop] = obj[prop] || {};
							extend(obj[prop], source[prop]);
						} else {
							obj[prop] = source[prop];
						}
					} else {
						obj[prop] = source[prop];
					}
				}
			}
		});
		return obj;
	}
	var packageJSON = window.nw.App.manifest;
	
	var _defaultAppIcon = "default_icon.png";
	var _defaultTheme = "nw-custom-frame-theme.css";
	
	var _defaultOptions = {
		"id": "nw-custom-frame",
		"theme": "",
		"uiIconsTheme": "",
        "layout": "horizontal",
        "position": "top",
        "size": 30,
        "frameIconSize": 21,
		"classes": {
			"main": 'nw-cf',
			"inner": 'nw-cf-inner',
			"handle": 'nw-cf-handle',
			"icon": 'nw-cf-icon',
			"title": 'nw-cf-title',
			"buttonsGroup": 'nw-cf-buttons',
			"buttonBase": 'nw-cf-btn',
			"buttons": {
				"minimize": 'nw-cf-minimize',
				"maximize": 'nw-cf-maximize',
				"restore": 'nw-cf-restore',
				"close": 	'nw-cf-close',
			},
			"icons": {
				"minimize": 'nw-cf-icon-minimize',
				"maximize": 'nw-cf-icon-maximize',
				"restore": 'nw-cf-icon-restore',
				"close": 	'nw-cf-icon-close',
			}
		},
		"locales": {
			"en": {
				"close": "Close",
				"maximize": "Maximize",
				"restore": "Restore",
				"minimize": "Minimize",
			},
			"fr": {
				"close": "Fermer",
				"maximize": "Agrandir",
				"restore": "Restaurer",
				"minimize": "Réduire",
			}
		},
		"includeCSS": true,
	};
	
	var getFavicon = function(document){
		var favicon;
		var nodeList = document.getElementsByTagName("link");
		for (var i = 0; i < nodeList.length; i++) {
			if((nodeList[i].getAttribute("rel") === "icon")||(nodeList[i].getAttribute("rel") === "shortcut icon")) {
				favicon = nodeList[i].getAttribute("href");
			}
		}
		return favicon;        
	};
	
	class CustomFrame {
		
		constructor(_window, options) {
			
			this.initialized = false;
			this.options = extend({}, _defaultOptions, options);
			
			this.window = _window;
			this.document = _window.document;
			
		}
		create() {
		
			var that = this;
			
			var options = this.options;
			if(that.window.localStorage.nwCustomFrameState === undefined) {
				that.window.localStorage.nwCustomFrameState = "initial";
			}

			var currentLocale = window.navigator.language;

			var locales = options.locales[currentLocale] !== undefined ? options.locales[currentLocale] : options.locales[Object.keys(options.locales)[0]];
			
			var mainContainer = document.createElement("header");
			mainContainer.setAttribute("id", options.id);
			mainContainer.setAttribute("class", options.classes.main);
			
			var innerContainer = document.createElement("div");
			innerContainer.setAttribute("class", options.classes.inner);
			mainContainer.appendChild(innerContainer);
			
			var handleContainer = document.createElement("div");
			handleContainer.setAttribute("class", options.classes.handle);
			handleContainer.setAttribute("style", '-webkit-app-region:drag;');
			innerContainer.appendChild(handleContainer);
			
			var frameIcon = document.createElement("span");
			frameIcon.setAttribute("class", options.classes.icon);
			handleContainer.appendChild(frameIcon);
						
			var favicon = getFavicon(this.document);
			
			if(favicon !== undefined) {
				var filename = path.resolve(packageJSON.window.icon);
				if(fs.existsSync(filename)) {
					favicon = filename;
				}
			} else if(packageJSON.window !== undefined && packageJSON.window.icon !== undefined) {
				var filename = path.resolve(packageJSON.window.icon);
				if(fs.existsSync(filename)) {
					favicon = filename;
				}
			} else {
				favicon = _defaultAppIcon;
			}
			
			frameIcon.setAttribute("style", "background-image: url('"+favicon.replace(new RegExp('\\' + path.sep, 'g'), '/')+"')");

			
			var titleStr;
			
			if(this.document.getElementsByTagName('title').length !== 0) {
				titleStr = this.document.title;
			} else if(packageJSON.window !== undefined && packageJSON.window.title !== undefined) {
				titleStr = this.document.title = packageJSON.window.title;
			} else {
				titleStr = this.document.title = "Custom Frame";
				
			}
			
			var titleSpan = document.createElement("span");
			titleSpan.setAttribute("class", options.classes.title);
			titleSpan.innerHTML = titleStr;
			handleContainer.appendChild(titleSpan);
			
			var buttonsContainer = document.createElement("div");
			buttonsContainer.setAttribute("class", options.classes.buttonsGroup);
			innerContainer.appendChild(buttonsContainer);
			
			var buttonMinimize = document.createElement("button");
			buttonMinimize.setAttribute("class", options.classes.buttonBase + " " + options.classes.buttons.minimize);
			buttonMinimize.setAttribute("title", locales.minimize);
			buttonsContainer.appendChild(buttonMinimize);
			
			var buttonMaximize = document.createElement("button");
			buttonMaximize.setAttribute("class", options.classes.buttonBase + " " + options.classes.buttons.maximize);
			buttonMaximize.setAttribute("title", locales.maximize);
			buttonsContainer.appendChild(buttonMaximize);
			
			var buttonRestore = document.createElement("button");
			buttonRestore.setAttribute("class", options.classes.buttonBase + " " + options.classes.buttons.restore);
			buttonRestore.setAttribute("title", locales.restore);
			buttonsContainer.appendChild(buttonRestore);
			
			var buttonClose = document.createElement("button");
			buttonClose.setAttribute("class", options.classes.buttonBase + " " + options.classes.buttons.close);
			buttonClose.setAttribute("title", locales.close);
			buttonsContainer.appendChild(buttonClose);
			
			var iconMinimize = document.createElement("i");
			iconMinimize.setAttribute("class", options.classes.icons.minimize);
			buttonMinimize.appendChild(iconMinimize);
			
			var iconMaximize = document.createElement("i");
			iconMaximize.setAttribute("class", options.classes.icons.maximize);
			buttonMaximize.appendChild(iconMaximize);
			
			var iconRestore = document.createElement("i");
			iconRestore.setAttribute("class", options.classes.icons.restore);
			buttonRestore.appendChild(iconRestore);
			
			var iconClose = document.createElement("i");
			iconClose.setAttribute("class", options.classes.icons.close);
			buttonClose.appendChild(iconClose);


			var nwWin = this.window.nw.Window.get();

			var inititalPosX = nwWin.x, inititalPosY = nwWin.y;
			var inititalSizeW = nwWin.width, inititalSizeH = nwWin.height;

			if(options.customFrameState === "maximized") {
				buttonMaximize.setAttribute("style", buttonMaximize.getAttribute("style") === null ? "display: none;" : buttonMaximize.getAttribute("style") + "display: none;");
				nwWin.maximize();
			} else if(options.customFrameState === "fullscreen") {
				nwWin.enterFullscreen();
			} else {
				buttonRestore.setAttribute("style", buttonRestore.getAttribute("style") === null ? "display: none;" : buttonRestore.getAttribute("style") + "display: none;");
			}

			
			nwWin.removeAllListeners("restore");
			nwWin.removeAllListeners("minimize");
			nwWin.removeAllListeners("maximize");
			nwWin.removeAllListeners("enter-fullscreen");
			nwWin.removeAllListeners("leave-fullscreen");
			nwWin.removeAllListeners("close");
			
			nwWin.on("maximize", function() {
				that.window.localStorage.nwCustomFrameState = "maximized";
                if(buttonMaximize.getAttribute("style") === null ||
                   (buttonMaximize.getAttribute("style") !== null && buttonMaximize.getAttribute("style").indexOf("display: none;") === -1)) {
				    buttonMaximize.setAttribute("style", buttonMaximize.getAttribute("style") === null ? "display: none;" : buttonMaximize.getAttribute("style") + "display: none;");
                }
                buttonRestore.setAttribute("style", buttonRestore.getAttribute("style").replace("display: none;", ""));

				that.window.localStorage.nwCustomFramePosX = inititalPosX;
				that.window.localStorage.nwCustomFramePosY = inititalPosY;
				that.window.localStorage.nwCustomFrameSizeW = inititalSizeW;
				that.window.localStorage.nwCustomFrameSizeH = inititalSizeH;
			});
			
			var stateBeforeFullScreen;

			nwWin.on("enter-fullscreen", function() {
				stateBeforeFullScreen = that.window.localStorage.nwCustomFrameState;
				that.window.localStorage.nwCustomFrameState = "fullscreen";
				mainContainer.setAttribute("style", mainContainer.getAttribute("style") === null ? "display: none;" : mainContainer.getAttribute("style") + "display: none;");

			});

			nwWin.on("leave-fullscreen", function() {
				that.window.localStorage.nwCustomFrameState = stateBeforeFullScreen === "maximized" ? stateBeforeFullScreen : "restored";
				mainContainer.setAttribute("style", mainContainer.getAttribute("style").replace("display: none;", ""));

			});

			nwWin.on("restore", function() {
				that.window.localStorage.nwCustomFrameState = "restored";
				buttonRestore.setAttribute("style", buttonRestore.getAttribute("style") === null ? "display: none;" : buttonRestore.getAttribute("style") + "display: none;");
				buttonMaximize.setAttribute("style", buttonMaximize.getAttribute("style").replace("display: none;", ""));
				mainContainer.setAttribute("style", mainContainer.getAttribute("style").replace("display: none;", ""));
			});

			nwWin.on("minimize", function() {
				that.window.localStorage.nwCustomFrameState = "minimized";
			});

			nwWin.on("close", function() {
				
				if(that.window.localStorage.nwCustomFrameState !== "maximized") {
					that.window.localStorage.nwCustomFramePosX = nwWin.x;
					that.window.localStorage.nwCustomFramePosY = nwWin.y;
					that.window.localStorage.nwCustomFrameSizeW = nwWin.width;
					that.window.localStorage.nwCustomFrameSizeH = nwWin.height;
				}
				
				nwWin.removeAllListeners("restore");
				nwWin.removeAllListeners("minimize");
				nwWin.removeAllListeners("maximize");
				nwWin.removeAllListeners("enter-fullscreen");
				nwWin.removeAllListeners("leave-fullscreen");
				
				   nwWin.close(true);
				   
				
			});

			buttonMinimize.addEventListener('click', function() {
				nwWin.minimize();
			});

			buttonMaximize.addEventListener('click', function() {

				inititalPosX = nwWin.x;
				inititalPosY = nwWin.y;

				inititalSizeW = nwWin.width;
				inititalSizeH = nwWin.height;


				nwWin.maximize();
			});

			buttonRestore.addEventListener('click', function() {
				nwWin.restore();
			});

			buttonClose.addEventListener('click', function() {
				nwWin.close();
			});
			
			function outerHeight(el) {
			  var height = el.offsetHeight;
			  var style = getComputedStyle(el);

			  height += parseInt(style.marginTop) + parseInt(style.marginBottom);
			  return height;
			}
            
            

			function finish() {
                
                var _getPositionHLayout = function(pos) {
                    if(pos === "left") {
                        pos = "top";
                    } else if(pos === "right") {
                        pos = "bottom";
                    }
                    return pos;
                };
                var _getPositionVLayout = function(pos) {
                    if(pos === "top") {
                        pos = "left";
                    } else if(pos === "bottom") {
                        pos = "right";
                    }
                    return pos;
                };

                var body = that.document.body;
                var bodyStyle = getComputedStyle(body);
                
                var pos = "top";
                
                /*
                switch(options.layout) {
                    case "horizontal":
                        pos = _getPositionHLayout(options.position);
                        break;
                    case "vertical":
                        pos = _getPositionVLayout(options.position);
                        break;
                }
                */
                
                
                mainContainer.style.position = "fixed";
                mainContainer.style.width = "100%";
                mainContainer.style.height = Number.isInteger(options.size) ? options.size + "px" : options.size;
                mainContainer.style.lineHeight =  mainContainer.style.height;
                mainContainer.style.boxSizing = "border-box";
                
                innerContainer.style.display = "flex";
                
                handleContainer.style.height = mainContainer.style.height;
                handleContainer.style.lineHeight = mainContainer.style.height;
                handleContainer.style.flex = "1 0 0";
                
                frameIcon.style.width = Number.isInteger(options.frameIconSize) ? options.frameIconSize + "px" : options.frameIconSize;
                frameIcon.style.backgroundSize = frameIcon.style.width;
                frameIcon.style.height = mainContainer.style.height;
                frameIcon.style.display = "inline-block";
                frameIcon.style.verticalAlign = "inherit";
                
                buttonsContainer.style.height = mainContainer.style.height;
                buttonsContainer.style.lineHeight = mainContainer.style.height;
                
                buttonMinimize.style.height = mainContainer.style.height;
                buttonMinimize.style.lineHeight = mainContainer.style.height;
                
                buttonMaximize.style.height = mainContainer.style.height;
                buttonMaximize.style.lineHeight = mainContainer.style.height;
                
                buttonRestore.style.height = mainContainer.style.height;
                buttonRestore.style.lineHeight = mainContainer.style.height;
                
                buttonClose.style.height = mainContainer.style.height;
                buttonClose.style.lineHeight = mainContainer.style.height;
                
				body.insertBefore( mainContainer, body.firstChild );
                
                switch(pos) {
                    case "top":
                        mainContainer.style.top = 0;
                        mainContainer.style.left = 0;
                        
                        body.style.marginTop =  mainContainer.offsetHeight + "px";
                        
                        break;
                    case "bottom":
                        mainContainer.style.bottom = 0;
                        mainContainer.style.left = 0;
                        
                        body.style.marginBottom = mainContainer.offsetHeight + "px";
                        
                        break;
                }
                
			}

			if(options.includeCSS) {
				
				var coreLoaded = false, themeLoaded = false, iconLoaded = false;
				
				var onLoad = function() {
					if(coreLoaded && themeLoaded && iconLoaded) {
						finish();
					}
				};
				
				if(json.style !== undefined) {
					new Promise(function(res) {
						var cssFilename = json.style.endsWith('.css') ? json.style : json.style + '.css';
						var linkHref = path.resolve(__dirname, cssFilename);

						if(fs.existsSync(linkHref)) {
							var link = document.createElement('style');
							link.innerHTML = fs.readFileSync(linkHref);
							that.document.head.appendChild(link);
							res();
						} else {
							res();
						}
					}).then(function() {
						coreLoaded = true;
						onLoad();
					});
				}
                
                var uiIconsTheme = path.resolve(__dirname, 'icons/css/nw-cf-fa.css');
                
				if(options.uiIconsTheme !== undefined && options.uiIconsTheme !== "") {
                    if(fs.existsSync(options.uiIconsTheme)) {
                        uiIconsTheme = options.uiIconsTheme;
                    }
				}
                
                new Promise(function(res) {

                    if(fs.existsSync(uiIconsTheme)) {
                        var link = document.createElement('link');
                        link.setAttribute('rel', 'stylesheet');
                        link.setAttribute('type', 'text/css');
                        link.setAttribute('href', uiIconsTheme);
                        link.onload = function(e) {
                            res(e);
                        }; 
                        link.async = false;
                        that.document.head.appendChild(link);
                    } else {
                        iconMaximize.innerHTML = "&#9744;";
                        iconClose.innerHTML = "&#10006;";
                        iconMinimize.innerHTML = "&#9866;";
                        iconRestore.innerHTML = "&#10064;";
                        res();
                    }
                }).then(function() {
                    iconLoaded = true;
                    onLoad();
                });
                
				if(options.theme !== undefined && options.theme !== "") {
					new Promise(function(res) {

						if(fs.existsSync(options.theme)) {
							var link = document.createElement('link');
							link.setAttribute('rel', 'stylesheet');
							link.setAttribute('type', 'text/css');
							link.setAttribute('href', options.theme);
							link.onload = function(e) {
								res(e);
							}; 
							link.async = false;
							that.document.head.appendChild(link);
						} else {
							res();
						}
					}).then(function() {
						themeLoaded = true;
						onLoad();
					});
				} else {
                    var linkHref = path.resolve(__dirname, _defaultTheme);

                    if(fs.existsSync(linkHref)) {
                        var link = document.createElement('style');
                        link.innerHTML = fs.readFileSync(linkHref);
                        that.document.head.appendChild(link);
                    }
					themeLoaded = true;
					onLoad();
				}
				
				
			} else {
				finish();
			}
		}
		
	}
	
	exports.attach = function(_window, options) {
		
		var cf = new CustomFrame(_window, options);
		cf.create();
		_window.nw.Window.get().__cfInitialized = true;
		
	};
	

})();