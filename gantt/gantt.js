(function($){
	$.fn.gantt = function(options, data){
		options = $.extend({
			height: 400,
			width: 900,
			rowHeight: 20,
		}, options);
		
		var taskIndex = {};
		$.each(data.tasks, function(i,t){
			taskIndex[t.id] = {id:t.id, parent:t.parent, level:0};
		});
		var templates = {
			main: function(data){with(Html){
				var rowHeight = options.rowHeight, timeCellWidth = 80;
				var cellAttr = {height:rowHeight};
				return div(
					table({border:1, cellpadding:3, cellspacing:1, width:options.width},
						tr(
							td({"class":"ganttTable", width:options.width/2, valign:"top"},
							   table({width:"100%", border:1, cellspacing:0, cellpadding:0},
									 tr(th("#"), th("Name"), th("Start Time"), th("End Time")),
									 apply(data.tasks, function(t,i){
										return tr(
											td(cellAttr, div({"class":"ganttCell"}, t.id)),
											td(cellAttr, div({"class":"ganttCell", style:"width:200px;"}, t.name)),
											td(cellAttr, div({"class":"ganttCell"}, t.actualStart)),
											td(cellAttr, div({"class":"ganttCell"}, t.actualEnd))
										);
									 })
							   )
							),
							td({"class":"ganttSlider"}),
							td({valign:"top"}, div({"class":"ganttChart"}))
						)
					)
					
					
				);
			}}
		};
		
		function drawChart(container, data){
			$(".ganttChart").css({
				height: container.height(),
				width: 800 //$(".ganttChart").parent().width()
			});
			var width = $(".ganttChart").width();
			
			var R = Raphael($(".ganttChart").get(0));
			function drawGrid(){
				var step = options.rowHeight+5;
				var headHeight = 25;
				for(var i=0; i<data.tasks.length; i++){
					var y = i*step+headHeight;
					R.path(["M0,", y, "L", width, y]).attr({stroke:"#ccc"});
					R.text(12, y+13, data.tasks[i].id);
				}
			}
			//R.rect(10, 10, 100, 100).attr({fill:"red"});
			
			drawGrid();
		}
		
		$(this).html(templates.main(data));
		drawChart($(this), data);
		$(".ganttSlider")
			.mousedown(function(e){
			})
			.mousemove(function(e){
			})
			.mouseup(function(e){
			});
	};
})(jQuery);