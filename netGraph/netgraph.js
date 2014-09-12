var NetGraph = (function($, R){
	var defaultSettings = {
		margin:80,
		infinity:1e12,
		maxIterations:1000,
		maxTension:.1,
		nodeSize:5,
		nodeColor:"#f00",
		labelOffset:{x:0, y:15},
		linkLabelOffset:{x:5, y:5},
		initialDistance:100,
		initialPlacement:"circle", // circle, grid
		gravityRate:.005,
		tensionRate:1,
		displayLinks: true,
		displayLinkLabels: true
	};
	
	function extend(obj, s){
		for(var k in s) obj[k] = s[k];
	}
	
	var Vector = {
		length: function(x, y){
			return Math.sqrt(x*x+y*y);
		},
		E: function(x, y){
			var lng = Vector.length(x, y);
			return {x:x/lng, y:y/lng};
		}
	}
	
	function calcNodes(inst){
		var nodes = inst.nodes,
			settings = inst.settings();
		initNodes(inst);
		var tensSum = settings.infinity;
		for(var i=0; tensSum>settings.maxTension&&i<settings.maxIterations; i++){
			tensSum = relax(inst);
		}
		return i+" iterations, final tension "+Math.round(tensSum*100)/100;
	}
	
	function distributeByCircle(inst, count){
		var nodes = inst.nodes,
			settings = inst.settings();
		var center = {x:0, y:0},
			rad = settings.initialDistance,
			sect = 2*Math.PI/count;
		var i = 0;
		for(var k in nodes){
			var nd = nodes[k];
			nd.pos = {
				x:center.x+Math.cos(sect*i)*rad, 
				y:center.y+Math.sin(sect*i)*rad
			};
			i++;
		}
	}
	
	function distributeByGrid(inst){
		var nodes = inst.nodes,
			settings = inst.settings();
		var arr = [];
		for(var k in nodes){arr.push(nodes[k]);}
		var n = Math.ceil(Math.sqrt(arr.length)),
			dist = settings.initialDistance;
		for(var i=0,nd; nd=arr[i],i<arr.length; i++){
			nd.pos = {
				x:(i%n)*dist,
				y:(i/n)*dist
			};
		}
	}
	
	function initNodes(inst){
		var nodes = inst.nodes,
			settings = inst.settings();
		var count = 0;
		for(var k in nodes){
			count++;
			var nd = nodes[k];
			if(!nd.links)nd.links = [];
		}
		switch(settings.initialPlacement){
			case "circle": distributeByCircle(inst, count); break;
			case "grid": distributeByGrid(inst); break;
			default: break;
		}
	}
	
	function moveNode(nd, inst){
		var nodes = inst.nodes,
			settings = inst.settings();
		var tensSum = {x:0, y:0};
		for(var i=0,lnk,c=nd.links; lnk=c[i],i<c.length; i++){
			var trg = nodes[lnk[0]],
				v = {x:trg.pos.x - nd.pos.x, y:trg.pos.y - nd.pos.y},
				e = Vector.E(v.x, v.y),
				tension = getTension(nd, lnk, nodes)*settings.tensionRate;
			tensSum.x+=e.x*tension;
			tensSum.y+=e.y*tension;
		}
		for(var k in nodes){
			var n1 = nodes[k];
			if(n1===nd) continue;
			var dist = {x:nd.pos.x - n1.pos.x, y:nd.pos.y - n1.pos.y},
				e1 = Vector.E(dist.x, dist.y),
				t1 = Vector.length(dist.x, dist.y);
			t1 = settings.gravityRate/(t1*t1);
			tensSum.x+=e1.x*t1;
			tensSum.y+=e1.y*t1;
		}
		nd.pos.x+=tensSum.x;
		nd.pos.y+=tensSum.y;
		return Vector.length(tensSum.x, tensSum.y);
	}
	
	function relax(inst){
		var nodes = inst.nodes;
		var tensSum = 0;
		for(var k in nodes){
			tensSum+=moveNode(nodes[k], inst);
		}
		return tensSum;
	}
	
	function getGraphSize(inst){
		var nodes = inst.nodes,
			settings = inst.settings();
		var size = {x:[settings.infinity, -settings.infinity], y:[settings.infinity, -settings.infinity]};
		for(var k in nodes){
			var nd = nodes[k];
			if(size.x[0]>nd.pos.x) size.x[0] = nd.pos.x;
			if(size.y[0]>nd.pos.y) size.y[0] = nd.pos.y;
			if(size.x[1]<nd.pos.x) size.x[1] = nd.pos.x;
			if(size.y[1]<nd.pos.y) size.y[1] = nd.pos.y;
		}
		size.w = size.x[1]-size.x[0];
		size.h = size.y[1]-size.y[0];
		size.center = {x:size.x[0]+size.w/2, y:size.y[0]+size.h/2};
		return size;
	}
	
	function drawLinks(node, inst, paper, ctr, rate, grCenter){
		var nodes = inst.nodes,
			settings = inst.settings();
		for(var i=0,lnk,c=node.links; lnk=c[i],i<c.length; i++){
			var trg = nodes[lnk[0]];
			var x1 = (node.pos.x - grCenter.x)*rate+ctr.x,
				y1 = (node.pos.y - grCenter.y)*rate+ctr.y,
				x2 = (trg.pos.x - grCenter.x)*rate+ctr.x,
				y2 = (trg.pos.y - grCenter.y)*rate+ctr.y;
			paper.path(["M", x1, y1, "L", x2, y2]).toBack();
			if(settings.displayLinkLabels)
				paper.text(x1+(x2-x1)/2+settings.linkLabelOffset.x, y1+(y2-y1)/2+settings.linkLabelOffset.y, lnk[1]);
		}
	}
	
	function getTension(node, link, nodes){
		var nLng = link[1],
			trg = nodes[link[0]];
			actLng = Vector.length(node.pos.x - trg.pos.x, node.pos.y - trg.pos.y);
		return (actLng - nLng)/nLng;
	}
	
	function NetGraph(nodes){
		this.nodes = nodes;
		var settings = {};
		extend(settings, defaultSettings);
		this.settings = function(s){
			if(!s) return settings;
			extend(settings, s);
		}
	}
	
	NetGraph.prototype.display = function(pnlID, reportPnlID){
		this.report = calcNodes(this);
		
		var settings = this.settings();
		var pnl = $("#"+pnlID);
		var width = pnl.width(), height = pnl.height(), margin = settings.margin;
		var paper = R(pnl[0], width, height);
		
		var center = {x:width/2, y:height/2};
		var grSize = getGraphSize(this);
		var rateX = (width-margin)/grSize.w,
			rateY = (height-margin)/grSize.h,
			rate = Math.min(rateX, rateY);
		
		for(var k in this.nodes){
			var nd = this.nodes[k],
				pos = {x:(nd.pos.x - grSize.center.x)*rate+center.x, y:(nd.pos.y - grSize.center.y)*rate+center.y};
			
			paper.circle(pos.x, pos.y, settings.nodeSize).attr({fill:settings.nodeColor});
			paper.text(pos.x+settings.labelOffset.x, pos.y+settings.labelOffset.y, nd.name);
			if(settings.displayLinks)
				drawLinks(nd, this, paper, center, rate, grSize.center);
		}
		
		var reportPnl = $("#"+reportPnlID);
		if(reportPnl.length) reportPnl.html(this.report);
	};
	
	return NetGraph;
})(jQuery, Raphael);