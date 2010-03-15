Liquid.Workers = {
	
	supported : !!(window.Worker && window.JSON && JSON.stringify && JSON.parse),
	
	all : [],
	idle : {},
	jobs : [],
	
	spawn : function f_Liquid_Workers_spawn (job) {
		//console.log('f_Liquid_Workers_spawn', job.workerNumber, 'x ', job.scriptUrl);
		
		var liquidWorkers = this;
		var idleWorkers = [];
		
		for (var i = 0, l = job.workerNumber; i < l; i++) {
			
			// Spawn new worker
			var worker = new Worker(job.scriptUrl);
			worker.onerror = liquidWorkers.workerError;
			
			// Save the worker
			idleWorkers.push(worker);
			liquidWorkers.all.push(worker);
		}
		
		liquidWorkers.idle[job.scriptUrl] = idleWorkers;
		
		return idleWorkers;
	},
	
	workerError : function f_Liquid_Workers_workerError (e) {
		console.log('Error in worker', e.filename, ':', e.message, 'in line', e.lineno);
	},
	
	createJob : function f_Liquid_Workers_createJob (job) {
		//console.log('f_Liquid_Workers_createJob', job);
		var liquidWorkers = this;
		if (!liquidWorkers.supported) {
			return false;
		}
		liquidWorkers.jobs.push(job);
		liquidWorkers.allocateJobs();
		return true;
	},
	
	allocateJobs : function f_Liquid_Workers_allocateJobs () {
		var liquidWorkers = this;
		var jobs = liquidWorkers.jobs;
		
		//console.log('f_Liquid_Workers_allocateJobs', jobs.length, 'open');
		
		for (var i = 0, job; job = jobs[i]; i++) {
			//console.log('job', i, job);
			
			// Get idle workers for script
			var idleWorkers = liquidWorkers.idle[job.scriptUrl];
			
			// Spawn workers if necessary
			if (!idleWorkers) {
				idleWorkers = liquidWorkers.spawn(job);
			} else if (!idleWorkers.length) {
				//console.log('No idle workers for', job.scriptUrl);
				continue;
			}
			
			// Get an idle worker
			var worker = idleWorkers.shift();
			
			// Assign job
			//console.log('Assign job', job, 'to', worker);
			worker.onmessage = liquidWorkers.finishJob.bind(liquidWorkers, job);
			worker.postMessage(job.message);
			
			// Remove job from queue
			jobs.splice(i, 1);
			i--;
		}
		
	},
	
	finishJob : function f_Liquid_Workers_finishJob (job, e) {
		//console.log('f_Liquid_Workers_finishJob', job);
		
		var liquidWorkers = this;
		
		// Fire callback passing the message from worker
		job.callback(e.data, e);
		
		// Add worker to idle workers
		var worker = e.target;
		liquidWorkers.idle[job.scriptUrl].push(worker);
		
		// Re-use the idle worker
		liquidWorkers.allocateJobs();
	}
	
};