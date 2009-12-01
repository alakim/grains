var Flow = {version:"0.0.0"};

(function(){
	function extend(o,s){for(var k in s)o[k]=s[k];}
	
	var __=Flow;
	
	var instances = [];
	
	extend(__,{
		Continuation: function(name){
			var idx = arguments.callee.caller.blkID;
			var pos = arguments.callee.caller.pos;
			return function(){__.go(idx)};
		},
		
		go:function(blkNr){
			var blk = instances[blkNr];
			if(blk)blk.doNext();
		},
		
		Sequence: function(elements){
			this.elements = elements;
			this.curPos = 0;
			this.id = instances.length;
			instances.push(this);
		},
		
		Parallel: function(elements){
			this.elements = elements;
			this.count = elements.length;
			this.id = instances.length;
			instances.push(this);
		}
	});
	
	__.Sequence.prototype = {
		doNext: function(){var _=this;
			_.curPos++;
			_.run();
		},
		
		run: function(){var _=this;
			var el = _.elements[_.curPos];
			if(!el){
				if(_.blkID) __.go(_.blkID);
				return;
			}
			el.pos = _.curPos;
			el.blkID = _.id;
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
		run: function(){
		}
	};
	
	
}());
