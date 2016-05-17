JStyles = (function(){
	function each(coll, F){
		if(!coll) return;
		if(coll instanceof Array)
			for(var i=0; i<coll.length; i++){F(coll[i], i);}
		else
			for(var k in coll){F(coll[k], k);}
	}
	
	function writeStyle(defs, sel, stylesheet){
		if(typeof(defs)=="function") defs = defs();
		var children = {};
		
		stylesheet.push(sel+"{");
		each(defs, function(v, nm){
			if(typeof(v)=="function") v = v();
			if(typeof(v)!="object")
				stylesheet.push([nm, ":", v, ";"].join(" "));
			else{
				children[nm] = v;
			}
		});
		stylesheet.push("}");
		
		each(children, function(cDef, cSel){
			writeStyle(cDef, sel+cSel, stylesheet);
		});
	}
	

	function render(css){
		var stylesheet = [];
		stylesheet.push('<style type="text/css">');
		each(css, function(defs, sel){
			writeStyle(defs, sel, stylesheet);
		});
		stylesheet.push('</style>');
		document.write(stylesheet.join("\n"));
	}
	
	return render;
})();