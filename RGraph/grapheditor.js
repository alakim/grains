var GraphEditor = (function($){
	var templates = {
		main: function(data){with(Html){
			return table({border:1, cellpadding:3, cellspacing:0},
				tr(
					td(),
					apply(data.rowSettings, function(rs){
						return th({style:style({color:rs.color})}, rs.name);
					})
				),
				apply(data.labels, function(lbl, i){
					return tr(
						td(lbl), 
						apply(data.rows, function(row){
							return td(row[i]);
						})
					);
				})
			);
		}}
	};
	
	function build(panel, graphData){
		panel.html(templates.main(graphData));
	}
	
	$.fn.graphEditor = function(graphData){
		$.each($(this), function(i, panel){
			build($(panel), graphData);
		});
	}
	
	var __ = {
	};
	return __;
})(jQuery);