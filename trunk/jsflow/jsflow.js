var JSFlow = {version:"1.0.0"};

(function(){
	function extend(o,s){for(var k in s)o[k]=s[k];}
	
	function each(coll, F){
		if(typeof(coll.length)=="undefined" || typeof(coll.length)!="number")
			for(var k in coll) F(coll[k], k);
		else
			for(var i=0; i<coll.length; i++) F(coll[i], i);
	}
	
	var __=JSFlow;
	
	var instances = [];
	
	function goTo(blkNr){
		var blk = instances[blkNr];
		if(blk)blk.doNext();
	}
	
	function seqID(){var _=this;
		if(_.pos==null) return 1;
		var blk = instances[_.blkID];
		return blk.$SeqID()+"."+_.pos;
	}
	
	extend(__,{
		defaultLog:null,
		
		Log: function(){var _=this;
			_.log = [];
		},
		
		Continuation: function(){
			var idx = arguments.callee.caller.blkID;
			return function(){
				goTo(idx)
			};
		},
		
		Sequence: function(){var _=this;
			_.elements = [];
			_.curPos = 0;
			_.id = instances.length;
			instances.push(_);
			for(var i=0; i<arguments.length; i++){
				var el = arguments[i];
				if(!el.log) el.log = _.log;
				el.pos = i;
				el.blkID = _.id;
				if(typeof(el)=="function") el.$SeqID = seqID;
				_.elements.push(el);
			}
		},
		
		Parallel: function(){var _=this;
			_.elements = [];
			_.id = instances.length;
			instances.push(_);
			for(var i=0; i<arguments.length; i++){
				var el = arguments[i];
				if(!el.log) el.log = _.log;
				el.pos = i;
				el.blkID = _.id;
				if(typeof(el)=="function") el.$SeqID = seqID;
				_.elements.push(el);
			}
			_.count = _.elements.length;
		},
		
		DoWhile: function(){
		},
		
		DoTimes: function(){
		},
		
		Condition: function(){
		}
	});
		
	function elType(el){
		if(!el) return null;
		return el.blockType?el.blockType
			:typeof(el)=="function"?"Function"
			:"undefined type";
	}
	
	__.Log.prototype = {
		logBegin: function(el, pos){
			var id = el.$SeqID() + (pos!=null?"."+pos:"");
			var eType = pos!=null?elType(el.elements[pos]): elType(el);
			if(eType) this.log.push(eType+" "+id+" begins");
		},
		
		logEnd: function(el, pos){
			var id = el.$SeqID() + (pos!=null?"."+pos:"");
			var eType = pos!=null?elType(el.elements[pos]): elType(el);
			if(eType) this.log.push(eType+" "+id+" ended");
		},
		
		write: function(){
			var msg = [];
			each(arguments, function(arg){msg.push(arg);});
			this.log.push(msg.join(""));
		}
	};
	
	__.Sequence.prototype = {
		$SeqID: seqID,
		blockType:"Sequence",
		
		doNext: function(){var _=this;
			if(_.log){
				var pos = arguments.callee.caller.caller.caller.pos;
				_.log.logEnd(_, pos);
			}
			_.curPos++;
			_.run();
		},
		
		run: function(){var _=this;
			var el = _.elements[_.curPos];
			if(!_.log)_.log = __.defaultLog;
			if(_.log){
				if(_.blkID==null && _.curPos==0) _.log.logBegin(_);
				else if(!el) _.log.logEnd(_);
				_.log.logBegin(_, _.curPos);
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
			if(_.log){
				var pos = arguments.callee.caller.caller.caller.pos;
				_.log.logEnd(_, pos);
			}
			_.count--;
			if(!_.count){
				if(_.log) _.log.logEnd(_);
				goTo(_.blkID);
			}
		},
		
		run: function(){var _=this;
			if(!_.log)_.log = __.defaultLog;
			if(_.log && _.blkID==null){
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
