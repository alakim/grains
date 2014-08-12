define(["jquery", "html", "raphael", "jspath", "aesop"], function($, $H, $R, $JP, $A){
	
	function Tube(src, dest, ports){
		this.src = src;
		this.dest = dest;
		this.ports = typeof(ports)=="string"?ports.split(";"):ports;
		$A.getFacet(src, "ConnectableItem").connect(this.ports[0], this);
		$A.getFacet(dest, "ConnectableItem").connect(this.ports[1], this);
		$A.classify(this);
		$A.classify(src);
		$A.classify(dest);
	}
	
	new $A.Class("Tube", function(inst){
		return inst.constructor == Tube;
	});
	
	new $A.Class("ConnectableItem", null, function(inst, ports){var _=this;
		_.ports = {};
		for(var id in ports){
			_.ports[id] = {
				pos:ports[id],
				tubes:[]
			}
		}
		_.connect = function(port, tube){
			_.ports[port].tubes.push(tube);
		};
	});
	
	
	$.extend(Tube.prototype, {
		view: function(cnv){var _=this;
			var srcCon = $A.getFacet(_.src, "ConnectableItem"),
				destCon = $A.getFacet(_.dest, "ConnectableItem");
			if(!srcCon) alert(_.src.name+" is not connectable item");
			if(!destCon) alert(_.dest.name+" is not connectable item");
			var srcPort = srcCon.ports[_.ports[0]].pos,
				destPort = destCon.ports[_.ports[1]].pos;
			var port1 = $R.getPointAtLength(_.src.perimeter(), srcPort);
			var port2 = $R.getPointAtLength(_.dest.perimeter(), destPort);
			var path = ["M", port1.x, port1.y];
			path = path.concat([
				"L", port1.x+(port2.x-port1.x)/2, port1.y,
				"L", port1.x+(port2.x-port1.x)/2, port2.y
			]);
			path = path.concat(["L", port2.x, port2.y]);
			cnv.path(path).attr({"stroke-width":3, stroke:"#008"});
		}
	});
	
	return Tube;
});