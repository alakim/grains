requirejs.config({
    baseUrl: "js",
    paths: {
		jquery: "../../js/lib/jquery-1.11.0.min",
		html:"../../js/lib/html",
		aesop:"../../js/lib/aesop"
    },
	urlArgs: "bust=" + (new Date()).getTime(),
	shim:{
		"html":{exports:"Html"}
	}
});

requirejs(["jquery", "html", "aesop", "ticket"], function($, $H, $A, Ticket) {
	$("#version").html($H.div("Powered by AesopJS v."+$A.version));
	
	$A.classify({}, "Ticket");
	$A.classify({}, "Ticket");
	$A.classify({}, "Ticket");
	
	function classList(list){with($H){
		return div(
			ol(
				apply(list, function(itm){
					return li(itm.view());
				})
			)
		);
	}}
	
	$(function(){
		$("#mainView").html(classList(
			$A.getClass("Ticket").getAll()
		));
	});
	
});