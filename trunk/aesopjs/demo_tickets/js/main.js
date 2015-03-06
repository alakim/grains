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
	
	// $A.classify({}, "Ticket");
	// $A.classify({}, "Ticket");
	// $A.classify({}, "Ticket");
	
	function template(){with($H){
		return div(
			input({type:"button", "class":"btNewTicket", value:"Создать заявку"})
		);
	}}
	
	$(function(){
		var panel = $("#mainView");
		panel.html(template())
			.find(".btNewTicket").click(function(){
				var t1 = Ticket.create();
				var fc = $A.getFacet(t1,  $A.getClass("Ticket")).item();
				fc.view(panel);
			});
	});
	
});