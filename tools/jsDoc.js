if(typeof(Html)=="undefined") alert("Configuration error!\n html.js module required.");

function Documentation(objName, description, defs){
	this.description = description;
	this.idx = Documentation.instances.length;
	this.objName = objName;
	this.defs = defs?defs:[];
	Documentation.instances.push(this);
	
}

Documentation.version = "1.0.214";
Documentation.sources = [];

(function(){
	function $(id){return document.getElementById(id);}
	
	function extend(o,s){for(var k in s)o[k]=s[k];}
	
	var __=Documentation;
	
	extend(__, {
		instances:[],
		
		show:function(){with(Html){var _=this;
			var toc = document.createElement("DIV");
			document.body.appendChild(toc);
			toc.innerHTML = div(
				apply(Documentation.instances, function(inst, i){
					return a({href:"#inst"+inst.idx}, inst.objName);
				})
			);
			toc.style.marginBottom = 15;
			
			var srcDock = document.createElement("DIV");
			document.body.appendChild(srcDock);
			srcDock.innerHTML = div({style:"display:none;"},
				div(apply(__.sources, function(srcID){
					return iframe({id:"docFrame"+_.idx+"_"+srcID, name:"docFrame"+_.idx+"_"+srcID, width:100, height:100, src:$(srcID).src});
				}))
			);
			
			
			for(var i=0;i<Documentation.instances.length;i++){
				var outdiv = document.createElement("DIV");
				document.body.appendChild(outdiv);
				var inst = Documentation.instances[i];
				inst.buildView(outdiv);
			}
		}},
		
		
		showSrcCode: function(idx, srcID, frameIdx){__.instances[idx].showSrcCode(srcID, frameIdx);}
	});
	
	__.prototype = {
		buildView: function(outdiv){with(Html){var _=this;
			var obj = window[_.objName];
			outdiv.innerHTML = div({"class":"globalObject"},
			
				div(span({style:"font-weight:bold;"}, "Sources:"),
					div({style:"margin-left:30px;"},
						apply(Documentation.sources, function(srcID, i){
							return div(
								span({style:"font-weight:bold;"}, srcID), ": ", 
								$(srcID).src,
								button({onclick:callFunction("Documentation.showSrcCode", _.idx, srcID, i)}, "show code")
							);
						})
					)
				),
				h2(a({name:"inst"+_.idx}, _.objName)),
				_.description?p(_.description):null,
				obj?_._buildHtml(obj, _.defs):null,
				
				p({style:"text-align:center; margin-top:80px; font-size:10px; font-family:Tahoma, Arial, Sans-serif; color:#cccccc; border-top:1px solid #cccccc;"}, "Powered by jsDoc v.", Documentation.version)
			)
		}},
		
		showSrcCode: function(srcID, frameIdx){var _=this;
			//var code = $("docFrame"+_.idx+"_"+srcID).document.innerHTML;
			var code = window.frames[frameIdx].document.body.childNodes[0].innerHTML;
			alert(code);
		},
		
		_buildHtml: function(obj, defs){with(Html){var _=this;
			if(!obj)
				return li({style:"color:#ff0000;"},
					span({style:"font-weight:bold;"}, name), 
					"item not implemented"
				);
				
			return ol(
				apply(obj, function(chObj, k){
					var doc = _.getDoc(k, defs);
					var docString = doc!=null
						?(doc.type+", "+doc.dsc)
						:span({style:"color:#cccccc;"}, " not documented");
						
					return li(span({style:"font-weight:bold;"}, k, ":"), 
						docString,
						doc && doc.children? _._buildHtml(chObj, doc.children):null
					);
				}),
				
				apply(defs, function(def, i){
					if(def.type=="instance")
						return li(
							span({style:"font-weight:bold;"}, "object instance:"),
							ol(
								apply(def.children, function(ch, i){
									return li({style:"color:#aaaaaa;"},
										span({style:"font-weight:bold;"}, def.name),
										def.type, ", ", def.dsc, " (not implemented)"
									);
								})
							)
						);
					else if(!def.displayed)
						return li({style:"color:#aaaaaa;"},
							span({style:"font-weight:bold;"}, def.name), " ",
							def.type, ", ", def.dsc, " (not implemented)"
						);
				})
			);
		}},
		
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
