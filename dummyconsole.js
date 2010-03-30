(function dummyconsole (global) {
	
	if (!global.console) {
		global.console = {};
	}
	var console = global.console;
	
	var emptyFunc = new Function;
	var postError = (window.opera && window.opera.postError) || emptyFunc;
	
	var timingName = null;
	var startTime;
	
	if (!console.log) {
		console.log = postError;
	}
	
	if (!console.debug) {
		console.debug = postError;
	}
	
	if (!console.time && !console.timeEnd) {
		console.time = startTiming;
		console.timeEnd = stopTiming;
	}
	
	if (!console.profile && !console.profileEnd) {
		console.profile = startTiming;
		console.profileEnd = stopTiming;
	}
	
	function startTiming (name) {
		startTime = new Date;
		timingName = name ? name : null;
	}
	
	function stopTiming () {
		postError((timingName ? timingName + ': ' : ' ') + (new Date - startTime) + 'ms');
	}
	
})(this);

