var Opt = {};

(function(){
	function extend(o, s){for(var k in s)o[k]=s[k];}
	
	function each(coll, F){
		if(!coll) return;
		for(var i=0; i<coll.length; i++)
			F(coll[i], i);
	}
	
	extend(Opt, {
		version: "2.0.0",
		maxIterations:100,
		
		findMin: function(F, eps, iterator){
			var res = F(iterator.x);
			var d = 0;
			for(var i=0; i<Opt.maxIterations; i++){
				var x1 = iterator.next(d>0);
				var res1 = F(x1);
				d = res1 - res;
				//console.log(i,": ",iterator.x, res1, iterator.dy);
				if(Math.abs(d)<eps) break;
				res = res1;
			}
			
			//console.log("found in "+i+"steps");
			return {min:x1, esp:d, steps:i};
		}
	});
	
	Opt.scalarIterator = function(x0, dx0){var _=this;
		_.x0 = x0;
		_.dx0 = dx0;
		_.reset();
	};
	
	Opt.scalarIterator.prototype = {
		x:0,
		dx:0,
		
		reset: function(){var _=this;
			_.x = _.x0;
			_.dx = _.dx0;
		},
		
		next: function(reverse){var _=this;
			if(reverse){
				//console.log("reverse");
				_.dx = _.dx*-0.5;
			}
			_.x+=_.dx;
			return _.x;
		}
	};
	
	Opt.vectorIterator = function(v0, dv0){var _=this;
		_.v0 = v0;
		_.dv0 = dv0;
		_.iterators = [];
		each(v0, function(x, i){
			_.iterators[i] = new Opt.scalarIterator(x, dv0[i]);
		});
		_.reset();
	}
	
	Opt.vectorIterator.prototype = {
		v:[],
		dv:[],
		iterators:[],
		iteratorIdx:0,
		
		reset: function(){var _=this;
			_.v = _.v0;
			_.dv = _.dv0;
			each(_.iterators, function(itr){
				itr.reset();
			});
		},
		
		next: function(reverse){var _=this;
			// Последовательный обход по всем координатам.
			// Если включается реверс - возвращаемся по той же координате
			if(!reverse){
				_.iteratorIdx++;
				if(_.iteratorIdx>_.iterators.length-1) _.iteratorIdx = 0;
			}
			_.v[_.iteratorIdx] = _.iterators[_.iteratorIdx].next(reverse);
			return _.v;
		}
	}
})();