var JFx = (function(){
	function extend(o,s){for(var k in s) o[k] = s[k]; return o;}
	function each(coll, F){
		if(coll instanceof Array)
			for(var i=0; i<coll.length; i++) F(coll[i], i);
		else
			for(var k in coll) F(coll[k], k);
	}
	function eachArgument(coll, F){
		for(var i=0; i<coll.length; i++) F(coll[i], i);
	}
	
	function json(obj){
		if(!(obj instanceof Array))
			return obj;
		
		var res = [];
		if(obj._){
			if(obj.elementType) res._elementType = obj._.name;
			else res.elementType = obj._.name;
		}
		for(var k in obj){
			if(k=="_") continue;
			var idx = parseInt(k);
			if(isNaN(idx) || idx>=obj.length){
				res[k] = obj[k];
			}
		}
		if(obj instanceof Array) {
			for(var i=0; i<obj.length; i++){
				res.push(json(obj[i]));
			}
		}
		return res;
	}
	
	var ID = (function(){
		var ids = {};
		var f = function(id){
			if(ids[id]) throw "Identifier "+id+" already used!";
			ids[id] = true;
			return {type:"id", id:id};
		};
		var counter = 0;
		extend(f, {
			newID: function(){
				var t = new Date().getTime();
				return f("id"+(counter++)+t);
			}
		});
		return f;
	})();
	
	var _ = {
		version: "0.0.0",
		Schema: function(){
			var schema = {
				ID: ID
			};
			schema._ = {};
			eachArgument(arguments, function(itmDef, i){
				schema[itmDef.name] = itmDef;
				if(i==0) schema._.root = itmDef;
			});
			console.log("schema: ", schema);
			return schema;
		},
		Item: function(name){
			function itmConstructor(){
				var item = [];
				extend(item, {
					_:{
						name:name,
						$json:function(){return json(item)}
					}
				});
				eachArgument(arguments, function(el, i){
					switch(el.type){
						case "id": item._.id = el.id; break;
						default:
							bindChild(item, el, i);
							break;
					}
				});
				// console.log("item: ", item);
				return item;
			}
			extend(itmConstructor, {
				name:name,
				schema:{attributes:{}, items:[]}
			});
			eachArgument(arguments, function(el){
				switch(el.type){
					case "attribute": itmConstructor.schema.attributes[el.idx] = el; break;
					case "item": itmConstructor.schema.items.push(el); break;
					default: break; //throw "Element type "+el.type+" not supported!";
				}
			});
			
			function bindChild(parent, child, idx){
				if(itmConstructor.schema.attributes[idx])
					parent[itmConstructor.schema.attributes[idx].name] = child;
				else{
					if(child._){
						child._.parent = parent;
						parent.push(child);
					}
					else if(typeof(child)=="object")
						extend(parent, child);
					else
						parent.push(child);
				}
			}
			return itmConstructor;
		},
		Child: function(name, mult){
			return {type:"item", name:name, mult:mult};
		},
		Attr: function(name, idx){
			return {type:"attribute", name:name, idx:idx};
		}
	};
	
	return _;
})();