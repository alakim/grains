var Html = {};

(function(){
	function extend(o,s){for(var k in s){o[k] = s[k];}}
	
	function each(coll, F){
		if(coll.length)
			for(var i=0; i<coll.length;i++) F(coll[i], i);
		else
			for(var k in coll) F(coll[k], k);
	}
	
	function defineTags(tags){
		each(tags, function(t){
			Html[t] = new Function("content", "return Html.tag(\""+t+"\", arguments);");
		});
	}
	
	function defineSelfClosingTags(tags){
		each(tags, function(t){
			Html[t] = new Function("content", "return Html.tag(\""+t+"\", arguments, true);");
		});
	}
	
	extend(Html, {
		version: "1.3.16",
		xhtmlMode: true,
		
		tag: function(name, content, selfClosing){
			var h = [];
			var a = [];
			each(content, function(el){
				if(typeof(el)=="object"){
					each(el, function(val, nm){
						a.push(" "+nm+"=\""+val+"\"");
					});
				}
				else
					h.push(el);
			});
			
			if(selfClosing && h.length==0)
				return "<"+name+a.join("")+(Html.xhtmlMode? "/>":">");
			else
				return "<"+name+a.join("")+">"+h.join("")+"</"+name+">";
		},
		
		apply: function(coll, F){
			var h = [];
			each(coll, function(el, i){
				h.push(F(el, i));
			});
			return h.join("");
		}
	});
	
	defineTags(["div", "p", "span", "ul", "ol", "li", "table", "tbody", "thead", "tr", "th", "td", "input", "textarea", "pre", "select", "option"]);
	defineSelfClosingTags(["img", "hr", "br"]);
})();