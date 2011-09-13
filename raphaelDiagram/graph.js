var Graph = (function(){
	function extend(o,s){for(var k in s) o[k]=s[k];}
	
	function __(){
		var r;
		for(i=0; i<arguments.length; i++){var arg = arguments[i];
			if(i==0){
				var pnl = $("#"+arg);
				r = Raphael(arg, pnl.width(), pnl.height())
			}
			else{
				arg(r, i);
			}
		}
		return null;
	}
	
	var nodes = {};
	var nodesList = [];
	var shapes = [];
	
	extend(__, {
		Node: function(arg){
			var nm, id;
			if(typeof(arg)=="string"){
				nm = arg; id = "node"+nodesList.length;
			}
			else{
				nm = arg.title; id = arg.id || "node"+nodesList.length;
			}
			var nd = {id:id, title:nm};
			nodesList.push(nd);
			nodes[nd.id] = nd;
			
			return function(r, i){
				var shp = r.text(30*i, 40*i, nm);
				shapes[nd.id] = shp;
				return nd;
			};
		},
		Conn: function(src, trg){
			return function(r, i){
				return r.connection(shapes[src], shapes[trg], "#400");
			}
		}
	});
	
	return __;
})();