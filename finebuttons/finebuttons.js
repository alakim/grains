(function($){
	
	document.write([
		"<style type='text/css'>",
			"a.finebutton {",
			"	after: ' ';",
			"	before: ' ';",
			"	background: url(img/btn_m_bg.png) repeat-x scroll 0 0 transparent;",
			"	display: inline-block;",
			"	height: 43px;",
			"	margin: 0 41px;",
			"	min-width: 5px;",
			"	position: relative;",
			"	text-decoration: none;",
			"	vertical-align: middle;",
			"}",
			
			"a.finebutton p {",
			"	color: white;",
			"	font-family: Arial, Tahoma, Sans-serif;",
			"	font-size: 14px;",
			"	font-weight: bold;",
			"	margin: 0 -20px;",
			"	position: relative;",
			"	text-align: center;",
			"	text-shadow: 1px 1px #FE832E, -1px 1px #FE832D, 0 -1px #FE9F4F;",
			"	top: 9px;",
			"	z-index: +1;",
			"}",
			
			"a.finebutton:before,a.finebutton:after,a.finebutton>.before,a.finebutton>.after {",
			"	background: url(img/btn_m_corn.png) no-repeat scroll 0 0 transparent;",
			"	content: '';",
			"	display: inline-block;",
			"	height: 43px;",
			"	width: 41px;",
			"	position: absolute;",
			"	top: 0;",
			"}",


			"a.finebutton:before,a.finebutton>.before {left: -41px;}",
			
			"a.finebutton:after,a.finebutton>.after {",
			"	background-position: -41px 0;",
			"	right: -41px;",
			"}",
			
			"a.finebutton:hover,a.finebutton:hover:before,a.finebutton:hover>.before,a.finebutton:focus,a.finebutton:focus:before,a.finebutton:focus>.before{background-position: 0 -44px;}",
			"a.finebutton:hover:after,a.finebutton:hover>.after,a.finebutton:focus:after,a.finebutton:focus>.after{background-position: -41px -44px;}",
			
			"a.finebutton:hover>p,a.finebutton:focus>p {color: white; text-shadow: 1px 1px #FEA22B, -1px 1px #FEA22B, 0 -1px #FEB750;}",
			
			"a.finebutton:active,a.finebutton:active:before,a.finebutton:active>.before {background-position: 0 -88px;}",
			"a.finebutton:active:after,a.finebutton:active>.after {background-position: -41px -88px;}",
			"a.finebutton.disable,a.finebutton.disable:before,a.finebutton.disable>.before {background-position: 0 -133px;}",
			"a.finebutton.disable:after,a.finebutton.disable>.after {background-position: -41px -133px;}",
			"a.finebutton.disable p {",
			"	color: #E0E0E0;",
			"	text-shadow: 1px 1px #FEAF7B, -1px 1px #FEAF7B, 0 -1px #FEC595;",
			"}",

			
		"</style>"
	].join("\n"));
	
	$(function(){
		$(".finebutton").each(function(i, el){el=$(el);
			var txt = el.html();
			el.html("<p>"+txt+"</p>");
		});
	});
})(jQuery);