var Opt = {};

(function(){
	function extend(o, s){for(var k in s)o[k]=s[k];}
	
	extend(Opt, {
		version: "1.1.0",
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
			return {min:iterator.x, esp:d, steps:i};
		}
	});
	
	Opt.scalarIterator = function(x0, dx0, eps){var _=this;
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
				//console.log("reverse on dy="+_.dy);
				_.dx = _.dx*-0.5;
			}
			_.x+=_.dx;
			return _.x;
		}
	};
})();