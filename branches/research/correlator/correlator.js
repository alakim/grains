if(typeof($)!="function") alert("jquery.js module required!");
if(typeof(FDict)!="function") alert("fdict.js module required!");
FDict.windowSize = 5;

var Correlator = (function(){
	var minLineLength = 3;
	var threshold = 0.5;
	
	function trim(str){
		return str.replace(/^\s+/, "").replace(/\s+$/, "");
	}
	
	function each(coll, F){
		if(coll instanceof Array)
			for(var i=0; i<coll.length; i++){F(coll[i], i);}
		else
			for(var k in coll){F(coll[k], k);}
	}
	
	function differentLength(s1, s2){
		var l1 = s1.length, l2 = s2.length;
		var diff = Math.min(l1, l2) / Math.max(l1, l2);
		return diff<0.6;
	}
	
	function buildLines(txt){
		var lines = txt.split("\n");
		for(var i=0; i<lines.length; i++){
			lines[i] = trim(lines[i]);
		}
		return lines;
	}
	
	var _ = {
		getMatrix: function(txt, txt2){
			var crossCorrelation = txt2!=null;
			
			var lines = buildLines(txt);
			var lines2;
			if(crossCorrelation) lines2 = buildLines(txt2);
			
			var dict = new FDict(lines);
			dict.threshold = threshold;
			var res = [];
			(function(lines1, lines2){
			each(lines2, function(line, y){
				var sim = dict.find(line);
				each(sim, function(sline){
					var x = parseInt(sline.id);
					if((x!=y || crossCorrelation) 
							&& (lines1[x].length>minLineLength && lines2[y].length>minLineLength )
							&& !differentLength(lines1[x], lines2[y])
						){
						res.push({
							x: x,
							y: y,
							v: sline.rate,
							d1: lines1[x],
							d2: lines2[y]
						});
					}
				});
			});
			})(lines, crossCorrelation?lines2:lines);
			return res;
		}
	};
	return _;
})();