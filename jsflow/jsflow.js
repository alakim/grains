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
		
	__.Log.prototype = {
		logBegin: function(blkID){
			this.log.push(blkID+" begins");
		},
		
		logEnd: function(blkID){
			this.log.push(blkID+" ended");
		},
		
		write: function(){
			var msg = [];
			each(arguments, function(arg){msg.push(arg);});
			this.log.push(msg.join(""));
		}
	};
	
	__.Sequence.prototype = {
		doNext: function(){var _=this;
			_.curPos++;
			if(_.log) _.log.write("do next ", _.curPos);
			_.run();
		},
		
		run: function(){var _=this;
			var el = _.elements[_.curPos];
			if(!_.log)_.log = __.defaultLog;
			if(_.log){
				if(_.curPos==0) _.log.logBegin(_.id);
				else if(!el) _.log.logEnd(_.id);
				else _.log.write("sequece at pos ", _.curPos);
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
		doNext: function(){var _=this;
			_.count--;
			if(!_.count){
				if(_.log) _.log.logEnd(_.id);
				goTo(_.blkID);
			}
		},
		
		run: function(){var _=this;
			if(!_.log)_.log = __.defaultLog;
			if(_.log) _.log.logBegin(_.id);
			for(var i=0; i<_.elements.length; i++){
				var el = _.elements[i];
				if(!el.log) el.log = __.defaultLog;
				function c(){
					if(typeof(el)=="function") el();
					else if(typeof(el.run)=="function") el.run();
					else throw "Element #"+_.curPos+" is not executable.";
				}
				c.block = _;
				c();
			}
		}
	};
	
	
}());
