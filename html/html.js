var Html = {};

(function(){
	function extend(o,s){for(var k in s){o[k] = s[k];}}
	function each(coll, F){
		for(var i=0; i<coll.length;i++){
			F(coll[i], i);
		}
	}
	
	function genericTag(name){
		return new Function("content", "return Html.tag(\""+name+"\", arguments);");
	}
	
	extend(Html, {
		tag: function(name, content){
			var h = [];
			var a = [];
			each(content, function(el){
				if(typeof(el)=="object"){
					for(var k in el){
						a.push(" "+k+"=\""+el[k]+"\"");
					}
				}
				else
					h.push(el);
			});
			return "<"+name+a.join("")+">"+h.join("")+"</"+name+">";
		},
		
		div: genericTag("div"),
		p: genericTag("p")
	});
})();