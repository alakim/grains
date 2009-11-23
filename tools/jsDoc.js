if(typeof(Html)=="undefined") alert("Configuration error!\n html.js module required.");

function Documentation(objName, description, defs){
	this.description = description;
	this.idx = Documentation.instances.length;
	this.objName = objName;
	this.defs = defs?defs:[];
	Documentation.instances.push(this);
	
}

Documentation.version = "1.0.0";
Documentation.sources = [];

(function(){
	function $(id){return document.getElementById(id);}
	
	function extend(o,s){for(var k in s)o[k]=s[k];}
	
	var __=Documentation;
	
	extend(__, {
		instances:[],
		
		show:function(){
			var toc = document.createElement("DIV");
			document.body.appendChild(toc);
			var html = [];
			for(var i=0;i<Documentation.instances.length;i++){
				var inst = Documentation.instances[i];
				html.push("<a href=\"#inst"+inst.idx+"\">"+inst.objName+"</a><br>");
			}
			toc.innerHTML = html.join("");
			toc.style.marginBottom = 15;
			
			for(var i=0;i<Documentation.instances.length;i++){
				var outdiv = document.createElement("DIV");
				document.body.appendChild(outdiv);
				var inst = Documentation.instances[i];
				inst.buildView(outdiv);
			}
		}
	});
	
	__.prototype = {
		buildView: function(outdiv){with(Html){var _=this;
			var obj = window[_.objName];
			outdiv.innerHTML = div({"class":"globalObject"},
				div("Sources: ",
					apply(Documentation.sources, function(src){
						return div(span({style:"font-weight:bold;"}, src), ": ", $(src).src);
					})
				),
				h2(a({name:"inst"+_.idx}, _.objName)),
				_.description?p(_.description):null,
				obj?_._buildHtml(obj, _.defs):null,
				
				p({style:"text-align:center; margin-top:80px; font-size:10px; font-family:Tahoma, Arial, Sans-serif; color:#cccccc; border-top:1px solid #cccccc;"}, "Powered by jsDoc v.", Documentation.version)
			)
		}},
		
		_buildHtml: function(obj, defs){
			if(!obj)
				return "<li style=\"color:#ff0000;\"><span style=\"font-weight:bold;\">"+name+"</span> item not implemented</li>";
			var html = [];
			html.push("<ol>");
			for(var k in obj){
				var doc = this.getDoc(k, defs);
				var docString = doc!=null
					?(doc.type+", "+doc.dsc)
					:"<span style=\"color:#cccccc;\">not documented</span>";
					
				html.push("<li><span style=\"font-weight:bold;\">"+k+":</span> "+docString);
				if(doc!=null && doc.children){
					var chObj = obj[k];
					if(!chObj)
						html.push("Object '"+k+"' not found");
					else{
						html.push(this._buildHtml(chObj, doc.children));
					}
				}
				html.push("</li>");
			}
			for(var i=0;i<defs.length;i++){
				var def = defs[i];
				if(def.type=="instance"){
					html.push("<li><span style=\"font-weight:bold;\">object instance:</span>");
					html.push("<ol>");
					for(var i=0;i<def.children.length;i++){
						var ch = def.children[i];
						html.push("<li><span style=\"font-weight:bold;\">"+ch.name+":</span> "+ch.type+", "+ch.dsc+"</li>");
					}
					html.push("</ol>");
					html.push("</li>");
				}
				else if(!def.displayed){
					html.push("<li style=\" color:#aaaaaa;\"><span style=\"font-weight:bold;\">"+def.name+":</span> "+def.type+", "+def.dsc+" (not implemented)</li>");
				}
			}
			html.push("</ol>");
			return html.join("");
		},
		
		getDoc: function(itemName, defs){
			for(var i=0;i<defs.length;i++){
				var def = defs[i];
				if(def.name==itemName){
					def.displayed = true;
					return def;
				}
			}
			return null;
		}
	}

})();
