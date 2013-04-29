(function($,R){
	var margin = 3;
	
	function calcLevel(data){
		if(typeof(data)=="number") return {value:data};
		if(data instanceof Array){
			var level = {branches:[]};
			var sum = 0;
			$.each(data, function(i, itm){
				var itemLevel = calcLevel(itm);
				level.branches.push(itemLevel);
				sum+=itemLevel.value;
			});
			level.value = sum;
			return level;
		}
	}
	
	function buildMap(el, data){
		var levels = calcLevel(data);
		console.log(levels);
		var w = el.width(),
			h = el.height();
		var P = R(el[0], w, h);
		//P.rect(margin, margin, w-margin*2, h-margin*2).attr({fill:"#faa", "stroke-width":1, stroke:"#00f"}); 
		drawLevel(P, levels, {x:0, y:0}, {w:w, h:h});
	}
	
	function drawLevel(P, level, pos, size){
		var r = P.rect(
			pos.x+margin, pos.y+margin, 
			size.w-margin*2, size.h-margin*2
		).attr({fill:"#faa", "stroke-width":1, stroke:"#00f"}); 
		console.log(r);
		
		if(!level.branches) return;
		level.branches = level.branches.sort(function(e1, e2){return e1.value>e2.value?-1:e1.value<e2.value?1:0});
		var space = {x:pos.x+margin, y:pos.y+margin, w:size.w-margin*2, h:size.h-margin*2};
		var portraitMode = space.h>space.w;
		$.each(level.branches, function(i, brch){
			drawBranch(P, brch, level.value, space, portraitMode);
		});
	}
	
	function drawBranch(P, branch, totalValue, space, portraitMode){
		var rate = branch.value/totalValue;
		var r;
		var rSpace;
		if(portraitMode){
			var hBr = Math.round(space.h*rate);
			rSpace = {x:space.x, y:space.y, w:space.w, h:hBr};
			space.y = space.y+hBr;
			space.h = space.h - hBr;
		}
		else{
			var wBr = Math.round(space.w*rate);
			rSpace = {x:space.x, y:space.y, w:wBr, h:space.h};
			space.x = space.x+wBr;
			space.w = space.w - wBr;
		}
		r = P.rect(rSpace.x, rSpace.y, rSpace.w, rSpace.h)
			.attr({fill:"#afa", "stroke-width":1, stroke:"#00f", opacity:.4});
		console.log("branches: ", branch.branches);
		if(branch.branches){
			var spc = rSpace;
			console.log("space: ", spc);
			$.each(branch.branches, function(i, brch){
				drawBranch(P, brch, branch.value, spc, spc.h>spc.w);
			});
		}
	}
	
	$.fn.treemap = function(data){
		$(this).each(function(i, el){el=$(el);
			buildMap(el, data);
		});
	};
})(jQuery, Raphael);