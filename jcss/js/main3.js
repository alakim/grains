﻿requirejs.config({
    baseUrl: "js",
    paths: {
		jquery: "lib/jquery-1.11.0.min"
    },
	urlArgs: "bust=" + (new Date()).getTime()
});

requirejs(["jquery", "jcss"], function($, JCSS) {

	
	function styles1(){with(JCSS){
		// if($("#styles1").length) return; // Если эта таблица уже создана, не создавать ее заново
		
		$("#styles").remove();
		
		
		var sampleWidth = 500,
			lnkColor = "#600";
		
		var dscColor = "#f00";
		
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
	

	function init(){
		$(".version").html("Powered by JCSS v."+JCSS.version);
		styles1();
		
	}
	
	$(init);
});