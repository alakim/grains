function Documentation(objName, description, defs){
	this.description = description;
	this.idx = Documentation.instances.length;
	this.objName = objName;
	this.defs = defs?defs:[];
	Documentation.instances.push(this);
	
}

Documentation.prototype = {
	buildView: function(div){
		var html = [];
		html.push("<div class=\"globalObject\">")
		html.push("<h2><a name=\"inst"+this.idx+"\">"+this.objName+"</a></h2>");
		if(this.description)
			html.push("<p>"+this.description+"</p>");
		var obj;
		obj = window[this.objName];
		if(obj){
			html.push(this._buildHtml(obj, this.defs));
		}
		html.push("</div>");
		div.innerHTML = html.join("");
	},
	
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

Documentation.instances = [];

Documentation.show = function(){
	
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
		var div = document.createElement("DIV");
		document.body.appendChild(div);
		var inst = Documentation.instances[i];
		inst.buildView(div);
	}
}