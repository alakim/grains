(function($){
	$.fn.gantt = function(data){
		var taskIndex = {};
		$.each(data.tasks, function(i,t){
			taskIndex[t.id] = {id:t.id, parent:t.parent, level:0};
		});
		var templates = {
			main: function(data){with(Html){
				var rowHeight = 20;
				var cellAttr = {height:rowHeight, style:style({"padding-left":3})};
				return div(
					table({border:1, cellpadding:3, cellspacing:1},
						tr(
							td(
								table({border:1, cellpadding:0, cellspacing:0},
									tr(
										td("#"), td("Name"), td("Start Time"), td("End Time")
										// td({colspan:3, width:5, "class":"ganttSlider"}),
										// td({rowspan:10, "class":"ganttChart"}),
										// td()
									),
									apply(data.tasks, function(t,i){
										return tr(
											td(cellAttr, t.id), td(cellAttr, t.name),
											td(cellAttr, t.actualStart), td(cellAttr, t.actualEnd)
										);
									})
								)
							),
							td({"class":"ganttSlider"}),
							td({"class":"ganttChart"})
						)
					)
					
					
					// div({style:"float:left;"},
						// apply(data.tasks, function(t,i){return div(cellAttr, t.id);})
					// ),
					// div({style:"float:left;"},
						// apply(data.tasks, function(t,i){return div(cellAttr, t.name);})
					// ),
					// div({style:"float:left;"},
						// apply(data.tasks, function(t,i){return div(cellAttr, t.actualStart);})
					// ),
					// div({style:"float:left;"},
						// apply(data.tasks, function(t,i){return div(cellAttr, t.actualEnd);})
					// ),
					// div({"class":"ganttSlider"}),
					// div({"class":"ganttChart"})
				);
			}}
		};
		
		$(this).html(templates.main(data));
	};
})(jQuery);