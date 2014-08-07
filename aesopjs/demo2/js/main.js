requirejs.config({
    baseUrl: "js",
    paths: {
		jquery: "../../js/lib/jquery-1.11.0.min",
		html:"../../js/lib/html",
		raphael:"../../js/lib/raphael-min",
		aesop:"../../js/lib/aesop"
    },
	urlArgs: "bust=" + (new Date()).getTime(),
	shim:{
		"html":{exports:"Html"},
		"raphael":{exports:"Raphael"}
	}
});

requirejs(["jquery", "html", "aesop", "plant"], function($, $H, $A, plant) {
	$("#version").html($H.div("Powered by AesopJS v."+$A.version));
	
	
	plant.view("out");
});