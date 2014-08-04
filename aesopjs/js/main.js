requirejs.config({
    baseUrl: "js",
    paths: {
		jquery: "lib/jquery-1.11.0.min",
		html:"lib/html",
		aesop:"lib/aesop"
    },
	urlArgs: "bust=" + (new Date()).getTime(),
	shim:{
		"html":{exports:"Html"}
	}
});

requirejs(["jquery", "html", "aesop", "bugtracker"], function($, $H, $A, BT) {
	$("#version").html($H.div("Powered by AesopJS v."+$A.version));
	BT.viewBugs();
	
	$(".btFix1").click(function(){BT.fixBug(1);});
	$(".btFix2").click(function(){BT.fixBug(2);});
});