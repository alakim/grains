var JDoc = (function(){
	var version = "0.0.0";
	
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
			return itm.parent&&itm.parent.$source?itm.parent.$source()[itm.name]:eval(itm.name);
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
		if(itm.type){}// html.push(itm.type);
		
		return html.length?div({"class":"section"}, html.join("")):null;
	}}

	function Module(name){
		var _ = {
			itemType:"Module",
			name:name,
			html: function(){with(Html){
				return div(
					h1(this.name),
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
			html: function(){with(Html){
				return div(
					h1(this.name),
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

	function existenceTemplate(itm){with(Html){
		return itm.$source()?span({"class":"exists"}, " [exists]"):span({"class":"notExists"}, " [not exists]");
	}}
	
	function notDocumentedFieldsTemplate(itm){with(Html){
		var src = itm.$source&&itm.$source();
		return src?div(
			apply(src, function(fld, nm){
				return itm.childrenIdx[nm]==null?div({"class":"section"},
					span({"class":"itemName"}, nm), ":", typeof(fld), span({"class":"notDocumented"}, " [not documented]")
				):null;
			})
		):null;
	}}
	
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
						console.log(c);
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
		Param: Param,
		Obj: Obj,
		Attribute: Attribute,
		Method: Method
	};
	
	function init(){
		if(!document.title.length){
			document.title = roots[0]&&roots[0].name + " documentation";
		}
		_.display()
	}
	
	$(function(){init();});
	
	return _;
})();
