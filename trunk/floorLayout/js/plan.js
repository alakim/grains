define(["jquery", "html", "raphael", "db"], function($, $H, R, db){
	var r;
	var buildingNr;
	
	var x0 = 20,
		y0 = 20,
		w = 400,
		h = 300,
		margin = 4,
		fw = 25,
		fh = 38;
		
		
	function addEvents(shape, item, type){
		shape.mouseover(function(e){
			var shape = this.data("set")[0].data("shape");
			shape.attr(templates.styles[type].highlight);
			
		}).mouseout(function(){
			var shape = this.data("set")[0].data("shape");
			shape.attr(templates.styles[type].defaultStyle);
		}).click(function(){
			var data = db.getData(buildingNr, type, item.nr, item.fnr);
			$("#propPanel").html(templates.properties({type:type, nr:item.nr, fnr:item.fnr, data:data}));
		});
		
	}
	
	function roomSold(bldNr, fnr, nr){
		var data = db.getData(bldNr, "room", nr, fnr);
		return data.sold;
	}
	
	var templates = {
		styles:{
			room: {
				defaultStyle:{fill:"#ccc", stroke:"#888"},
				highlight:{fill:"#f00"},
				sold:{fill:"#eee", stroke:"#ccc", cursor:"auto"}
			},
			floor: {
				defaultStyle:{fill:"#fafafa", stroke:"#888"},
				highlight:{fill:"#ff0"}
			},
			street:{
				defaultStyle:{fill:"#edd", stroke:"#444"}
			}
		},
		main: function(data){
			//console.log(data);
			function buildSet(itm, item, type){
				var set = r.set();
				set.push(itm);
				itm.data({"set": set});
				set.data({"shape":itm});
				templates.labels(set, item, type);
				set.attr({cursor:"pointer"});
				var sold = type=="room"&&roomSold(buildingNr, item.fnr, item.nr);
				if(sold){
					set.attr({cursor:"auto"});
					itm.attr(templates.styles.room.sold);
				}
				else
					addEvents(set, item, type);
			}
			
			function drawCollection(coll, iClass){
				$.each(coll, function(i, cItm){
					if(!cItm) return;
					var itm;
					switch(cItm.type){
						case "rect": itm = templates.rectItm(i, cItm, iClass); break;
						case "path": itm = templates.pathItm(i, cItm, iClass); break;
						case "text": itm = templates.textItm(i, cItm, iClass); break;
						default: break;
					}
					if(iClass=="room" || iClass=="floor")
						buildSet(itm, cItm, iClass);
				});
			}
			
			drawCollection(data.floors, "floor");
			drawCollection(data.rooms, "room");
			drawCollection(data.streets, "street");
			drawCollection(data.labels, "label");
		},
		labels: function(set, item, type){
			if(item.nr==null) return;
			var bbox = set.getBBox();
			var x = type=="room"?bbox.x+bbox.width/2:bbox.x+5,
				y = type=="room"?bbox.y+bbox.height/2:bbox.y-7;
			var label = r.text(x, y, (type=="room"?"кв.":type=="floor"?"этаж ":"№")+item.nr);
			label.attr({fill:"#000", "stroke-width":0});
			set.push(label);
			label.data({set:set});
		},
		transform: function(rshape, item){
			if(item.tr && item.tr.match(/matrix\(/i)){
				var mtx = item.tr.match(/matrix\(([^\)]+)\)/)[1].replace(/,/g, " ");
				mtx = "m "+mtx;
				rshape.transform(mtx);
			}
		},
		rectItm: function(idx, item, type){
			var rshape = r.rect(item.x, item.y, item.w, item.h).attr(templates.styles[type].defaultStyle);
			templates.transform(rshape, item);
			return rshape;
		},
		pathItm: function(idx, item, type){
			var rshape = r.path(item.d).attr(templates.styles[type].defaultStyle);
			templates.transform(rshape, item);
			return rshape;
		},
		textItm: function(idx, item, type){
			var rshape = r.text(item.x, item.y, item.txt);
			templates.transform(rshape, item);
			return rshape;
		},
		properties: function(data){with($H){
			return div(
				data.type=="floor"?div(
					h2("Этаж ", data.nr),
					data.data.description?p(data.data.description):null
				)
				:data.type=="room"?div(
					h2("Этаж ", data.fnr, ", квартира ", data.nr),
					p("Цена ", data.data.price, " руб")
				)
				:null
			);
		}}
	};
	
	return {
		view: function(pnl, bldNr){
			buildingNr = bldNr;
			r = R(pnl);
			$.getJSON("ws/layout.php?f=building"+bldNr+".svg", function(data){
				templates.main(data);
			});
		}
	};
});