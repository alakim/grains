var Opt = {};

(function(){
	function extend(o, s){for(var k in s)o[k]=s[k];}
	
	extend(Opt, {
		version: "1.0.0",
		maxIterations:100,
		
		findMin: function(F, iterator){
			var res = F(iterator.x);
			for(var i=0; i<Opt.maxIterations; i++){
				var x1 = iterator.next();
				var res1 = F(x1);
				iterator.compare(res, res1);
				//console.log(i,": ",iterator.x, res1, iterator.dy);
				if(iterator.end) break;
				res = res1;
			}
			
			//console.log("found in "+i+"steps");
			return {min:iterator.x, esp:iterator.dy, steps:i};
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
		end:false,
		
		reset: function(){var _=this;
			_.x = _.x0;
			_.dx = _.dx0;
		},
		
		compare: function(v0, v1){var _=this;
			_.dy = v1 - v0;
			_.end = Math.abs(_.dy)<_.eps;
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
})();