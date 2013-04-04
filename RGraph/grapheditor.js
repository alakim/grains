var GraphEditor = (function($){
	var templates = {
		main: function(data){with(Html){
			return markup(
				table({border:1, cellpadding:3, cellspacing:0},
					tr(
						td(),
						apply(data.rowSettings, function(rs){
							return th({style:style({color:rs.color})}, rs.name);
						})
					),
					apply(data.labels, function(lbl, i){
						return tr(
							td(lbl), 
							apply(data.rows, function(row, jRow){
								return td(input({type:"text", value:row[i]||"", path:"rows/"+jRow+"/"+i}));
							})
						);
					})
				)
			);
		}}
	};
	
	function build(panel){
		panel.html(templates.main(__.data));
		panel.find("input").change(function(){var _=$(this);
			var val = _.val();
			try{val = parseInt(val);}
			catch(e){val = null;}
			var path = _.attr("path");
			if(val)
				JsPath.set(__.data, path, val);
			else
				JsPath.delItem(__.data, path);
			__.onchange(__.data);
		});
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