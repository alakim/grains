var JSFlow = {version:"2.13.292"};

(function(){
	function extend(o,s){for(var k in s)o[k]=s[k];}
	
	function doNothing(){}
	
	function each(coll, F){
		if(!coll) return;
		if(typeof(coll.length)=="undefined" || typeof(coll.length)!="number")
			for(var k in coll) F(coll[k], k);
		else
			for(var i=0; i<coll.length; i++) F(coll[i], i);
	}
	
	var __=JSFlow;
	
	var instances = [];
	
	function registerInstance(inst){
		inst.id = instances.length;
		instances.push(inst);
	}
	
	function goTo(blkNr){
		var blk = instances[blkNr];
		if(blk)blk.doNext();
	}
	
	function seqID(){var _=this;
		if(_.name) return _.name+"#1";
		if(_.pos==null) return 1;
		var blk = instances[_.blkID];
		return blk.$SeqID()+"."+(_.pos+1);
	}
	
			
	function Action(F){var _=this;
		_.elements = [F];
		registerInstance(_);
		F.block = _;
	}
	
	Action.prototype = {
		$SeqID: seqID,
		blockType:"Function",
		
		doNext: function(){var _=this;
			if(_.log) _.log.logEnd(_);
			if(_.onComplete) _.onComplete();
			goTo(_.blkID);
		},
		
		run: function(continuation){var _=this;
			if(continuation) _.onComplete = continuation;
			if(_.log)_.log.logBegin(_);
			_.elements[0]();
		}
	};

	function Sequence(){var _=this;
		_.elements = [];
		_.curPos = 0;
		registerInstance(_);
	}
		
	Sequence.prototype = {
		$SeqID: seqID,
		blockType:"Sequence",
		
		fill:fill,
		init: function(){this.curPos=0; return this;},
		
		doNext: function(){var _=this;
			_.curPos++;
			_.run();
		},
		
		run: function(continuation){var _=this;
			if(continuation) _.onComplete = continuation;
			
			var el = _.elements[_.curPos];
			if(!_.log)_.log = __.defaultLog;
			if(_.log){
				if(_.curPos==0) _.log.logBegin(_);
				else if(!el){
					_.log.logEnd(_);
				}
			}
			if(!el){
				if(_.onComplete) _.onComplete();
				if(_.blkID) goTo(_.blkID);
				return;
			}
			if(!el.log) el.log = __.defaultLog;
			function c(){
				if(typeof(el)=="function") el();
				else if(typeof(el.run)=="function") el.run();
				else throw "Element #"+_.curPos+" is not executable.";
			}
			c.block = _;
			c();
		}
	};
		
	function Parallel(){var _=this;
		_.elements = [];
		registerInstance(_);
		_.count = _.elements.length;
	}
	
	Parallel.prototype = {
		$SeqID: seqID,
		blockType:"Parallel",
		fill:fill,
		init:function(){var _=this;
			_.count = _.elements.length;
			return _;
		},

		doNext: function(){var _=this;
			_.count--;
			if(!_.count){
				if(_.log) _.log.logEnd(_);
				if(_.onComplete) _.onComplete();
				goTo(_.blkID);
			}
		},
		
		run: function(continuation){var _=this;
			if(continuation) _.onComplete = continuation;
			if(!_.log)_.log = __.defaultLog;
			if(_.log) _.log.logBegin(_);
			
			for(var i=0; i<_.elements.length; i++){
				var el = _.elements[i];
				if(!el.log) el.log = __.defaultLog;
				function c(){
					if(typeof(el)=="function") el();
					else if(typeof(el.run)=="function") el.run();
					else throw "Element #"+i+" is not executable.";
				}
				c.block = _;
				c();
			}
		}
	};
	
	function fill(elements){var _=this;
		_.elements = [];
		for(var i=0; i<elements.length; i++){
			var el = elements[i];
			if(el.constructor==Array){
				_.fill(el);
			}
			else{
				if(typeof(el)=="function") el = new Action(el);
				if(!el.log) el.log = _.log;
				el.pos = i;
				el.blkID = _.id;
				_.elements.push(el);
			}
		}
		_.init();
		return _;
	}
	
	extend(__,{
		defaultLog:null,
		suppressContinuationException:false,
		
		Log: function(){var _=this;
			_.log = [];
		},
		
		Continuation: function(){
			var block = arguments.callee.caller;
			if(block.block) block = block.block;
			var blkID = block.id;
			var pos = block.pos;
			var cont = function(){
				if(arguments.callee.executed){
					if(__.suppressContinuationException)
						return;
					else
						throw "Double continuation from block "+block.$SeqID();						
				}
				arguments.callee.executed = true;
				goTo(blkID, pos)
			};
			cont.block = block;
			return cont;
		},
		
		Mutex: function(){
			this.queue = [];
		},
		
		sequence: function(){
			return new Sequence().fill(arguments);
		},
		
		parallel: function(){
			return new Parallel().fill(arguments);
		},
		
		openMutex: function(mutex){
			return new Action(function(){var go = new __.Continuation();
				if(typeof(mutex)=="string")
					__.Mutex.open(mutex, go);
				else
					mutex.open(go);
			});
		},
		
		releaseMutex: function(mutex){
			return new Action(function(){var go = new __.Continuation();
				if(typeof(mutex)=="string")
					__.Mutex.release(mutex);
				else
					mutex.release();
				go();
			});
		},
		
		wait: function(delay){
			return new Action(function(){
				var go = new __.Continuation();
				setTimeout(function(){go();}, delay);
			});
		},
		
		waitFor: function(condition, pollingTime, maxCount, errorHandlingSequence){
			pollingTime = pollingTime||100;
			maxCount = maxCount || 100;
			
			return new Action(function(){
				var go = new __.Continuation();
				var counter = 0;
				function check(){
					if(condition()) go();
					else if(counter>maxCount){
						if(!errorHandlingSequence) throw "Waiting error: Too much checking attempts in block "+go.block.$SeqID();
						else{
							errorHandlingSequence.onComplete = go;
							errorHandlingSequence.run();
						}
					}
					else{
						counter++;
						setTimeout(check, pollingTime);
					}
				}
				check();
			});
		},
		
		times: function(count, delay, iteration){
			return new Action(function(){
				var go = new __.Continuation();
				var i = 0;
				(function loop(){
					iteration(i++);
					__.wait(delay).run(i<count?loop:go);
				})();
			});
		}

	});
		
	function elType(el){
		if(!el) return null;
		return el.blockType?el.blockType
			:typeof(el)=="function"?"Function"
			:"undefined type";
	}
	
	extend(__.Mutex, {
		instances:{},
		
		get: function(mutexName){
			var mutex = __.Mutex.instances[mutexName];
			if(!mutex){
				mutex = new __.Mutex();
				__.Mutex.instances[mutexName] = mutex;
			}
			return mutex;
		},
		
		open: function(mutexName, go){
			__.Mutex.get(mutexName).open(go);
		},
		
		release: function(mutexName){
			__.Mutex.get(mutexName).release();
		}
	});
	
	__.Mutex.prototype = {
		open: function(cont){var _=this;
			var busy = _.queue.length>0;
			_.queue.push(cont);
			if(!busy) cont();
		},
		
		release: function(){var _=this;
			_.queue = _.queue.splice(1, _.queue.length-1);
			var nxt = _.queue[0];
			if(nxt) nxt();
		}
	};
	
	__.Log.prototype = {
		connect: function(el){var _=this;
			el.log = _;
			each(el.elements, function(chld){_.connect(chld);});
		},
		
		logBegin: function(el){
			this.log.push(elType(el)+" "+el.$SeqID()+" begins");
		},
		
		logEnd: function(el){
			this.log.push(elType(el)+" "+el.$SeqID()+" ended");
		},
		
		write: function(){
			var msg = [];
			each(arguments, function(arg){msg.push(arg);});
			this.log.push(msg.join(""));
		}
	};

	
}());
