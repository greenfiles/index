var cloudsFn = function() {
		// Default config
		// Note: Please don't change default config. Instead add overrides in config file.

		var DEFAULT_CONFIG = {
			// Rendering fames per second
			fps : 60,
			// Animation turn on/off
			animationActive : true,

			// Svg model path
			modelPath : "model/oblak-vise-tacaka.svg",

			// Viewport size
			viewportSelector : "#logo-viewport",
			viewport : {
				width : 512,
				height : 512,
			},
			// Max scene rotation by mouse in degrees
			sceneRotationDelta : 50,

			// Min and max number of clouds in one point
			cloudItemLayersMin : 1,
			cloudItemLayersMax : 2,

			// Min and max Z coordinate of clouds in one point
			cloudItemLayerMinZ : -25,
			cloudItemLayerMaxZ : 25,
			// Min and max scale of clouds in one point
			cloudItemLayerMinScale : 1.0,
			cloudItemLayerMaxScale : 1.5,
			// Min and max rotation speed of clouds in one point
			cloudItemLayerMinSpeed : -0.15,
			cloudItemLayerMaxSpeed : 0.15,
			// Cloud image
			cloudItemLayerImg : "cloud.png",
			cloudItemLayerMockImage : "MockModel02",

			// Thunder
			thunderActive : true,
			thunderTimeoutMin : 500,
			thunderTimeoutMax : 2000,
			thunderBrightnessMin : 0.30,
			thunderBrightnessMax : 1.50,
			thunderDurationMin : 2000, // ms
			thunderDurationMax : 5000, // ms
			thunderDistanceMin : 100,
			thunderDistanceMax : 500,

			// turn on/off animation in general
			animationActive : !(ui.mobile),
			// turn on/off thunder animation
			thunderActive : (ui.browser !== 'Firefox')
		};

		// Thunder animation class

		var Thunder = function (config, location) {
			this.config = config;
			this.location = location;
			this.duration = config.thunderDurationMin + Math.random() * (config.thunderDurationMax - config.thunderDurationMin);
			this.distance = config.thunderDistanceMin + Math.random() * (config.thunderDistanceMax - config.thunderDistanceMin);
			this.startTS = Date.now();
		};

		Thunder.prototype.isRunning = function () {
			return Date.now() < (this.startTS + this.duration);
		};

		Thunder.prototype.getFunctionResult = function () {
			var x = ((Date.now() - this.startTS) / this.duration) * Math.PI * 4 + Math.PI;
			var y = Math.abs(Math.sin(x) / (x*x*x)) * 80;
			return y;
		};

		Thunder.prototype.getBrightness = function (location) {
			var brightness = this.config.thunderBrightnessMin;

			var distanceX = this.location.x - location.x;
			var distanceY = this.location.y - location.y;
			var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

			if (distance < this.distance) {
				var amplitude = this.getFunctionResult();
				var brightnessDelta = this.config.thunderBrightnessMax - this.config.thunderBrightnessMin;
				var brightnessAtSource =  brightnessDelta * amplitude;
				var distanceMultiplier = 1 - (distance / this.distance);
				brightness = this.config.thunderBrightnessMin + distanceMultiplier * brightnessAtSource;
			}

			return brightness;
		};

		// Logo background class

		var Logo = function (config) {
			// Set missing config from default config
			for (var key in DEFAULT_CONFIG) {
				if (config[key] === undefined) {
					config[key] = DEFAULT_CONFIG[key];
				}
			}

			// Set local variables
			this.config = config;
			this.rotation = { x : 0, y : 0, z : 0, };
			this.translation = { x : 0, y : 0, z : 0 };
			this.scale = 1.0;
			this.scene = null;
			this.viewport = null;
			this.viewportOverlay = null;
			this.loader = null;
			this.cloudItems = [];
			this.thunders = [];
			this.updateIntervalRef = null;
		};

		Logo.prototype.init = function () {
			this.viewport = $(this.config.viewportSelector);
			this.viewport.addClass("logo-viewport");
			this.scene = $(document.createElement("div"));
			this.scene.addClass("logo-scene");
			this.viewport.append(this.scene);

			$(window).bind("mousemove", this.onMouseMove.bind(this));
			$(window).bind("resize", this.onWindowResize.bind(this));

			this.loader = new ModelLoader(this.config, this.config.modelPath);

			this.onWindowResize();
			this.initAnimation();
			this.initThunder();
			this.loadContent();
		};

		Logo.prototype.initAnimation = function () {
			if (this.config.animationActive) {
				this.initUpdateTimer();
			}
		};

		Logo.prototype.initUpdateTimer = function () {
			var intervalDuration = 1000 / this.config.fps;	// ms
			this.updateIntervalRef = setInterval(this.updateView.bind(this), intervalDuration);
		};

		Logo.prototype.initThunder = function () {
			if (this.config.thunderActive && this.config.animationActive) {
				this.initThunderFactory();
			} else {
				this.createOverlay();
			}
		};

		Logo.prototype.initThunderFactory = function () {
			var timeoutDelta = this.config.thunderTimeoutMax - this.config.thunderTimeoutMin;
			var timeout = this.config.thunderTimeoutMin + Math.random() * timeoutDelta;
			setTimeout(this.createThunder.bind(this), timeout);
		};

		Logo.prototype.createOverlay = function () {
			var opacity = 1 - this.config.thunderBrightnessMin;
			this.viewportOverlay = $(document.createElement("div"));
			this.viewportOverlay.addClass('logo-view-overlay');
			this.viewportOverlay.css("backgroundColor", "rgba(0, 0, 0, " + opacity + ")");
			this.viewport.append(this.viewportOverlay);
		};

		Logo.prototype.loadContent = function () {
			this.loader.load(function (model) {
				var normalizedModel = this.normalizeModel(model);
				this.showModel(normalizedModel);
			}.bind(this));
		};

		Logo.prototype.createThunder = function () {
		    // Create new thunder
		    if (this.cloudItems.length) {
				var index = Math.min(Math.round(this.cloudItems.length * Math.random()), this.cloudItems.length - 1);
				var cloudItem = this.cloudItems[index];
				var location = cloudItem.translation;
				var thunder = new Thunder(this.config, location);
				this.thunders.push(thunder);
			}

			// Schedule new thunder creation
			this.initThunderFactory();
		};

		Logo.prototype.getModelBoundingBox = function (model) {
			var minX = Number.MAX_VALUE;
			var minY = Number.MAX_VALUE;
			var maxX = Number.MIN_VALUE;
			var maxY = Number.MIN_VALUE;

			for (var i = 0; i < model.length; i++) {
				var point = model[i];
				minX = Math.min(minX, point.x);
				minY = Math.min(minY, point.y);
				maxX = Math.max(maxX, point.x);
				maxY = Math.max(maxY, point.y);
			}

			return {
				x : minX,
				y : minY,
				width : maxX - minX,
				height : maxY - minY
			};
		};

		Logo.prototype.translateModel = function (model, translation) {
			var translatedModel = [];
			for (var i = 0; i < model.length; i++) {
				var point = model[i];
				translatedModel.push({
					x : point.x + translation.x,
					y : point.y + translation.y
				});
			}
			return translatedModel;
		};

		Logo.prototype.scaleModel = function (model, scale) {
			var scaledModel = [];
			for (var i = 0; i < model.length; i++) {
				var point = model[i];
				scaledModel.push({
					x : point.x * scale,
					y : point.y * scale
				});
			}
			return scaledModel;
		};

		Logo.prototype.normalizeModel = function (model) {
			var bBox = this.getModelBoundingBox(model);

			var translation = {
				x : -bBox.x - bBox.width / 2,
				y : -bBox.y - bBox.height / 2
			};
			var translatedModel = this.translateModel(model, translation);

			var scale = Math.min(
				this.config.viewport.width / bBox.width,
				this.config.viewport.height / bBox.height
			);
			var scaledModel = this.scaleModel(translatedModel, scale);

			return scaledModel;
		};

		Logo.prototype.showModel = function (model) {
			for (var i = 0; i < model.length; i++) {
				var point = model[i];
				var cloudItem = new CloudItem(this.config, this.rotation);
				cloudItem.translation.x = point.x;
				cloudItem.translation.y = point.y;
				this.cloudItems.push(cloudItem);
				this.scene.append(cloudItem.view);
			}
			this.updateView();
		};

		Logo.prototype.updateView = function () {
		    // Filter running thunders
		    this.thunders = this.thunders.filter(function (thunder) {
		    	return thunder.isRunning();
		    });

		    // Update scene view
		    var transform = 'translateX(' + this.translation.x + 'px) \
		    				 translateY(' + this.translation.y + 'px) \
		    				 translateZ(' + this.translation.z + 'px) \
		        			 rotateX(' + this.rotation.x + 'deg) \
		        			 rotateY(' + this.rotation.y + 'deg) \
		        			 rotateZ(' + this.rotation.z + 'deg) \
		        			 scale(' + this.scale + ')';

		    this.scene.css("-webkit-transform", transform);
		    this.scene.css("-moz-transform", transform);
		    this.scene.css("-o-transform", transform);
		    this.scene.css("transform", transform);

		    // Update cloud items view
		    for (var i = 0; i < this.cloudItems.length; i++) {
		    	var cloudItem = this.cloudItems[i];

		    	// Set brightness
		    	var brightnesses = this.thunders.map(function (thunder) {
		    		return thunder.getBrightness(cloudItem.translation);
		    	});
		    	brightnesses.push(this.config.thunderBrightnessMin);
		    	cloudItem.brightness = Math.max.apply(null, brightnesses);
		    	
		    	cloudItem.updateView();
		    }
		};

		Logo.prototype.onMouseMove = function (e) {
		    this.rotation.y = -( .5 - ( e.clientX / window.innerWidth ) ) * this.config.sceneRotationDelta;
		    this.rotation.x = ( .5 - ( e.clientY / window.innerHeight ) ) * this.config.sceneRotationDelta;
		};

		Logo.prototype.onWindowResize = function () {
			this.scale = Math.min(
				1,
				window.innerWidth / this.config.viewport.width, 
				window.innerHeight / this.config.viewport.height
			);
		};


		// Cloud item class

		var CloudItem = function (config, sceneRotation) {
			this.config = config;
			this.sceneRotation = sceneRotation;
			this.translation = { x : 0, y : 0, z : 0 };
			this.rotation = { x : 0, y : 0, z : 0 };
			this,brightness = 1.0;
			this.view = null;
			this.layers = [];

			this.init();
		};

		CloudItem.prototype.init = function () {
		    this.view = $(document.createElement('div'));
		    this.view.addClass('logo-cloud-base');

		    // Create layers
		    var total = this.config.cloudItemLayersMin + 
		    	Math.round( Math.random() * (this.config.cloudItemLayersMax -  this.config.cloudItemLayersMin));
		    
		    for (var i = 0; i < total; i++) {
		    	var layer = new CloudItemLayer(this.config);
		    	layer.rotation.z = Math.random() * 180;

		    	var zScope = this.config.cloudItemLayerMaxZ - this.config.cloudItemLayerMinZ;
		    	layer.translation.z = this.translation.z + this.config.cloudItemLayerMinZ + Math.random() * zScope;
		    	
		    	var scaleScope = this.config.cloudItemLayerMaxScale - this.config.cloudItemLayerMinScale;
		    	layer.scale = this.config.cloudItemLayerMinScale + scaleScope * Math.random();
		    	
		    	var speedScope = this.config.cloudItemLayerMaxSpeed - this.config.cloudItemLayerMinSpeed;
		    	layer.speed = this.config.cloudItemLayerMinSpeed + speedScope * Math.random();

		    	this.layers.push(layer);
		    	this.view.append(layer.view);
		    }

		};

		CloudItem.prototype.updateView = function () {
		    var transform = 'translateX(' + this.translation.x + 'px) \
		        			 translateY(' + this.translation.y + 'px) \
		        			 translateZ(' + this.translation.z + 'px)';

		    this.view.css("-webkit-transform", transform);
		    this.view.css("-moz-transform", transform);
		    this.view.css("-o-transform", transform);
		    this.view.css("transform", transform);

			for (var i = 0; i < this.layers.length; i++) {
				var layer = this.layers[i];
				layer.rotation.x = -this.sceneRotation.x;
				layer.rotation.y = -this.sceneRotation.y;
				layer.brightness = this.brightness;
				layer.updateView();
			}
		};


		// Cloud item layer class

		CloudItemLayer = function (config) {
			this.config = config;
			this.translation = { x : 0, y : 0, z : 0 };
			this.rotation = { x : 0, y : 0, z : 0 };
			this.scale = 1.0;
			this.speed = 0.1;
			this.brightness = 1.0;
			this.view = null;

			this.init();
		};

		CloudItemLayer.prototype.init = function () {
			this.view = $(document.createElement('img'));
			this.view.attr("src", this.config.cloudItemLayerImg);
			this.view.addClass('logo-cloud-layer');
			if(ui.browser == 'Firefox' || ui.mobile) {
				var rnd = (Math.floor(Math.random() * (30 - 10 + 1)) + 10) / 100;
				this.view.css('opacity', rnd);
			}
		};

		CloudItemLayer.prototype.updateView = function () {
			this.rotation.z += this.speed;

		    var transform = 'translateX(' + this.translation.x + 'px) \
		            		 translateY(' + this.translation.y + 'px) \
		            		 translateZ(' + this.translation.z + 'px) \
		            		 rotateX(' + this.rotation.x + 'deg) \
		            		 rotateY(' + this.rotation.y + 'deg) \
		            		 rotateZ(' + this.rotation.z + 'deg) \
		            		 scale(' + this.scale + ')';

		    this.view.css("-webkit-transform", transform);
		    this.view.css("-moz-transform", transform);
		    this.view.css("-o-transform", transform);
		    this.view.css("transform", transform);

		    if (this.config.thunderActive && this.config.animationActive) {
			    var filter = "brightness(" + this.brightness + ")";

			    this.view.css("-webkit-filter", filter);
			    this.view.css("-moz-filter", filter);
			    this.view.css("-o-filter", filter);
			    this.view.css("filter", filter);
			}
		};


		// Model loader

		ModelLoader = function (config, path) {
			this.config = config;
			this.path = path;
		};

		ModelLoader.prototype.load = function (callback) {
			if (window.location.origin === "file://") {
				this.loadMock(function (data) {
					var model = this.parse(data);
					callback(model);
				}.bind(this));
			} else {
				this.loadPath(function (data) {
					var model = this.parse(data);
					callback(model);
				}.bind(this));
			}
		};

		ModelLoader.prototype.loadMock = function (callback) {
			var mockName = this.config.cloudItemLayerMockImage;
			callback(window[mockName]);
		};

		ModelLoader.prototype.loadPath = function (callback) {
			$.ajax({
				url : this.path,
				method : "GET",
				success : function (data, textStatus, jqXHR) {
					callback(jqXHR.responseText);
				}.bind(this),
			});
		};

		ModelLoader.prototype.parse = function (data) {
			// Returns list of paths starting points
			var model = [];

			var xmlDom = $.parseXML(data);
			var xml = $(xmlDom);

			// Read paths locations and store them in model
			var paths = xml.find("path");
			for (var i = 0; i < paths.length; i++) {
				var path = $(paths[i]);
				var pathDef = path.attr("d");
				if (pathDef) {
					var point = this.parsePath(pathDef);
					if (point) {
						model.push(point);
					}
				}
			}

			return model;
		};

		ModelLoader.prototype.parsePath = function (def) {
			// Gets only first point of path and returns it.
			var result = null;

			var re = /M[0-9.,]+\D/;
			
			var execRes = re.exec(def);
			if (execRes && execRes[0]) {
				var startPointDef = execRes[0];
				var startPoint = startPointDef.substring(1, startPointDef.length-1);
				var parsed = startPoint.split(',');
				result = {
					x : parseFloat(parsed[0]),
					y : parseFloat(parsed[1])
				};
			}

			return result;
		};


		// Export Logo lib
		window.Logo = Logo;
	}

	var config = {
			// Rendering rfames per second
			fps: 25,

			// Svg model path
			modelPath: "model/oblak-vise-tacaka.svg",

			// Viewport size
			viewportSelector: "#logo-viewport",
			viewport: {
				width: 800,
				height: 800,
			},
			// Max scene rotation by mouse in degrees
			sceneRotationDelta: 30,

			// Min and max number of clouds in one point
			cloudItemLayersMin: 1,
			cloudItemLayersMax: 2,

			// Min and max Z coordinate of clouds in one point
			cloudItemLayerMinZ: -25,
			cloudItemLayerMaxZ: 25,
			// Min and max scale of clouds in one point
			cloudItemLayerMinScale: 2.0,
			cloudItemLayerMaxScale: 2.5,
			// Min and max rotation speed of clouds in one point
			cloudItemLayerMinSpeed: -0.45,
			cloudItemLayerMaxSpeed: 0.45,
			// Cloud image
			cloudItemLayerImg: "cloud.png",
			cloudItemLayerMockImage: "MockModel02",

			// Thunder
			thunderTimeoutMin: 500,
			thunderTimeoutMax: 2000,
			thunderBrightnessMin: 0.20,
			thunderBrightnessMax: 1.80,
			thunderDurationMin: 1000, // ms
			thunderDurationMax: 6000, // ms
			thunderDistanceMin: 100,
			thunderDistanceMax: 700,
		};