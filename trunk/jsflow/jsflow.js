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
	
	function goTo(blkNr, fromPos){
		var blk = instances[blkNr];
		console.log("goto ", blkNr, ",", fromPos);
		console.log("goto blk type: ", blk.blockType);
		if(blk)blk.doNext(fromPos);
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
			console.log("Continuation constructor: blockType ", block.blockType);
			var blkID = block.id;
			//var blkID = block.blkID;
			var pos = block.pos;
			console.log("Continuation constructor: ", blkID, ", ",pos);
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
		
		logBegin: function(el, pos){
			var id = el.$SeqID() + (pos!=null?"."+(pos+1):"");
			var eType = pos!=null?elType(el.elements[pos]): elType(el);
			if(eType) this.log.push(eType+" "+id+" begins");
		},
		
		logEnd: function(el, pos){
			var id = el.$SeqID() + (pos!=null?"."+(pos+1):"");
			var eType = pos!=null?elType(el.elements[pos]): elType(el);
			if(eType) this.log.push(eType+" "+id+" ended");
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
		
		doNext: function(fromPos){var _=this;
			console.log("Simple.doNext: ", fromPos);
			if(_.log){
				_.log.logEnd(_, fromPos);
			}
			goTo(_.blkID, fromPos);
		},
		
		run: function(){var _=this;
			console.log("Simple run ", _.$SeqID());
			if(_.log)_.log.logBegin(_);
			_.elements[0]();
		}
	},
	
	__.Sequence.prototype = {
		$SeqID: seqID,
		blockType:"Sequence",
		
		doNext: function(fromPos){var _=this;
			console.log("Sequence.doNext: ", fromPos);
			// if(_.log){
			// 	_.log.logEnd(_, fromPos);
			// }
			_.curPos++;
			_.run();
		},
		
		run: function(){var _=this;
			var el = _.elements[_.curPos];
			if(!_.log)_.log = __.defaultLog;
			if(_.log){
				if(_.blkID==null && _.curPos==0) _.log.logBegin(_);
				else if(!el) _.log.logEnd(_);
				//_.log.logBegin(_, _.curPos);
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

		doNext: function(fromPos){var _=this;
			console.log("Parallel.doNext: ", fromPos);
			// if(_.log){
			// 	//var pos = arguments.callee.caller.caller.caller.pos;
			// 	//console.log("pos: ", pos);
			// 	//_.log.logEnd(_, pos);
			// 	_.log.logEnd(_, fromPos);
			// }
			_.count--;
			if(!_.count){
				goTo(_.blkID);
				if(_.log) _.log.logEnd(_);
			}
		},
		
		run: function(){var _=this;
			if(!_.log)_.log = __.defaultLog;
			if(_.log){
				_.log.logBegin(_);
			}
			for(var i=0; i<_.elements.length; i++){
				var el = _.elements[i];
				if(!el.log) el.log = __.defaultLog;
				function c(){
					if(typeof(el)=="function") el();
					else if(typeof(el.run)=="function") el.run();
					else throw "Element #"+i+" is not executable.";
				}
				c.block = _;
				if(_.log) _.log.logBegin(_, i);
				c();
			}
		}
	};
	
	
}());
