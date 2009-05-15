var JSQL = {};

(function(){
	function extend(o, s){for(var k in s)o[k]=s[k];}
	
	function each(coll, F){
		if(!coll) return;
		for(var i=0; i<coll.length; i++)
			F(coll[i], i);
	}
	
	extend(JSQL, {
		version: "0.0.0",
	});
})();