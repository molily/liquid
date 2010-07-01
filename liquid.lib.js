if (!Function.prototype.bind) {
	
	Function.prototype.bind = (function f_create_Function_prototype_bind (slice){
		
		// (C) WebReflection - Mit Style License
		// http://webreflection.blogspot.com/2010/02/functionprototypebind.html
		function bind (context) {
			
			var fn = this; // "trapped" function reference
			
			// only if there is more than an argument
			// we are interested into more complex operations
			// this will speed up common bind creation
			// avoiding useless slices over arguments
			if (1 < arguments.length) {
				// extra arguments to send by default
				var $arguments = slice.call(arguments, 1);
				return function f_bound_function () {
					return fn.apply(
						context,
						// thanks @kangax for this suggestion
						arguments.length ?
							// concat arguments with those received
							$arguments.concat(slice.call(arguments)) :
							// send just arguments, no concat, no slice
							$arguments
					);
				};
			}
			// optimized callback
			return function f_bound_function () {
				// speed up when function is called without arguments
				return arguments.length ? fn.apply(context, arguments) : fn.call(context);
			};
		}
		
		// the named function
		return bind;
		
	}(Array.prototype.slice));
	
}

var Liquid = {};

Liquid.Lib = {
	
	extend : function f_Liquid_Lib_extend (destination, source) {
		//console.debug('LiquidLib.extend\ndest: ', destination, '\nsrc: ', source);
		for (var property in source) {
			destination[property] = source[property];
		}
		return destination;
	},
	
	rand : function f_Liquid_Lib_rand (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	
	getUrl : function f_Liquid_Lib_getUrl (url, callback) {
		//console.log('f_Liquid_Lib_getUrl');
		var xhr = Liquid.Lib.xhr = Liquid.Lib.xhr || new XMLHttpRequest;
		xhr.abort();
		xhr.open('GET', url, true);
		xhr.onreadystatechange = function f_Lib_getUrl_readyStateHandler () {
			//console.log('f_Lib_getUrl_readyStateHandler', xhr.readyState);
			if (xhr.readyState == 4) {
				callback.call(xhr, xhr.responseText);
			}
		};
		xhr.send();
	},
	
	getJSON : function f_Liquid_Lib_getJSON (url, callback) {
		//console.log('f_Liquid_Lib_getJSON');
		Liquid.Lib.getUrl(url, f_Liquid_Lib_getJSON_callback);
		
		function f_Liquid_Lib_getJSON_callback (jsonInput) {
			//console.log('f_Liquid_Lib_getJSON_callback');
			var input;
			if (typeof jsonInput == 'string' && jsonInput.length > 0) {
				var JSON = window.JSON;
				if (JSON && JSON.parse) {
					input = JSON.parse(jsonInput);
				} else {
					input = eval('(' + jsonInput + ')');
				}
			} else {
				input = false;
			}
			callback(input);
		}
	},
	
	findPosition : function f_Liquid_Lib_findPosition (el) {
		var pos = {x : 0, y : 0};
		if (el.offsetParent) {
			do {
				pos.x += el.offsetLeft;
				pos.y += el.offsetTop;
			} while (el = el.offsetParent);
		}
		return pos;
	}
	
};