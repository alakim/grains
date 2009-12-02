var JSFlow = {version:"1.1.0"};

(function(){
	function extend(o,s){for(var k in s)o[k]=s[k];}
	
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
		if(_.pos==null) return 1;
		var blk = instances[_.blkID];
		return blk.$SeqID()+"."+(_.pos+1);
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
		
		Simple: function(F){var _=this;
			_.elements = [F];
			registerInstance(_);
			F.block = _;
		},
		
		Sequence: function(){var _=this;
			_.elements = [];
			_.curPos = 0;
			registerInstance(_);
			for(var i=0; i<arguments.length; i++){
				var el = arguments[i];
				if(typeof(el)=="function") el = new __.Simple(el);
				if(!el.log) el.log = _.log;
				el.pos = i;
				el.blkID = _.id;
				_.elements.push(el);
			}
		},
		
		Parallel: function(){var _=this;
			_.elements = [];
			registerInstance(_);
			for(var i=0; i<arguments.length; i++){
				var el = arguments[i];
				if(typeof(el)=="function") el = new __.Simple(el);
				if(!el.log) el.log = _.log;
				el.pos = i;
				el.blkID = _.id;
				_.elements.push(el);
			}
			_.count = _.elements.length;
		},
		
		DoWhile: function(){var _=this;
			registerInstance(_);
		},
		
		DoTimes: function(){var _=this;
			registerInstance(_);
		},
		
		Condition: function(){var _=this;
			registerInstance(_);
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
	
	__.Simple.prototype = {
		$SeqID: seqID,
		blockType:"Function",
		
		doNext: function(){var _=this;
			if(_.log) _.log.logEnd(_);
			goTo(_.blkID);
		},
		
		run: function(){var _=this;
			if(_.log)_.log.logBegin(_);
			_.elements[0]();
		}
	},
	
	__.Sequence.prototype = {
		$SeqID: seqID,
		blockType:"Sequence",
		
		doNext: function(){var _=this;
			_.curPos++;
			_.run();
		},
		
		run: function(){var _=this;
			var el = _.elements[_.curPos];
			if(!_.log)_.log = __.defaultLog;
			if(_.log){
				if(_.blkID==null && _.curPos==0) _.log.logBegin(_);
				else if(!el) _.log.logEnd(_);
			}
			if(!el){
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
	
	__.Parallel.prototype = {
		$SeqID: seqID,
		blockType:"Parallel",

		doNext: function(){var _=this;
			_.count--;
			if(!_.count){
				if(_.log) _.log.logEnd(_);
				goTo(_.blkID);
			}
		},
		
		run: function(){var _=this;
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
	
	
}());
