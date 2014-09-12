var NetGraph = (function($, R){
	function calcNodes(nodes){
		initNodes(nodes);
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
	
	function getGraphSize(nodes){
		var size = {x:[1e12, -1e12], y:[1e12, -1e12]};
		for(var k in nodes){
			var nd = nodes[k];
			if(size.x[0]>nd.pos.x) size.x[0] = nd.pos.x;
			if(size.y[0]>nd.pos.y) size.y[0] = nd.pos.y;
			if(size.x[1]<nd.pos.x) size.x[1] = nd.pos.x;
			if(size.y[1]<nd.pos.y) size.y[1] = nd.pos.y;
		}
		size.x = size.x[1]-size.x[0];
		size.y = size.y[1]-size.y[0];
		return size;
	}
	
	function NetGraph(nodes){
		this.nodes = nodes;
		calcNodes(this.nodes);
	}
	
	function drawLinks(node, nodes, paper, ctr, rate){
		for(var i=0,lnk,c=node.links; lnk=c[i],i<c.length; i++){
			var trg = nodes[lnk[0]];
			paper.path(["M",node.pos.x*rate+ctr.x, node.pos.y*rate+ctr.y, "L", trg.pos.x*rate+ctr.x, trg.pos.y*rate+ctr.y]);
		}
	}
	
	NetGraph.prototype.display = function(pnlID){
		var pnl = $("#"+pnlID);
		var width = pnl.width(), height = pnl.height(), margin = 80;
		var paper = R(pnl[0], width, height);
		
		var center = {x:width/2, y:height/2};
		var grSize = getGraphSize(this.nodes);
		var rateX = (width-margin)/grSize.x,
			rateY = (height-margin)/grSize.y,
			rate = Math.min(rateX, rateY);
		
		for(var k in this.nodes){
			var nd = this.nodes[k],
				pos = {x:nd.pos.x*rate+center.x, y:nd.pos.y*rate+center.y};
			
			paper.circle(pos.x, pos.y, 3).attr({fill:"#f00"});
			paper.text(pos.x, pos.y+15, nd.name);
			drawLinks(nd, this.nodes, paper, center, rate);
		}
	};
	
	return NetGraph;
})(jQuery, Raphael);