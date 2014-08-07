define(["jquery", "html", "raphael", "aesop", "tank"], function($, $H, $R, $A, Tank){
	
	var width = 800, 
		height = 400;
		

	new Tank("T1", 25, 40, .7),
	new Tank("T1", 125, 120, .3)
	
	function build(cnv){
		cnv.rect(0, 0, width, height).attr({fill:"#fffff0", stroke:"#ccc"});
		$A.getClass("Tank").each(function(t){
			t.item.view(cnv);
		});
		cnv.text(55, 15, "There a "+$A.getInstancesCount("Tank")+" tanks");
	}
	
	return {
		view: function(pnl){
			if(typeof(pnl)=="string") pnl = "#"+pnl;
			pnl = $(pnl);
			
			
			build($R(pnl[0], width, height));
		}
	};
});