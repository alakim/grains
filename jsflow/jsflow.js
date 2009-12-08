var JSFlow = {version:"2.4.255"};

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
			if(typeof(el)=="function") el = new Action(el);
			if(!el.log) el.log = _.log;
			el.pos = i;
			el.blkID = _.id;
			_.elements.push(el);
		}
		_.init();
		return _;
	}
	
	extend(__,{
		defaultLog:null,
		
		Log: function(){var _=this;
			_.log = [];
		},
		
		Continuation: function(){
			var block = arguments.callee.caller;
			if(block.block) block = block.block;
			var blkID = block.id;
			var pos = block.pos;
			return function(){
				goTo(blkID, pos)
			};
		},
		
		sequence: function(){
			return new Sequence().fill(arguments);
		},
		
		parallel: function(){
			return new Parallel().fill(arguments);
		},
		
		wait: function(delay){
			return new Action(function(){
				var go = new __.Continuation();
				setTimeout(function(){go();}, delay);
			});
		}

	});
		
	function elType(el){
		if(!el) return null;
		return el.blockType?el.blockType
			:typeof(el)=="function"?"Function"
			:"undefined type";
	}
	
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
