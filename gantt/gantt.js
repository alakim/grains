(function($){
	$.fn.gantt = function(data){
		var taskIndex = {};
		$.each(data.tasks, function(i,t){
			taskIndex[t.id] = {id:t.id, parent:t.parent, level:0};
		});
		var templates = {
			main: function(data){with(Html){
				var rowHeight = 20;
				var cellAttr = {style:style({height:rowHeight, "padding-left":3})};
				return div(
					div({style:"float:left;"},
						apply(data.tasks, function(t,i){return div(cellAttr, t.id);})
					),
					div({style:"float:left;"},
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
				);
			}}
		};
		
		$(this).html(templates.main(data));
	};
})(jQuery);