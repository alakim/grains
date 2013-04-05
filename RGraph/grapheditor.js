var GraphEditor = (function($){
	var templates = {
		main: function(data){with(Html){
			return markup(
				table({border:1, cellpadding:3, cellspacing:0},
					tr(
						td(),
						apply(data.rowSettings, function(rs, i){
							return th({style:style({"background-color":rs.color})},
								input({"class":"txtFld", type:"text", value:rs.name, path:"rowSettings/"+i+"/name"})
							);
						})
					),
					apply(data.labels, function(lbl, i){
						return templates.row(lbl, i, data);
					}),
					tr(td({colspan:data.rows.length+1}, input({type:"button", "class":"btnAddRow", value:"Добавить"})))
				)
			);
		}},
		row: function(lbl, i, data){with(Html){
			return tr(
				td(input({"class":"txtFld", type:"text", value:lbl, path:"labels/"+i})), 
				apply(data.rows, function(row, jRow){
					return td(input({"class":"dotFld", type:"text", value:row[i]||"", path:"rows/"+jRow+"/"+i}));
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
		panel.find(".btnAddRow").click(function(){
			var row = panel.find("tr:last()");
			var newRow = $(templates.row("", __.data.labels.length, __.data));
			row.before(newRow);
			bindEvents(newRow);
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