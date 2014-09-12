var NetGraph = (function($, R){
	
	var Vector = {
		length: function(x, y){
			return Math.sqrt(x*x+y*y);
		},
		E: function(x, y){
			var lng = Vector.length(x, y);
			return {x:x/lng, y:y/lng};
		}
	}
	
	function calcNodes(nodes){
		initNodes(nodes);
		var tensSum = 1e12;
		for(var i=0; tensSum>.1&&i<1000; i++){
			tensSum = relax(nodes);
			//if(i%100==0)
			//	console.log(i, tensSum);
		}
		console.log(i+" iterations, actual tension "+Math.round(tensSum*100)/100)
	}
	
	function initNodes(nodes){
		var count = 0;
		for(var k in nodes){count++;}
		var center = {x:0, y:0},
			rad = 100,
			sect = 2*Math.PI/count;
		var i = 0;
		for(var k in nodes){
			var nd = nodes[k];
			nd.pos = {x:center.x+Math.cos(sect*i)*rad, y:center.y+Math.sin(sect*i)*rad};
			i++;
		}
	}
	
	function moveNode(nd, nodes){
		var tensSum = {x:0, y:0};
		for(var i=0,lnk,c=nd.links; lnk=c[i],i<c.length; i++){
			var trg = nodes[lnk[0]],
				v = {x:trg.pos.x - nd.pos.x, y:trg.pos.y - nd.pos.y},
				e = Vector.E(v.x, v.y),
				tension = getTension(nd, lnk, nodes);
			tensSum.x+=e.x*tension;
			tensSum.y+=e.y*tension;
		}
		for(var k in nodes){
			var n1 = nodes[k];
			if(n1===nd) continue;
			var dist = {x:nd.pos.x - n1.pos.x, y:nd.pos.y - n1.pos.y},
				e1 = Vector.E(dist.x, dist.y),
				t1 = Vector.length(dist.x, dist.y);
			t1 = .01/(t1*t1);
			//console.log(t1);
			tensSum.x+=e1.x*t1;
			tensSum.y+=e1.y*t1;
		}
		nd.pos.x+=tensSum.x;
		nd.pos.y+=tensSum.y;
		//console.log(nd.pos.x, nd.pos.y);
		return Vector.length(tensSum.x, tensSum.y);
	}
	
	function relax(nodes){
		var tensSum = 0;
		for(var k in nodes){
			tensSum+=moveNode(nodes[k], nodes);
		}
		return tensSum;
	}
	
	function getGraphSize(nodes){
		var size = {x:[1e12, -1e12], y:[1e12, -1e12]};
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
	
	function NetGraph(nodes){
		this.nodes = nodes;
		calcNodes(this.nodes);
	}
	
	function drawLinks(node, nodes, paper, ctr, rate, grCenter){
		for(var i=0,lnk,c=node.links; lnk=c[i],i<c.length; i++){
			var trg = nodes[lnk[0]];
			var x1 = (node.pos.x - grCenter.x)*rate+ctr.x,
				y1 = (node.pos.y - grCenter.y)*rate+ctr.y,
				x2 = (trg.pos.x - grCenter.x)*rate+ctr.x,
				y2 = (trg.pos.y - grCenter.y)*rate+ctr.y;
			paper.path(["M", x1, y1, "L", x2, y2]);
			paper.text(x1+(x2-x1)/2+5, y1+(y2-y1)/2+5, lnk[1]);
		}
	}
	
	function getTension(node, link, nodes){
		var nLng = link[1],
			trg = nodes[link[0]];
			actLng = Vector.length(node.pos.x - trg.pos.x, node.pos.y - trg.pos.y);
		return (actLng - nLng)/nLng;
	}
	
	NetGraph.prototype.display = function(pnlID){
		var pnl = $("#"+pnlID);
		var width = pnl.width(), height = pnl.height(), margin = 80;
		var paper = R(pnl[0], width, height);
		
		var center = {x:width/2, y:height/2};
		var grSize = getGraphSize(this.nodes);
		var rateX = (width-margin)/grSize.w,
			rateY = (height-margin)/grSize.h,
			rate = Math.min(rateX, rateY);
		
		for(var k in this.nodes){
			var nd = this.nodes[k],
				pos = {x:(nd.pos.x - grSize.center.x)*rate+center.x, y:(nd.pos.y - grSize.center.y)*rate+center.y};
			
			paper.circle(pos.x, pos.y, 3).attr({fill:"#f00"});
			paper.text(pos.x, pos.y+15, nd.name);
			drawLinks(nd, this.nodes, paper, center, rate, grSize.center);
		}
	};
	
	return NetGraph;
})(jQuery, Raphael);