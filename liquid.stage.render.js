Liquid.Lib.extend(Liquid.Stage.prototype, {
	
	// Start tainted 
	tainted : true,
	
	// Pay attention to zIndex of render objects (sort render list on each frame)
	orderByZIndex : true,
	
	setupRendering : function f_Liquid_Stage_setupRendering (frameRate) {
		var stage = this;
		
		// Setup empty render list 
		stage.empty();
		
		// Frame rate
		stage.frameRate = frameRate || 20;
		
		// Get renderer
		stage.renderer = stage.getRenderer();
		
		// Start interval
		stage.start();
	},
	
	start : function f_Liquid_Stage_start () {
		var stage = this;
		// Reset frame counter
		stage.frame = 0;
		// Start render interval
		stage.renderHandle = setInterval(stage.renderer, 1000 / stage.frameRate);
	},
	
	stop : function f_Liquid_Stage_stop () {
		clearInterval(this.renderHandle);
	},
	
	addChild : function f_Liquid_Stage_addChild (object) {
		this.renderList.push(object);
		//console.log('stage.renderList', object, this.renderList.length);
	},
	
	empty : function f_Liquid_Stage_empty () {
		// Clear render list
		this.renderList = [];
	},
	
	// Main render function builder
	getRenderer : function f_Liquid_Stage_getRenderer () {
		// Shortcut References
		var stage = this;
		var context = stage.context;
		
		// Return the closure
		return f_Liquid_Stage_render;
		
		// Build a closure
		// We're not using bind here since it would double the function calls
		function f_Liquid_Stage_render () {
			
			// Debugging
			if (stage.measure && console.time) {
				stage.tainted = true;
				console.time('render');
			} else if (stage.profile && console.profile) {
				stage.tainted = true;
				console.profile('render');
			}
			
			stage.frame++;
			
			// Call enterframe handlers
			stage.handleEvent({ type : 'enterframe', normalizedType : 'enterframe' });
			
			var tainted = stage.tainted;
			//console.log('frame', stage.frame, 'tainted?', tainted);
			
			var renderList = stage.renderList;
			// Check if the state of an object in renderList has changed
			if (!tainted) {
				//console.log('check if some objects are tainted (', renderList.length, ' objects)');
				for (var i = 0, renderObject; renderObject = renderList[i]; i++) {
					//console.log('check if ' + renderObject + ' is tainted:', renderObject.tainted);
					if (renderObject.tainted) {
						//console.log(renderObject, 'is tainted');
						tainted = true;
						break;
					}
				}
			}
			
			if (!tainted) {
				//console.log('frame', stage.frame, ': skip');
				return;
			}
		
			// Render whole canvas from scratch
			//console.log('frame', stage.frame, ': draw all');
			
			// Save the frame number
			stage.lastDrawnFrame = stage.frame;
			
			// Clear the whole canvas
			context.clearRect(0, 0, stage.width, stage.height);
			
			// Sort render list by z-index
			if (stage.orderByZIndex) {
				renderList = renderList.sort(stage.sortRenderList);
			}
			
			// Iterate the renderList 
			for (var i = 0, renderObject; renderObject = renderList[i]; i++) {
				
				//console.log('consider rendering ', renderObject, ' directly?', renderObject.renderDirectly, ' visible?', renderObject.visible);
				
				// Reset tainted state
				//console.log('Reset tainted state of', renderObject);
				renderObject.tainted = false;
				
				// Only draw directly renderable and visible objects
				if (!renderObject.renderDirectly || !renderObject.visible) {
					//console.log('skip rendering of ', renderObject);
					continue;
				}
				
				// Finally, call the object's draw method
				//console.log('render ', renderObject, ' (call draw)');
				renderObject.draw(context, stage);
				
			} // End for sortedRenderList
			
			stage.tainted = false;
			
			// Debugging
			if (stage.measure && console.timeEnd) {
				console.timeEnd('render');
				stage.measure = false;
			} else if (stage.profile && console.profileEnd) {
				console.profileEnd('render');
				stage.profile = false;
			}
			
		} // End f_Liquid_Stage_render
		
	}, // End f_Liquid_Stage_getRenderer
	
	sortRenderList : function f_Liquid_sortRenderList (a, b) {
		var zA = a.zindex;
		var zB = b.zindex;
		if (zA == zB) {
			return 0;
		}
		if (zA <  zB) {
			return -1;
		} else {
			return 1;
		}
	}
	
});