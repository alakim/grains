JStyles = (function(){
	function each(coll, F){
		if(coll instanceof Array)
			for(var i=0; i<coll.length; i++){F(coll[i], i);}
		else
			for(var k in coll){F(coll[k], k);}
	}
	
	function render(css){
		document.write('<style type="text/css">\n');
		each(css, function(d, sel){
			document.write(sel+"{");
			each(d, function(v, attr){
				document.write([attr, ":", v, ";\n"].join(" "));
			});
			document.write("}\n");
		});
		document.write('</style>\n');
	}
	
	return render;
})();