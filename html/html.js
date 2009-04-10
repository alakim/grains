var Html = {};

(function(){
	function extend(o,s){for(var k in s){o[k] = s[k];}}
	
	function each(coll, F){
		if(!coll) return;
		if(coll.length)
			for(var i=0; i<coll.length;i++) F(coll[i], i);
		else
			for(var k in coll) F(coll[k], k);
	}
	
	function defineTags(tags, selfClosing, notEmpty){
		each(tags, function(t){
			Html[t] = new Function("content", "return Html.tag(\""+t+"\", arguments,"+(selfClosing?"true":"false")+","+(notEmpty?"true":"false")+");");
		});
	}
	
	function defineSelfClosingTags(tags){defineTags(tags, true, false);}
	function defineNotEmptyTags(tags){defineTags(tags, false, true)}
	
	extend(Html, {
		version: "1.6.97",
		xhtmlMode: true,
		
		tag: function(name, content, selfClosing, notEmpty){
			var h = [];
			var a = [];
			each(content, function(el){
				if(typeof(el)!="object")
					h.push(el);
				else{
					each(el, function(val, nm){
						a.push(" "+nm+"=\""+val+"\"");
					});
				}
			});
			
			h = h.join("");
			if(h.match(/^\s+$/i))
				h = "";
			if(notEmpty && h.length==0)
				h = "&nbsp;";
			
			if(selfClosing && h.length==0)
				return "<"+name+a.join("")+(Html.xhtmlMode? "/>":">");
			else
				return "<"+name+a.join("")+">"+h+"</"+name+">";
		},
		
		apply: function(coll, F){
			var h = [];
			each(coll, function(el, i){
				h.push(F(el, i));
			});
			return h.join("");
		},
		
		times: function(count, F){
			var h = [];
			for(var i=0; i<count; i++)
				h.push(F(i+1));
			return h.join("");
		},
		
		tagCollection: function(){
			var res = [];
			each(arguments, function(tag){
				res.push(tag);
			});
			return res.join("");
		}
	});
	
	defineTags(["div", "a", "p", "span", "ul", "ol", "li", "table", "tbody", "thead", "tr", "input", "textarea", "pre", "select", "option", "h1", "h2", "h3", "h4", "h5", "h6", "button"]);
	defineSelfClosingTags(["img", "hr", "br"]);
	defineNotEmptyTags(["th", "td"]);
})();