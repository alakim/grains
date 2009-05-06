var Opt = {};

(function(){
	function extend(o, s){for(var k in s)o[k]=s[k];}
	
	var _ = Opt;
	
	extend(_, {
		version: "0.0.0",
		
		findMin: function(F, x0, dx0, eps){
			var maxCount = 100;
			var res = F(x0);
			var x = x0;
			var dx = dx0;
			var d = 0;
			for(var i=0; i<maxCount; i++){
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
		}
	});
})();