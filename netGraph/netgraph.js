﻿var NetGraph = (function($, R){
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
	
	function NetGraph(nodes){
		this.nodes = nodes;
		calcNodes(this.nodes);
	}
	
	NetGraph.prototype.display = function(pnlID){
		var pnl = $("#"+pnlID);
		var paper = R(pnl[0], pnl.width(), pnl.height());
		
		var center = {x:pnl.width()/2, y:pnl.height()/2};
		
		for(var k in this.nodes){
			var nd = this.nodes[k];
			paper.circle(nd.pos.x+center.x, nd.pos.y+center.y, 3).attr({fill:"#f00"});
		}
	};
	
	return NetGraph;
})(jQuery, Raphael);