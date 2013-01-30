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
				var cellAttr = {height:rowHeight};
				return div(
					table({border:0, cellpadding:3, cellspacing:1, width:options.width},
						tr(
							td({"class":"ganttTable", width:options.width/2, valign:"top"},
							   table({width:"100%", border:1, cellspacing:0, cellpadding:0},
									 tr(th("#"), th("Name"), th("Start Time"), th("End Time")),
									 apply(data.tasks, function(t,i){
										return tr(
											td(cellAttr, t.id),
											td(cellAttr, div({"class":"ganttCell", style:"width:200px;"}, t.name)),
											td(cellAttr, t.actualStart),
											td(cellAttr, t.actualEnd)
										);
									 })
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