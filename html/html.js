var Html = {};

(function(){
	function extend(o,s){for(var k in s){o[k] = s[k];}}
	
	function each(coll, F){
		for(var i=0; i<coll.length;i++){
			F(coll[i], i);
		}
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
		xhtmlMode: true,
		
		tag: function(name, content, selfClosing){
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
			
			if(selfClosing && h.length==0)
				return "<"+name+a.join("")+(Html.xhtmlMode? "/>":">");
			else
				return "<"+name+a.join("")+">"+h.join("")+"</"+name+">";
		}
	});
	
	defineTags(["div", "p", "span", "ul", "ol", "li", "table", "tbody", "thead", "tr", "th", "td", "input", "textarea", "pre"]);
	defineSelfClosingTags(["img", "hr", "br"]);
})();