if(typeof(Html)!="object") alert("Html module required!");

var Correlator = (function(){
	function $(id){return document.getElementById(id);}
	function trim(str){
		return str.replace(/^\s+/, "").replace(/\s+$/, "");
	}
	
	var newUid = (function(){
		var counter = 0;
		return function(){
			return counter++;
		};
	})();
	
	function each(coll, F){
		if(typeof(coll.length)=="number")
			for(var i=0; i<coll.length; i++) F(coll[i], i);
		else
			for(var k in coll) F(coll[k], k);
	}
	
	function displayChart(data){with(Html){
		$(_.outputPanelID).innerHTML = div(
			"Result of analyzing: ", 
			apply(data, function(el){
				return div(
					el.val.length?div("#", el.id, "(", el.count, "): ", el.val)
						:"&nbsp;"
				);
			})
		);
	}}
	
	function buildChartData(inStr){
		var lines = [];
		each(inStr.split("\n"), function(str){
			lines.push(trim(str));
		});
		
		var index = {};
		each(lines, function(line){
			if(typeof(index[line])!="object") index[line] = {count:0, id:newUid(), val:line};
			index[line].count+=1;
		});
		var res = [];
		each(lines, function(line){
			res.push(index[line]);
		});
		return res;
	}
	
	
	var _ = {
		inputFieldID: "taInput",
		outputPanelID: "outPnl",
		start: function(){
			displayChart(
				buildChartData(
					$(_.inputFieldID).value
				)
			);
		}
	};

	return _;
})();