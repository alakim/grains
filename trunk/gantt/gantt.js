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
				var rowHeight = 20, timeCellWidth = 80;
				var cellAttr = {height:rowHeight, "class":"ganttCell"};
				return div(
					table({border:1, cellpadding:3, cellspacing:1, width:options.width},
						tr(
							td({"class":"ganttTable", width:options.width/2, valign:"top"},
								div({style:"float:left;"},
									apply(data.tasks, function(t,i){return div(cellAttr, t.id);})
								),
								div({style:style({float:"left", width:options.width/4})},
								//div({style:style({float:"left"})},
									apply(data.tasks, function(t,i){return div(cellAttr, t.name);})
								),
								div({style:"float:left;", width:timeCellWidth},
								 apply(data.tasks, function(t,i){return div(cellAttr, t.actualStart);})
								),
								div({style:"float:left;", width:timeCellWidth},
									apply(data.tasks, function(t,i){return div(cellAttr, t.actualEnd);})
								)
							),
							td({"class":"ganttSlider"}),
							td({"class":"ganttChart", valign:"top"})
						)
					)
					
					
				);
			}}
		};
		
		function drawChart(data){
			var R = Raphael($(".ganttChart").get(0));
			R.rect(10, 10, 100, 100).attr({fill:"red"});
		}
		
		$(this).html(templates.main(data));
		drawChart(data);
		$(".ganttSlider")
			.mousedown(function(e){
			})
			.mousemove(function(e){
			})
			.mouseup(function(e){
			});
	};
})(jQuery);