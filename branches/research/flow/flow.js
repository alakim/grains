var Flow = {version:"0.0.0"};

(function(){
	function extend(o,s){for(var k in s)o[k]=s[k];}
	
	var __=Flow;
	
	var instances = [];
	
	extend(__,{
		//$instIdx: function(){
		//	return instances.length-1;
		//},
		
		Continuation: function(){
			return function(){__.go(instances.length-1)};
		},
		
		go:function(blk){
			var blk = instances[blk];
			//console.log(blk);
			if(blk)blk.doNext();
		},
		
		Sequence: function(elements){
			this.elements = elements;
			this.pos = 0;
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
			_.pos++;
			_.run();
		},
		
		run: function(){var _=this;
			//console.log("run ", _.id);
			var el = _.elements[_.pos];
			if(!el) return;
			el.pos = _.pos;
			function c(){
				if(typeof(el)=="function") el();
				else if(typeof(el.run)=="function") el.run();
				else throw "Element #"+pos+" is not executable.";
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
