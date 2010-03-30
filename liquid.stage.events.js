Liquid.Lib.extend(Liquid.Stage.prototype, {
	
	// Dragging state
	dragging : false,
	
	// Click after dragging
	clickStopsDragging : false,
	
	// Event handler function store
	eventHandlers : {},
	
	eventTypes : ['enterframe', 'mousemove', 'mousedown', 'mouseup', 'click', 'mousewheel'],
	eventTypesToListen : ['mousemove', 'mousedown', 'mouseup', 'click', 'mousewheel', 'DOMMouseScroll'],
	
	addEventListener : function f_Liquid_stage_addEventListener (eventType, handler, capturing) {
		//console.log('addEventListener', eventType, handler, capturing);
		var stage = this;
		var eventHandlers = stage.eventHandlers[eventType];
		if (!eventHandlers) {
			throw new Error('f_Liquid_stage_addEventListener: Event not supported');
		}
		eventHandlers[capturing === true ? 'capturing' : 'bubbling'].push(handler);
		// Allow method chaining
		return stage;
	},
	
	setupEventHandling : function f_Liquid_Stage_setupEventHandling () {
		var stage = this;
		var canvas = stage.canvas;
		
		var eventTypes = stage.eventTypes;
		for (var i = 0, eventType; eventType = eventTypes[i]; i++) {
			// Create shortcut functions for event handler registration
			stage[eventType] = stage.addEventListener.bind(stage, eventType);
			
			// Create event handler function store
			stage.eventHandlers[eventType] = {
				capturing : [],
				bubbling : []
			};
		}
		
		// Add a listener for each event at the canvas element
		var boundHandler = stage.handleEvent.bind(stage);
		eventTypes = stage.eventTypesToListen;
		for (i = 0; eventType = eventTypes[i]; i++) {
			canvas.addEventListener(eventType, boundHandler, false);
		}
	},
	
	handleEvent : function f_Liquid_Stage_handleEvent (e) {
		//console.log('f_Liquid_Stage_handleEvent', e.type);
		var stage = this;
		
		var eventType = e.type;
		
		// Normalize Event, modifies object
		if (eventType != 'enterframe') {
			stage.normalizeEvent(e);
			eventType = e.normalizedType;
		}
		
		// Don't handle event if it's a click after dragging
		if (eventType == 'click' && stage.clickStopsDragging) {
			//console.log('ignore click event', stage.clickStopsDragging);
			stage.clickStopsDragging = false;
			return;
		}
		
		var stageWideHandlers = stage.eventHandlers[eventType];
		
		var i, handlers, handler, returnValue;
		
		// Call stage-wide handlers for the CAPTURING phase
		handlers = stageWideHandlers.capturing;
		for (i = 0; handler = handlers[i]; i++) {
			returnValue = handler.call(stage, e);
			if (returnValue === false) {
				//console.log('A stage-wide handler stopped the stage-wide propagation of', eventType, 'during capturing');
				return;
			}
		}
		
		// Distribute events to render objects
		returnValue = stage.distributeEvent(e);
		// Stop stage-wide propagation if a render object handler returned false
		if (returnValue === false) {
			//console.log('A renderObject handler stopped the stage-wide propagation of', eventType);
			return;
		}
		
		// Call stage-wide handlers for the BUBBLING phase
		handlers = stageWideHandlers.bubbling;
		for (i = 0; handler = handlers[i]; i++) {
			returnValue = handler.call(stage, e);
			if (returnValue === false) {
				//console.log('A stage-wide handler stopped the stage-wide propagation of', eventType, 'during bubbling');
				return;
			}
		}
		
	},
	
	mouseTouchesObject : function f_Liquid_Stage_mouseTouchesObject (e, renderObject) {
		var stage = this;
		if (!renderObject.getBoundingBox) {
			return false;
		}
		
		var boundingBox;
		if (renderObject.lastBoundingBoxFrame == stage.lastDrawnFrame) {
			//console.log(renderObject.lastBoundingBoxFrame, stage.lastDrawnFrame, '> reuse bounding box');
			boundingBox = renderObject.boundingBox;
		} else {
			//console.log(renderObject.lastBoundingBoxFrame, stage.lastDrawnFrame, '> get new bounding box');
			boundingBox = renderObject.getBoundingBox(stage.lastDrawnFrame);
		}
		
		var ex = e.offsetX;
		var ey = e.offsetY;
		
		return ex >= boundingBox.x1 && ey >= boundingBox.y1 && ex <= boundingBox.x2 && ey <= boundingBox.y2;
	},
	
	currentHoverObject : null,
	
	// Emulate mouseover and mouseout for render objects
	distributeMousemove : function f_Liquid_Stage_distributeMousemove (e) {
		var stage = this;
		var currentHoverObject = stage.currentHoverObject;
		
		var renderList = stage.renderList;
		var i = renderList.length;
		while (i--) {
			var renderObject = renderList[i];
			
			if (!renderObject.visible) {
				continue;
			}
			
			var mouseTouchesBox = stage.mouseTouchesObject(e, renderObject);
			
			if (renderObject == currentHoverObject) {
				
				if (mouseTouchesBox) {
					if (renderObject.mousemove) {
						renderObject.mousemove(e);
					}
				} else {
					if (renderObject.mouseout) {
						renderObject.mouseout(e);
					}
					stage.currentHoverObject = null;
				}
				
			} else if (mouseTouchesBox) {
				
				if (renderObject.mouseover) {
					renderObject.mouseover();
				}
				
				if (renderObject.mousemove) {
					renderObject.mousemove();
				}
				
				// Set new currently hovered object
				stage.currentHoverObject = renderObject;
			}
		}
	},
	
	// Distribute events to render objects
	distributeEvent : function f_Liquid_Stage_distributeEvent (e) {
		//console.log('f_Liquid_Stage_distributeEvent');
		var stage = this;
		
		if (stage.dragging) {
			return;
		}
		
		var eventType = e.normalizedType;
		//console.log('f_Liquid_Stage_distributeEvent', eventType);
		
		if (eventType == 'mousemove') {
			// Special treatment for mousemove events
			stage.distributeMousemove(e);
			return;
		}
		
		var isClickEvent = eventType == 'click' || eventType == 'mousedown' || eventType == 'mouseup';
		
		
		// Iterate the sorted render list bottom-up (bubbling)
		var renderList = stage.renderList;
		//console.log('f_Liquid_Stage_distributeEvent', eventType, 'to', renderList.length, 'objects');
		
		var i = renderList.length;
		while (i--) {
			var renderObject = renderList[i];
			//console.log('f_Liquid_Stage_distributeEvent', eventType, 'to', renderObject, i);
			
			// Click detection
			if (isClickEvent) {
				// Check if mouse touches object
				if (stage.mouseTouchesObject(e, renderObject)) {
					//console.log('f_Liquid_Stage_distributeEvent:', eventType, 'at', renderObject);
				} else {
					// Skip object
					continue;
				}
			}
			
			// Call handler
			var handler = renderObject[eventType];
			if (handler) {
				//console.log('Call', eventType, 'handler of', renderObject);
				var returnValue = handler.call(renderObject, e);
				//console.log(eventType, 'handler', handler, 'returned', returnValue);
				if (returnValue === false) {
					// Stop propagation to other renderObjects and the stage if the handler returns false
					//console.log('Stop propagation, handler returned false');
					return false;
				}
			} else {
				//console.log('No handler found for', eventType, 'on', renderObject);
			}
			
			if (isClickEvent) {
				// Stop propagation to other renderObjects if it's a click event
				//console.log('Stop propagation, click event');
				return;
			}
		}
	},
	
	normalizeEvent : function f_Liquid_Stage_normalizeEvent (e) {
		var stage = this;
		
		var eventType = e.type;
		
		// Normalize event type
		if (eventType == 'DOMMouseScroll') {
			eventType = 'mousewheel';
		}
		e.normalizedType = eventType;
		
		// Normalize mousewheel event
		if (eventType == 'mousewheel') {
			if (e.detail) {
				e.delta = - e.detail / 3;
			} else {
				e.delta = - e.wheelDelta / 120;
			}
		}
		
		// Calculate mouse position relative to canvas origin  
		if (!('offsetX' in e)) {
			//console.log('Calculate relative mouse position');
			var canvasPosition = stage.canvasPosition;
			e.offsetX = e.pageX - canvasPosition.x;
			e.offsetY = e.pageY - canvasPosition.y;
		}
	}
	
});