(function($){
	$.fn.gantt = function(options, data){
		options = $.extend({
			height:400,
			width:900
		}, options);
		
		var taskIndex = {};
		$.each(data.tasks, function(i,t){
			taskIndex[t.id] = {id:t.id, parent:t.parent, level:0};
		});
		var templates = {
			main: function(data){with(Html){
				var rowHeight = 20;
				var cellAttr = {height:rowHeight, "class":"ganttCell"};
				return div(
					table({border:1, cellpadding:3, cellspacing:1},
						tr(
							td(
								div({style:"float:left;"},
									apply(data.tasks, function(t,i){return div(cellAttr, t.id);})
								),
								div({style:style({float:"left", width:options.width/2})},
									apply(data.tasks, function(t,i){return div(cellAttr, t.name);})
								),
								div({style:"float:left;"},
								 apply(data.tasks, function(t,i){return div(cellAttr, t.actualStart);})
								),
								div({style:"float:left;"},
									apply(data.tasks, function(t,i){return div(cellAttr, t.actualEnd);})
								),
								div({"class":"ganttSlider"}),
								div({"class":"ganttChart"})
							),
							td({"class":"ganttSlider"}),
							td({"class":"ganttChart", width:options.width/2})
						)
					)
					
					
				);
			}}
		};
		
		$(this).html(templates.main(data));
	};
})(jQuery);