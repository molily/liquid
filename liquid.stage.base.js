Liquid.Stage = function f_Liquid_Stage_constructor (canvas, opts) {
	var stage = this;
	
	opts = opts || {};
	
	// Canvas 
	canvas = typeof canvas == 'string' ? document.getElementById(canvas) : canvas;
	stage.canvas = canvas;
	
	// Get canvas context 
	stage.context = canvas.getContext('2d');
	
	stage.setupDimensions();
	window.addEventListener('resize', stage.setupDimensions.bind(stage), false);
	
	stage.setupRendering(opts.frameRate);
	stage.setupEventHandling();
	
	stage.clearStatus();
}

Liquid.Stage.supported = function f_Liquid_Stage_supported (canvas) {
	canvas = canvas || document.createElement('canvas');
	return !!(canvas.getContext && canvas.getContext('2d'));
};

Liquid.Stage.prototype = {
	
	// Status handling
	
	setStatus : function f_Liquid_Stage_setStatus (status) {
		var stage = this;
		stage.status = stage.canvas.className = status;
	},
	
	clearStatus : function f_Liquid_Stage_clearStatus () {
		var stage = this;
		stage.status = stage.canvas.className = '';
	},
	
	// Canvas dimensions
	
	resizeTimeout : null,
	
	setupDimensions : function f_Liquid_stage_setupDimensions (e) {
		var stage = this;
		var canvas = stage.canvas;
		
		//console.log('f_Liquid_stage_setupDimensions');
		
		// Set stage size and set canvas size to the actual size
		stage.width = canvas.width = canvas.offsetWidth;
		stage.height = canvas.height = canvas.offsetHeight;
		stage.halfWidth = stage.width / 2;
		stage.halfHeight = stage.height / 2;
		
		// Calculate cumulative offset just once
		stage.canvasPosition = Liquid.Lib.findPosition(stage.canvas);
		
		// Taint the stage after a short delay
		if (e) {
			if (stage.resizeTimeout) {
				window.clearTimeout(stage.resizeTimeout);
			}
			stage.resizeTimeout = window.setTimeout(function f_Liquid_stage_setupDimensions_taintStage () {
				//console.log('f_Liquid_stage_setupDimensions_taintStage', +new Date);
				stage.tainted = true;
			}, 250);
		}
		
	},
	
	setupPerformanceProfiling : function f_Liquid_stage_setupDimensions () {
		var stage = this;
		
		document.addEventListener('keypress', function f_document_key_pressed (e) {
			var key = String.fromCharCode(e.which || e.charCode);
			if (key == 'r') {
				stage.measure = true;
			} else if (key == 'p') {
				stage.profile = true;
			}
		}, false);
	
	}
	
};