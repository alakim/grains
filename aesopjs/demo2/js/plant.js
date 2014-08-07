define(["jquery", "html", "raphael", "aesop", "tank", "tube"], function($, $H, $R, $A, Tank, Tube){
	
	var width = 800, 
		height = 400;
		
	new $A.Class("ViewedItem", function(inst){
		return typeof(inst.view)=="function";
	});

	var t1 = new Tank("T1", 25, 40, .8),
		t2 = new Tank("T1", 125, 120, .3);
	var tb1 = new Tube(t1, t2, [110, 175]);
	
	
	function build(cnv){
		cnv.rect(0, 0, width, height).attr({fill:"#fffff0", stroke:"#ccc"});
		$A.getClass("ViewedItem").each(function(itm){
			itm.item.view(cnv);
		});
		cnv.text(115, 15, "There a "+$A.getInstancesCount("Tank")+" tanks and "+$A.getInstancesCount("Tube")+" tube");
	}
	
	return {
		view: function(pnl){
			if(typeof(pnl)=="string") pnl = "#"+pnl;
			pnl = $(pnl);
			
			
			build($R(pnl[0], width, height));
		}
	};
});