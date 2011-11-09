if(typeof($)!="function") alert("jquery.js module required!");
if(typeof(FDict)!="function") alert("fdict.js module required!");

var Correlator = (function(){
	function trim(str){
		return str.replace(/^\s+/, "").replace(/\s+$/, "");
	}
	
	function each(coll, F){
		if(coll instanceof Array)
			for(var i=0; i<coll.length; i++){F(coll[i], i);}
		else
			for(var k in coll){F(coll[k], k);}
	}
	
	var _ = {
		getMatrix: function(txt){
			var lines = txt.split("\n");
			var dict = new FDict(lines);
			var res = [];
			each(lines, function(line, y){
				var sim = dict.find(line);
				each(sim, function(sline){
					var x = parseInt(sline.id);
					res.push({
						x:x,
						y:y,
						v:sline.rate,
						d: lines[x]+"<br/>"+lines[y]
					});
				});
			});
			return res;
		}
	};
	return _;
})();