(function($,$R,$D){
	var defaultSettings = {
		fifthMode: false,
		size: 200,
		margin: 3,
		drawGroups: false,
		drawSigns: false
	};
	
	var settings = {};
	$D.extend(settings, defaultSettings);
	
	function noteName(note){
		note = note.replace(/([a-g])e?s$/, "$1b");
		return note.substr(0, 1).toUpperCase() + note.substr(1).toLowerCase();
	}
	
	function init(pnl, code, title){
		var scale = {};
		$D((settings.fifthMode?settings.drawSigns=="minor"?"c;g;d;a;e;b;fis;cis;gis;es;bes;f":"c;g;d;a;e;b;ges,fis;des,cis;as,gis;es,dis;bes,ais;f"
				:"c;cis,des;d;dis,es;e;f;fis,ges;g;gis,as;a;ais,bes;b"
			).split(";")).each(function(x, i){
			$D(x.split(",")).each(function(s){scale[s] = i});
		});
		
		var names = [];
		$D(scale).each(function(nr, nm){
			if(names.length==nr) names.push(nm);
		});
		
		var paper = $R(pnl[0], settings.size, settings.size);
		var size = settings.size - settings.margin*2,
			diameter = size*.7,
			center = settings.size/2,
			origin = {x:center, y:center - diameter/2},
			alpha = 360/12;
		//paper.rect(settings.margin, settings.margin, size, size).attr({stroke:"#ccc", fill:"#fff"});
		paper.circle(center, center, diameter/2).attr({stroke:"#888"});
		
		paper.text(center, center, title.replace(/([A-G])b/g, "$1♭").replace("#", "♯")).attr({"font-size":22});
		
		
		colorGroups = {};
		var toneNames = {};
		
		$D(code.split(";")).each(function(tone, i){
			if(!tone.length) return;
			tone = tone.split("@");
			var tonePos = scale[tone[0]],
				command = tone[1]?tone[1].split("#"):[],
				type = command[0],
				color = "#"+(command[1]||"000");
			//console.log(tone, command, type, color);
			toneNames[tonePos] = tone[0];
			var point;
			if(type=="root") point = paper.circle(origin.x, origin.y, 6).attr({fill:"#fff", stroke:color, "stroke-width":3}).transform(["R", alpha*tonePos, center, center]);
			else point = paper.circle(origin.x, origin.y, 4).attr({fill:color}).transform(["R", alpha*tonePos, center, center]);
			
			if(!colorGroups[color]) colorGroups[color] = [];
			colorGroups[color].push(point);
		});
		//console.log("toneNames:", toneNames);
		
		var pos = {x:origin.x, y:origin.y + size*(settings.drawSigns?.08:-.083)};
		for(var i=0; i<12; i++){
			paper.path(["M", origin.x, origin.y - 3, "L", origin.x, origin.y+3]).attr({fill:"#000"}).transform(["R", alpha*i, center, center]);
			if(settings.fifthMode){
				var nm = noteName(names[i]).replace(/([A-G])b/g, "$1♭").replace(/([A-G])is/, "$1♯");
				paper.text(pos.x, pos.y, nm).attr({"font-size":settings.drawSigns?14:18}).transform(["R", -alpha*i, pos.x, pos.y, "R", alpha*i, center, center]);			
			}
			else if (toneNames[i]){
				var nm = noteName(toneNames[i] || names[i]).replace(/([A-G])(e?s)|(b)/g, "$1♭").replace(/([A-G])is/g, "$1♯");
				paper.text(pos.x, pos.y, nm).attr({"font-size":18}).transform(["R", -alpha*i, pos.x, pos.y, "R", alpha*i, center, center]);
			}
			else
				paper.text(pos.x, pos.y, noteName(names[i]).replace(/([A-G])e?s/g, "$1♭").replace(/([A-G])is/g, "$1♯")).attr({"font-size":10, opacity:.6}).transform(["R", -alpha*i, pos.x, pos.y, "R", alpha*i, center, center]);
			
		}

		
		// var colors = $D(colorGroups).toArray(function(g, clr){return clr;}).raw();
		// console.log(colors);
		if(settings.drawGroups){
			$D(colorGroups).each(function(grp, clr){
				var path = ["M"];
				$D(grp).each(function(nd, i){
					if(i) path.push("L");
					var bbox = nd.getBBox();
					path.push(bbox.cx);
					path.push(bbox.cy);
				});
				path.push("Z");
				paper.path(path).attr({fill:clr, "stroke-width":0, opacity:.3});
				paper.path(path).attr({fill:null, "stroke-width":1, stroke:clr, opacity:1});
			});
		}
		
		if(settings.drawSigns){
			var pos = {x:origin.x, y:origin.y + size*(settings.drawSigns=="minor"?-.10:-.08)};
			for(var i=0; i<12; i++){
				var n, s;
				
				if(i<6){n=i; s="♯";}
				else if(i<11) {n=12-i; s="♭";}
				else {n=1; s="♭";}
				
				var beta = settings.drawSigns=="minor"?alpha*(i+3):alpha*i;
				
				for(var j=0; j<n; j++)
					paper.text(pos.x - 8 + j*5, pos.y + (s=="♯"?[0,5]:[5,0])[j%2], s).attr({"font-size":14}).transform(["R", -beta, pos.x, pos.y, "R", beta, center, center]);
			}
		}
	}
	
	$.fn.circle = function(code){
		$(this).each(function(i,el){el=$(el);
			$D.extend(settings = {}, defaultSettings);
			code = code.split("!");
			if(code.length>1){
				$D.extend(settings, $.parseJSON(code[0]), true);
				code = code[1];
			}
			else code = code[0];
			code = code.split(":");
			init(el, code.length>1?code[1]:code[0], code.length>1?code[0]:"");
		});
	};
	
})(jQuery, Raphael, JDB);
