var GraphEditor = (function($){
	var cellWidth = 35;
	var templates = {
		main: function(data){with(Html){
			return markup(
				table({border:1, cellpadding:3, cellspacing:0},
					tr(
						td({colspan:2, align:"right"}, 
							input({"class":"btnAddRow", type:"button", value:"+", title:"Добавить кривую"})
						),
						apply(data.rowSettings, function(rs, i){
							return th({style:style({"background-color":rs.color, width:cellWidth})},
								input({"class":"txtFld", type:"text", value:rs.name, path:"rowSettings/"+i+"/name", style:style({width:cellWidth})})
							);
						})
					),
					apply(data.labels, function(lbl, i){
						return templates.row(lbl, i, data);
					}),
					tr(td({colspan:data.rows.length+2}, input({type:"button", "class":"btnAddPoint", title:"Добавить строку", value:"Добавить"})))
				)
			);
		}},
		row: function(lbl, i, data){with(Html){
			return tr(
				td(input({"class":"btnDelPoint", type:"button", value:"x", title:"Удалить точку", pointIdx:i})),
				td(input({"class":"txtFld", type:"text", style:style({width:cellWidth*2}), value:lbl, path:"labels/"+i})), 
				apply(data.rows, function(row, jRow){
					return td(input({"class":"dotFld", type:"text", style:style({width:cellWidth}), value:row[i]||"", path:"rows/"+jRow+"/"+i}));
				})
			);
		}}
	};
	
	function bindEvents(panel){
		panel.find("input.dotFld").change(function(){var _=$(this);
			var path = _.attr("path");
			var val = _.val();
			try{val = parseFloat(val);}
			catch(e){val = null;}
			if(val)
				JsPath.set(__.data, path, val);
			else
				JsPath.delItem(__.data, path);
			__.onchange(__.data);
		});
		panel.find("input.txtFld").change(function(){var _=$(this);
			var path = _.attr("path");
			var val = _.val();
			JsPath.set(__.data, path, val);
			__.onchange(__.data);
		});
		panel.find(".btnAddPoint").click(function(){
			var row = panel.find("tr:last()");
			var newRow = $(templates.row("", __.data.labels.length, __.data));
			row.before(newRow);
			bindEvents(newRow);
		});
		panel.find(".btnDelPoint").click(function(){var _=$(this);
			if(!window.confirm("Удалить точку?")) return;
			var pointIdx = parseInt(_.attr("pointIdx"));
			JsPath.delItem(__.data, "labels/"+pointIdx);
			for(var i=0; i<__.data.rows.length; i++){
				JsPath.delItem(__.data, "rows/"+i+"/"+pointIdx);
			}
			__.onchange(__.data);
			var tRow = panel.find("tr:eq("+(pointIdx+1)+")");
			tRow.remove();
		});
		panel.find(".btnAddRow").click(function(){
			var rowNr = __.data.rowSettings.length;
			JsPath.set(__.data, "rowSettings/"+rowNr+"/name", "");
			JsPath.set(__.data, "rowSettings/"+rowNr+"/color", "#00f");
			JsPath.set(__.data, "rows/"+rowNr, []);
			build(panel);
		});
	}
	function build(panel){
		panel.html(templates.main(__.data));
		bindEvents(panel);
	}
	
	$.fn.graphEditor = function(graphData){
		__.data = graphData;
		$.each($(this), function(i, panel){
			build($(panel));
		});
	}
	
	var __ = {
		data:null,
		onchange: function(){}
	};
	return __;
})(jQuery);