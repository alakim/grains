var Finebuttons = (function($){
	
	var classes = [];
	
	function registerClass(def){
		var backgroundFill = def.backgroundFill,
			backgroundCorner = def.backgroundCorner,
			height = def.height, width = def.width;
		var className = def.name
		
		classes.push(className);
		
		document.write([
			"<style type='text/css'>",
				"a."+className+" {",
				"	after: ' ';",
				"	before: ' ';",
				"	background: url("+backgroundFill+") repeat-x scroll 0 0 transparent;",
				"	display: inline-block;",
				"	height: "+height+"px;",
				"	margin: 0 "+width+"px;",
				"	min-width: 5px;",
				"	position: relative;",
				"	text-decoration: none;",
				"	vertical-align: middle;",
				"}",
				
				"a."+className+" p {",
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
				
				"a."+className+":before,a."+className+":after,a."+className+">.before,a."+className+">.after {",
				"	background: url("+backgroundCorner+") no-repeat scroll 0 0 transparent;",
				"	content: '';",
				"	display: inline-block;",
				"	height: "+height+"px;",
				"	width: "+width+"px;",
				"	position: absolute;",
				"	top: 0;",
				"}",


				"a."+className+":before,a."+className+">.before {left: -"+width+"px;}",
				"a."+className+":after,a."+className+">.after {background-position: -"+width+"px 0; right: -"+width+"px;}",
				
				"a."+className+":hover,a."+className+":hover:before,a."+className+":hover>.before,a."+className+":focus,a."+className+":focus:before,a."+className+":focus>.before{background-position: 0 -"+(height+1)+"px;}",
				"a."+className+":hover:after,a."+className+":hover>.after,a."+className+":focus:after,a."+className+":focus>.after{background-position: -"+width+"px -"+(height+1)+"px;}",
				"a."+className+":hover>p,a."+className+":focus>p {color: white; text-shadow: 1px 1px #FEA22B, -1px 1px #FEA22B, 0 -1px #FEB750;}",
				
				"a."+className+":active,a."+className+":active:before,a."+className+":active>.before {background-position: 0 -"+((height+1)*2)+"px;}",
				"a."+className+":active:after,a."+className+":active>.after {background-position: -"+width+"px -"+((height+1)*2)+"px;}",
				
				"a."+className+".disable,a."+className+".disable:before,a."+className+".disable>.before {background-position: 0 -"+((height+1)*3)+"px;}",
				"a."+className+".disable:after,a."+className+".disable>.after {background-position: -"+width+"px -"+((height+1)*3)+"px;}",
				"a."+className+".disable p {color: #E0E0E0; text-shadow: 1px 1px #FEAF7B, -1px 1px #FEAF7B, 0 -1px #FEC595;}",

				
			"</style>"
		].join("\n"));
	}
	
	$(function(){
		$.each(classes, function(i, className){
			$("."+className).each(function(i, el){el=$(el);
				var txt = el.html();
				el.html("<p>"+txt+"</p>");
			});
		});
	});
	
	return {
		registerClass: registerClass
	};
})(jQuery);