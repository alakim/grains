requirejs.config({
    baseUrl: "js",
    paths: {
		jquery: "lib/jquery-1.11.0.min",
		html:"lib/html",
		raphael:"lib/raphael-min"
    },
	urlArgs: "bust=" + (new Date()).getTime(),
	shim:{
		"html":{exports:"Html"},
		"raphael":{exports:"Raphael"}
	}
});

requirejs(["jquery", "html", "plan"], function($, $H, plan) {
	$("#out").css({width:600, height:400, border:"1px solid #8ee", padding:10});
	
	$(".buildingButton").click(function(){
		var nr = $(this).attr("bldNr");
		$("#out").html("");
		plan.view($("#out")[0], nr);
	})
	plan.view($("#out")[0], 1);
});