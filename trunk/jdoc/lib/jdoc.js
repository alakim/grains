if(typeof(Html)!="object") alert("html.js module required!");

var JDoc = (function(){
	var version = "1.1.340";
	
	function each(c,F){
		if(c instanceof Array) for(var i=0; i<c.length; i++) F(c[i], i);
		else for(var k in c) F(c[k], k);
	}
		
	var items = {};
	var roots = [];
	
	function register(itm){
		itm.id = itm.id || Uid.getNew();
		items[itm.id] = itm;
		if(itm.itemType=="Module") roots.push(itm);
	}
	
	function buildSourceLink(itm){
		itm.$source = function(){var _=this;
			if(itm.itemType=="Prototype")
				return itm.parent.$source().prototype;
			try{
				return itm.parent&&itm.parent.$source?itm.parent.$source()[itm.name]:eval(itm.name);
			}
			catch(e){
				return null;
			}
		};
	}
	
	var Uid = (function(){
		var counter = 0;
		return {
			getNew: function(){
				return "uid"+(counter++);
			},
			isUid: function(id){
				return typeof(id)=="string" && id.match(/^uid\d+$/)!=null;
			}
		};
	})();
	
	function buildChildren(item, args, argIdx){
		item.children = [];
		item.childrenIdx = {};
		for(var i=argIdx; i<args.length; i++){var v = args[i];
			if(v.itemType=="Description"){
				item.description = v.html();
			}
			else if(typeof(v)=="object" && !v.itemType){
				each(v, function(val, fld){
					item[fld] = val;
				});
			}
			else{
				if(typeof(v)=="object") v.parent = item;
				item.children.push(v);
				if(v.name) item.childrenIdx[v.name] = v;
			}
		}
	}
	
	function commonPropertiesTemplate(itm){with(Html){
		var html = [];
		if(itm.description) html.push(div({"class":"description"}, itm.description));
		
		return html.length?div({"class":"commonProperties"}, html.join("")):null;
	}}

	function existenceTemplate(itm){with(Html){
		return itm.$source()?span({"class":"exists"}, " [exists]"):span({"class":"notExists"}, " [not exists]");
	}}
	
	function notDocumentedFieldsTemplate(itm){with(Html){
		var src = itm.$source&&itm.$source();
		var coll = []; for(var k in src)coll.push({fld:src[k], nm:k});
		
		return src?div(
			apply(coll, function(el){
				return el.nm!="prototype"&&itm.childrenIdx[el.nm]==null?div({"class":"section"},
					span({"class":"itemName"}, el.nm), ":", typeof(el.fld), span({"class":"notDocumented"}, " [not documented]")
				):null;
			})
		):null;
	}}

	function Module(name){
		var _ = {
			itemType:"Module",
			name:name,
			html: function(){with(Html){
				return div({"class":"module"},
					h1("Модуль ", this.name),
					commonPropertiesTemplate(this),
					apply(this.children, function(c){
						return div({"class":"section"}, c.html());
					})
				);
			}}
		};
		
		buildChildren(_, arguments, 1);
		register(_);
		return _;
	}

	function Class(name){
		var _ = {
			itemType:"Class",
			name:name,
			html: function(){with(Html){var _=this;
				return div(
					span({"class":"itemName"}, _.name), ":class",
					commonPropertiesTemplate(_),
					apply(_.children, function(c){
						return div({"class":"section"}, c.html());
					}),
					notDocumentedFieldsTemplate(_)
				);
			}}
		};
		
		buildChildren(_, arguments, 1);
		register(_);
		buildSourceLink(_);
		return _;
	}

	function Param(name){
		var _ = {
			itemType:"Param",
			name:name,
			html: function(){with(Html){
				return div(
					span({"class":"itemName"}, this.name),
					commonPropertiesTemplate(this),
					apply(this.children, function(c){
						return div({"class":"section"}, c.html());
					})
				);
			}}
		};
		
		buildChildren(_, arguments, 1);
		register(_);
		return _;
	}
	
	function Obj(name){
		var _ = {
			itemType:"Obj",
			name:name,
			html: function(){with(Html){var _=this;
				return div(
					span({"class":"itemName"}, _.name), ":object ",
					existenceTemplate(_),
					commonPropertiesTemplate(_),
					apply(_.children, function(c){
						return div({"class":"section"}, c.html());
					}),
					notDocumentedFieldsTemplate(_)
				);
			}}
		};
		
		buildChildren(_, arguments, 1);
		register(_);
		buildSourceLink(_);
		return _;
	}

	function Attribute(name){
		var _ = {
			itemType:"Attribute",
			name:name,
			html: function(){with(Html){var _=this;
				return div(
					span({"class":"itemName"}, _.name), _.type?span(":", _.type):null,
					existenceTemplate(_),
					commonPropertiesTemplate(_),
					apply(_.children, function(c){
						return div({"class":"section"}, c.html());
					})
				);
			}}
		};
		
		buildChildren(_, arguments, 1);
		register(_);
		buildSourceLink(_);
		return _;
	}

	function Method(name){
		var _ = {
			itemType:"Method",
			name:name,
			html: function(){with(Html){
				return div(
					span({"class":"itemName"}, this.name), ":function",
					existenceTemplate(_),
					commonPropertiesTemplate(this),
					apply(this.children, function(c){
						return div({"class":"section"}, c.html());
					})
				);
			}}
		};
		
		buildChildren(_, arguments, 1);
		register(_);
		buildSourceLink(_);
		return _;
	}
	
	function Description(){
		var _ = {
			itemType:"Description",
			html: function(){with(Html){
				return div({"class":"description"},
					apply(this.children, function(c){
						return typeof(c.html)=="function"?c.html():c.toString();
					})
				);
			}}
		};
		
		buildChildren(_, arguments, 0);
		register(_);
		return _;
	}
	
	function Constructor(){
		var _ = {
			itemType:"Constructor",
			html: function(){with(Html){
				return div(
					span({"class":"itemName"}, "constructor"),					
					apply(this.children, function(c){
						return div({"class":"section"}, c.html());
					})
				);
			}}
		};
		
		buildChildren(_, arguments, 0);
		register(_);
		buildSourceLink(_);
		return _;
	}
	
	function Prototype(){
		var _ = {
			itemType:"Prototype",
			html: function(){with(Html){
				return div(
					span({"class":"itemName"}, "prototype"),					
					apply(this.children, function(c){
						return div({"class":"section"}, c.html());
					}),
					notDocumentedFieldsTemplate(_)
				);
			}}
		};
		
		buildChildren(_, arguments, 0);
		register(_);
		buildSourceLink(_);
		return _;
	}

	function p(){
		var _ = {
			itemType:"p",
			html: function(){return Html.div(this.children.join(""));}
		};
		
		buildChildren(_, arguments, 0);
		register(_);
		return _;
	}
	
	function footerTemplate(){
		return Html.div({"class":"footer"},
			"Powered by. ",
			"JDoc v.", _.version, ", ",
			"Html.js v.", Html.version
		);
	}

	var _ = {
		version:version,
		display: function(){
			var html = [];
			each(roots, function(r){html.push(r.html());});
			document.body.innerHTML = html.join(" ")+footerTemplate();
		},
		Module: Module,
		Class: Class,
		Description: Description,
		p:p,
		Constructor: Constructor,
		Prototype: Prototype,
		Param: Param,
		Obj: Obj,
		Attribute: Attribute,
		Method: Method
	};
	
	function addEventHandler(trgEl, eventNm, handler){
		var eventNm=(window.addEventListener)? eventNm : "on"+eventNm;
		if (trgEl.addEventListener)
			trgEl.addEventListener(eventNm, handler, false);
		else if (trgEl.attachEvent)
			trgEl.attachEvent(eventNm, handler);
	}
	
	addEventHandler(window, "load", function(){
		if(!document.title.length){
			document.title = roots[0]&&roots[0].name + " documentation";
		}
		_.display()
	});
	
	return _;
})();
