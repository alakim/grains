var Html = {
	version: "3.1.846",
	xhtmlMode: true	
};

(function(){
	function extend(o,s){for(var k in s){o[k] = s[k];}}
	
	function each(coll, F){
		if(!coll) return;
		if(coll instanceof Array)
			for(var i=0; i<coll.length; i++){F(coll[i], i);}
		else
			for(var k in coll){F(coll[k], k);}
	}
	
	function defineTags(tags, selfClosing, notEmpty){
		each(tags, function(t){
			Html[t] = new Function("content", "return Html.tag(\""+t+"\", arguments,"+(selfClosing?"true":"false")+","+(notEmpty?"true":"false")+");");
		});
	}
	
	function defineSelfClosingTags(tags){defineTags(tags, true, false);}
	function defineNotEmptyTags(tags){defineTags(tags, false, true)}
	function markup(){
		var res = [];
		each(arguments, function(tag){
			res.push(tag);
		});
		return res.join("");
	}
	
	function repeat(count, F, delim){
		var h = [];
		for(var i=0; i<count; i++)
			h.push(F(i+1));
		return h.join(delim||"");
	}
	
	function emptyValue(v){return !v ||(typeof(v)=="string"&&v.length==0);}
	
	extend(Html, {
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
		
		apply: function(coll, F, delim, hideEmpty){
			var h = [];
			each(coll, function(el, i){
				if(!emptyValue(el) || !hideEmpty){
					var v = F(el, i);
					if(!emptyValue(v) || !hideEmpty)
						h.push(v);
				}
			});
			return h.join(delim||"");
		},
		
		times: repeat,
		repeat: repeat,
		
		markup: markup,
		tagCollection: markup,
		
		json: function(o){
			if(o==null) return 'null';
			if(typeof(o)=="string") return "'"+o.replace(/\"/g, "\\\"")+"'";
			if(typeof(o)=="boolean") return o.toString();
			if(typeof(o)=="number") return o.toString();
			if(typeof(o)=="function") return "";
			if(o.constructor==Array){
				var res = [];
				for(var i=0; i<o.length; i++) res.push(Html.json(o[i]));
				return "["+res.join(",")+"]";
			}
			if(typeof(o)=="object"){
				var res = [];
				for(var k in o) res.push(k+":"+Html.json(o[k]));
				return "{"+res.join(",")+"}";
			}
			return "";
		},
		
		format: function(str, v1, v2){
			for(var i=0; i<arguments.length; i++){
				str = str.replace(new RegExp("{\s*"+i+"\s*}", "ig"), arguments[i+1])
			}
			return str;
		},
		
		style: function(){
			function addUnits(nm, val){
				if((nm=="width"||nm=="height"||nm=="top"||nm=="left")&&typeof(val)=="number") return val+"px";
				return val;
			}
			
			var s = {};
			for(var i=0; i<arguments.length; i++){
				extend(s, arguments[i]);
			}
			var r = [];
			for(var k in s){
				r.push(k+":"+addUnits(k, s[k]));
			}
			return r.join(";");
		},
		
		callFunction: function(name, a1, a2){
			var args = [];
			for(var i=1; i<arguments.length; i++){
				var arg = arguments[i];
				arg = typeof(arg)=="string" && arg.match(/^@/)? arg.slice(1, arg.length)
					:Html.json(arg);
				args.push(arg);
			}
			return [name, "(", args.join(","), ")"].join("");
		},
		defineTags: function(tags){
			if(!(tags instanceof(Array)))tags=tags.split(";");
			defineTags(tags);
		},
		getTagDefinitions: function(tags){
			if(!(tags instanceof(Array)))tags=tags.split(";");
			function defTag(nm){return function(){return Html.tag(nm, arguments, true);}}
			var res = {}
			for(var i=0,t; t=tags[i],i<tags.length; i++) res[t] = defTag(t);
			return res;
		}
	});
	
	defineTags(["div", "a", "p", "span", "nobr", "ul", "ol", "li", "table", "tbody", "thead", "tr", "input", "label", "textarea", "pre", "select", "option", "optgroup", "h1", "h2", "h3", "h4", "h5", "h6", "button", "form","dl", "dt","dd"]);
	defineSelfClosingTags(["img", "hr", "br", "iframe"]);
	defineNotEmptyTags(["th", "td"]);
	
	
	
	function writeStyle(defs, sel, stylesheet){
		if(typeof(defs)=="function") defs = defs();
		var children = {};
		
		stylesheet.push(sel+"{");
		each(defs, function(v, nm){
			if(typeof(v)=="function") v = v();
			if(typeof(v)!="object")
				stylesheet.push([Html.cssAttributes[nm] || nm, ":", v, ";"].join(" "));
			else{
				children[nm] = v;
			}
		});
		stylesheet.push("}");
		
		each(children, function(cDef, cSel){
			writeStyle(cDef, sel+cSel, stylesheet);
		});
	}

	Html.cssAttributes = {};
	
	Html.stylesheet = function(css){
		var stylesheet = [];
		stylesheet.push('<style type="text/css">');
		each(css, function(defs, sel){
			writeStyle(defs, sel, stylesheet);
		});
		stylesheet.push('</style>');
		return stylesheet.join("\n");
	}
	
	Html.writeStylesheet = function(css){
		document.write(Html.stylesheet(css));
	}
})();