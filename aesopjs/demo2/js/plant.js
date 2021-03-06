﻿define(["jquery", "html", "raphael", "aesop", "tank", "tube", "valve"], function($, $H, $R, $A, Tank, Tube, Valve){
	
	var width = 800, 
		height = 400;
		
	new $A.Class("ViewedItem",
		function(inst){
			return typeof(inst.view)=="function";
		},
		function(inst){
			this.view = function(cnv){inst.view(cnv);};
		}
	);

	var t1 = new Tank("T1", 25, 50, .8),
		t2 = new Tank("T1", 425, 120, .3),
		v1 = new Valve(120, 120);
		
	$A.classify(t1, "ConnectableItem", {output: 110});
	$A.classify(t2, "ConnectableItem", {input: 175});
	$A.classify(v1, "ConnectableItem", {input: 100, output:50});
	
	var tb1 = new Tube(t1, v1, "output;input"),
		tb2 = new Tube(v1, t2, "output;input");
	
	function build(cnv){
		cnv.rect(0, 0, width, height).attr({fill:"#fffff0", stroke:"#ccc"});
		$A.getClass("ViewedItem").each(function(itm){
			itm.view(cnv);
		});
		cnv.text(15, 15, "There a "+
			$A.getInstancesCount("Tank")+" tanks and "
			+$A.getInstancesCount("Tube")+" tubes and "
			+$A.getInstancesCount("Valve")+" valves "
		).attr({"text-anchor":"start"});
	}
	
	return {
		viewStructure: function(pnl){
			if(typeof(pnl)=="string") pnl = "#"+pnl;
			pnl = $(pnl);
			
			
			build($R(pnl[0], width, height));
		},
		setLevel: function(tankName, level){
			var tankFc = $A.getClass("Tank").find(function(t){
				return t.item().name=="T1";
			});
			
			tankFc.item().level(level);
		}
	};
});