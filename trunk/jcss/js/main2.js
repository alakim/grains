requirejs.config({
    baseUrl: "js",
    paths: {
		jquery: "lib/jquery-1.11.0.min"
    },
	urlArgs: "bust=" + (new Date()).getTime()
});

requirejs(["jquery", "jcss"], function($, JCSS) {

	function getSkinID(){
		return document.location.hash.slice(1);
	}
	
	function setSkin(){
		var skinID = $(this).attr("href").split("#")[1];
		styles1(skinID);
	}
	
	function styles1(skinID){with(JCSS){
		// if($("#styles1").length) return; // Если эта таблица уже создана, не создавать ее заново
		
		$("#styles").remove();
		
		skinID = skinID || getSkinID();
		//alert(skinID);
		
		var sampleWidth = 500,
			lnkColor = "#600";
		
		var dscColor = "#f00";
		switch(skinID){
			case "skin1": dscColor = "#0f0"; break;
			case "skin2": dscColor = "#00f"; break;
			default: dscColor = "#f00"; break;
			
		}
		
		var css = stylesheet([
			"body{font-family:Verdana, Arial, Sans-Serif;}",
			rule("h1", color("#068")),
			".version{color:#ccc;}",
			rule(".description", [
				font("Times New Roman Cyr, Serif", 18),
				width(sampleWidth),
				borderL("3px solid "+dscColor),
				marginL(10),
				paddingL("5px"),
				"text-align:justify",
				italic()
			]),
			rule(".sample", [
				border("1px solid #ccc"),
				marginR(10),
				padding(3),
				width(sampleWidth+40),
				height(800),
				"float:left"
			]),
			rule("div.button", [
				width(100), height(50),
				margin(10), marginL(80),
				border("3px solid #044"),
				bColor("#0aa"),
				pointer()
			]),
			rule("a:link", [color(lnkColor), underline(false)]),
			rule("a:visited", [color(lnkColor), underline(false)]),
			rule("a:hover", [color(lnkColor), underline()]),
			rule("#container", [bColor("#eee"), border("1px solid #ccc"), padding(3)]),
			inside("#container", [
				rule("p", indent(15)),
				rule("li", italic())
			]),
			rule("span.code", font("Courier New, Monospace"))
		]);
		$(css).attr({id:"styles1"});
		return css;
	}}
	
	function styles2(){with(JCSS){
		if($("#styles2").length) return;
		var css = cssRef("styles2.css");
		$(css).attr({id:"styles2"});
	}}

	function init(){
		$(".version").html("Powered by JCSS v."+JCSS.version);
		styles1();
		styles2();
		
		$(".skinSelector a").click(setSkin);

	}
	
	$(init);
});