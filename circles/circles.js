(function($,$R,$D){
	var settings = {
		size: 200,
		margin:3
	};
	
	var scale = {};
	$D("c;cis,des;d;dis,es;e;f;fis,ges;g;gis,as;a;ais,bes;b".split(";")).each(function(x, i){
		$D(x.split(",")).each(function(s){scale[s] = i});
	});
	
	var names = [];
	$D(scale).each(function(nr, nm){
		if(names.length==nr) names.push(nm);
	});
	
	function init(pnl, code, title){
		var paper = $R(pnl[0], settings.size, settings.size);
		var size = settings.size - settings.margin*2,
			diameter = size*.7,
			center = settings.size/2,
			origin = {x:center, y:center - diameter/2},
			alpha = 360/12;
		//paper.rect(settings.margin, settings.margin, size, size).attr({stroke:"#ccc", fill:"#fff"});
		paper.circle(center, center, diameter/2).attr({stroke:"#888"});
		
		paper.text(center, center, title).attr({"font-size":22});
		
		for(var i=0; i<12; i++){
			// if(i) paper.path(["M", origin.x, origin.y - 3, "L", origin.x, origin.y+3]).attr({fill:"#000"}).transform(["R", alpha*i, center, center]);
			// else paper.circle(origin.x, origin.y, 6).attr({fill:"#fff", stroke:"#000", "stroke-width":3});
			paper.path(["M", origin.x, origin.y - 3, "L", origin.x, origin.y+3]).attr({fill:"#000"}).transform(["R", alpha*i, center, center]);
			if(names[i].length==1){
				var pos = {x:origin.x, y:origin.y-size*.083};
				paper.text(pos.x, pos.y, names[i].toUpperCase()).attr({"font-size":18}).transform(["R", -alpha*i, pos.x, pos.y, "R", alpha*i, center, center]);
			}
		}
		$D(code.split(";")).each(function(tone, i){
			tone = tone.split("@");
			var tonePos = scale[tone[0]];
			if(tone[1]=="root") paper.circle(origin.x, origin.y, 6).attr({fill:"#fff", stroke:"#000", "stroke-width":3}).transform(["R", alpha*tonePos, center, center]);
			else paper.circle(origin.x, origin.y, 4).attr({fill:"#000"}).transform(["R", alpha*tonePos, center, center]);
		});
	}
	
	$.fn.circle = function(){
		$(this).each(function(i,el){el=$(el);
			var code = el.html();
			el.html("");
			code = code.split(":");
			init(el, code[1], code[0]);
		});
	};
	
})(jQuery, Raphael, JDB);
