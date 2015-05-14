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
	var defaultClass = {
		visible: true,
		stroke: "#000"
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
		},
		angle: function(x, y){
			return Math.atan2(y, x);
		},
		toPolar: function(x, y){
			return {
				mod:Vector.length(x, y), 
				angle:Vector.angle(x, y)
			};
		},
		fromPolar: function(mod, angle){
			return {
				x: Math.cos(angle)*mod,
				y: Math.sin(angle)*mod
			};
		},
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
	
	function setIncomingLinks(nodes){
		for(var k in nodes){
			var nd = nodes[k];
			nd.incomingLinks = [];
			for(var m in nodes){
				var nd2 = nodes[m];
				for(var i=0,nn; nn=nd2.links[i],i<nd2.links.length; i++){
					if(nn[0]==nd.name) nd.incomingLinks.push(nd2.name);
				}
			}
		}
	}
	
	function getLevels(nodes){
		function selectRoots(nodes){
			var roots = [], leaves = [];
			for(var k in nodes){
				var nd = nodes[k];
				if(nd.incomingLinks.length==0) roots.push(nd);
				else leaves.push(nd);
			}
			return {selected:roots, reminder:leaves};
		}
		var roots = selectRoots(nodes);
		return [roots.selected, roots.reminder];
	}
	
	function distributeByCircleTree(inst){
		var nodes = inst.nodes,
			dist0 = inst.settings().initialDistance;
			
		setIncomingLinks(nodes);
		var levels = getLevels(nodes);
		
		function distribute(coll, level){
			var n = Math.ceil(Math.sqrt(coll.length)),
				dist = dist0;
			var center = {x:0, y:0},
				rad = dist0*(level*5),
				sect = 2*Math.PI/coll.length;
			for(var i=0,nd; nd=coll[i],i<coll.length; i++){
				nd.pos = {
					x:center.x+Math.cos(sect*i)*rad, 
					y:center.y+Math.sin(sect*i)*rad
				};
			}
		}
		for(var i=0; i<levels.length; i++){
			distribute(levels[i], i+1);
		}
	}
	
	function distributeByTree(inst){
		var nodes = inst.nodes,
			dist0 = inst.settings().initialDistance;
			
		setIncomingLinks(nodes);
		var levels = getLevels(nodes);
		
		function distribute(coll, level){
			var n = Math.ceil(Math.sqrt(coll.length)),
				dist = dist0;
			
			for(var i=0,nd; nd=coll[i],i<coll.length; i++){
				nd.pos = {
					x:i*dist0, 
					y:level*dist0*2
				};
			}
		}
		for(var i=0; i<levels.length; i++){
			distribute(levels[i], i+1);
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
			case "circleTree": distributeByCircleTree(inst); break;
			case "tree": distributeByTree(inst); break;
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
	
	function getClass(nm, inst){
		var classes = inst.classes();
		return classes[nm];
	}
	
	function drawLinks(node, inst, paper, ctr, rate, grCenter){
		var nodes = inst.nodes,
			settings = inst.settings(),
			linkSet = [];
		for(var i=0,lnk,c=node.links; lnk=c[i],i<c.length; i++){
			var cls = getClass(lnk[2], inst);
			if(cls && !cls.visible) continue;
			
			var directed = lnk[3];
			var trg = nodes[lnk[0]];
			var x1 = (node.pos.x - grCenter.x)*rate+ctr.x,
				y1 = (node.pos.y - grCenter.y)*rate+ctr.y,
				x2 = (trg.pos.x - grCenter.x)*rate+ctr.x,
				y2 = (trg.pos.y - grCenter.y)*rate+ctr.y;
			var pth = paper.path(["M", x1, y1, "L", x2, y2]);
			linkSet.push(pth);
			if(cls)pth.attr("stroke", cls.stroke);
			pth.toBack();
			if(settings.displayLinkLabels)
				paper.text(x1+(x2-x1)/2+settings.linkLabelOffset.x, y1+(y2-y1)/2+settings.linkLabelOffset.y, lnk[1]);
			
			if(directed) drawArrow(x1, y1, x2, y2);
		}
			
		function drawArrow(x1, y1, x2, y2){
			var e = Vector.E(x2-x1, y2-y1),
				ndSize = inst.settings().nodeSize,
				offset = ndSize*3,
				arrSize = {
					lng:ndSize*1.5,
					w:ndSize*.5
				},
				arrPos = {tx:x2-e.x*offset, ty:y2-e.y*offset};
				arrPos.bx = arrPos.tx-e.x*arrSize.lng;
				arrPos.by = arrPos.ty-e.y*arrSize.lng;
			var polE = Vector.toPolar(e.x, e.y),
				eNorm = Vector.fromPolar(polE.mod, polE.angle+Math.PI/2);
			var arrow = paper.path([
				"M", arrPos.tx, arrPos.ty, 
				"L", arrPos.bx-eNorm.x*arrSize.w, arrPos.by-eNorm.y*arrSize.w, 
				"L", arrPos.bx+e.x*arrSize.lng*.2, arrPos.by+e.y*arrSize.lng*.2, 
				"L", arrPos.bx+eNorm.x*arrSize.w, arrPos.by+eNorm.y*arrSize.w, 
				"Z"
			]);
			if(cls)arrow.attr({stroke:cls.stroke, fill:cls.stroke});
			else arrow.attr({fill:"#000"})
		}
		
		return linkSet;
	}
	
	function getTension(node, link, nodes){
		var nLng = link[1],
			trg = nodes[link[0]];
			actLng = Vector.length(node.pos.x - trg.pos.x, node.pos.y - trg.pos.y);
		return (actLng - nLng)/nLng;
	}
	
	function NetGraph(nodes, linkBuilder){
		this.nodes = nodes;
		this.linkBuilder = linkBuilder;
		
		var settings = {};
		extend(settings, defaultSettings);
		this.settings = function(s){
			if(!s) return settings;
			extend(settings, s);
		};
		
		var classes = {};
		this.classes = function(ccc){
			if(!ccc) return classes;
			extend(classes, ccc);
			
			for(var k in classes){
				var cc = classes[k];
				var c = {}; 
				extend(c, defaultClass); 
				extend(c, cc);
				classes[k] = c;
			}
		};
		
		if(this.linkBuilder) this.linkBuilder(this.nodes);
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
				cls = getClass(nd["class"], this);
			// console.log(k, cls);
			if(cls && !cls.visible) continue;
			
			var pos = {x:(nd.pos.x - grSize.center.x)*rate+center.x, y:(nd.pos.y - grSize.center.y)*rate+center.y};
			
			var icon = paper.circle(pos.x, pos.y, settings.nodeSize).attr({fill:nd.color||settings.nodeColor});
			paper.text(pos.x+settings.labelOffset.x, pos.y+settings.labelOffset.y, nd.name);
			if(settings.displayLinks)
				icon.grLinks = drawLinks(nd, this, paper, center, rate, grSize.center);
			
			icon.mouseover(function(ev){
				this.attr({fill:"#f00"});
				for(var i=0,lnk,c=this.grLinks; lnk=c[i],i<c.length; i++){
					lnk.attr({stroke:"#f00"});
				}
			}).mouseout(function(ev){
				this.attr({fill:nd.color||settings.nodeColor});
				for(var i=0,lnk,c=this.grLinks; lnk=c[i],i<c.length; i++){
					lnk.attr({stroke:"#000"});
				}
			})
		}
		
		var reportPnl = $("#"+reportPnlID);
		if(reportPnl.length) reportPnl.html(this.report);
	};
	
	return NetGraph;
})(jQuery, Raphael);