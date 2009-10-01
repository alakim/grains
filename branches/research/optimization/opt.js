var Opt = {};

(function(){
	function extend(o, s){for(var k in s)o[k]=s[k];}
	
	function each(coll, F){
		if(!coll) return;
		for(var i=0; i<coll.length; i++)
			F(coll[i], i);
	}
	
	extend(Opt, {
		version: "2.1.0",
		maxIterations:100,
		
		findMin: function(F, x0, dx0, eps){
			var res = F(x0);
			var x = x0;
			var dx = dx0;
			var d = 0;
			for(var i=0; i<Opt.maxIterations; i++){
				var x1 = x+dx;
				var res1 = F(x1);
				d = Math.abs(res - res1);
				//console.log(i,": ",x, res1, d);
				if(d<eps) break;
				if(res1<res){
					res = res1;
					x = x1;
				}
				else
					dx = dx*-0.5;
			}
			
			//console.log("found in "+i+"steps");
			return {min:x, esp:d, steps:i};
		},
		
		findVectorMin: function(F, v0, dv0, eps){
			var res;
			for(var i=0; i<v0.length; i++){
				var v = v0[i];
				res = findMin(
			}
		},

		geneticoptimize: function(){
			
		}
	});
	
	Opt.scalarIterator = function(x0, dx0, eps){var _=this;
		_.x0 = x0;
		_.dx0 = dx0;
		_.eps = eps;
		_.reset();
	};
	
	Opt.scalarIterator.prototype = {
		x:0,
		dx:0,
		dy:0,
		
		$end:function(){var _=this;
			return Math.abs(_.dy)<_.eps;
		},
		
		reset: function(){var _=this;
			_.x = _.x0;
			_.dx = _.dx0;
		},
		
		compare: function(v0, v1){var _=this;
			_.dy = v1 - v0;
			return _.dy;
		},
		
		next: function(){var _=this;
			if(_.dy>0){
				//console.log("reverse on dy="+_.dy);
				_.dx = _.dx*-0.5;
			}
			_.x+=_.dx;
			return _.x;
		}
	};
	
	Opt.vectorIterator = function(x0, dx0, eps){var _=this;
		_.x0 = x0;
		_.dx0 = dx0;
		_.eps = eps;
		
		_.iterators = [];
		each(x0, function(x, i){
			_.iterators[i] = new Opt.scalarIterator(x, dx0[i]);
		});
		_.reset();
	}
	
	Opt.vectorIterator.prototype = {
		x:0,
		dx:0,
		dy:0,
		
		$end:function(){var _=this;
			var end = true;
			each(this.iterators, function(itr){
				end = end && itr.$end();
			});
			return end;
		},
		
		iterators:[],
		iteratorIdx:0,
		
		reset: function(){var _=this;
			_.x = _.x0;
			_.dx = _.dx0;
			each(_.iterators, function(itr){
				itr.reset();
			});
		},
		
		compare: function(v0, v1){var _=this;
			return _.iterators[_.iteratorIdx].compare(v0, v1);
		},
		
		next: function(){var _=this;
			// ���������������� ����� �� ���� �����������.
			_.iteratorIdx++;
			if(_.iteratorIdx>_.iterators.length-1) _.iteratorIdx = 0;
			
			//console.log("iterator "+_.iteratorIdx+(reverse?" reverse":""));
			_.x[_.iteratorIdx] = _.iterators[_.iteratorIdx].next();
			return _.x;
		},
		
		$val: function(){
			return this.v;
		}
	}
})();