(function($,H){
	var defaultColumnWidth = 80;
	var rowHeight = 50;
	
	var templates = {
		table: function(srcTbl, columns){with(Html){
			return markup(
				div({"class":"vAccordionTable"},
					apply(srcTbl.find("tr"), function(row, i){row=$(row);
						return templates.row(row, i, columns);
					})
				),
				div({style:"clear:both;"})
			);
		}},
		row: function(row, rowIdx, columns){with(Html){
			return markup(
				div({"class":"row", rowIdx:rowIdx},
					apply(row.find("*"), function(cell, colIdx){cell=$(cell);
						var cellStyle = {
							width: !columns[colIdx]? defaultColumnWidth
								:columns[colIdx] instanceof Array? columns[colIdx][0] 
								: columns[colIdx],
							height: rowHeight
						};
						var classes = ["cell"];
						if(rowIdx==0) classes.push("top");
						if(colIdx==0) classes.push("left");
						if(cell[0].tagName.toUpperCase()=="TH"){
							classes.push("header");
							cellStyle.height = rowHeight/2;
						}
						if(columns[colIdx] instanceof Array)
							classes.push("dynamic");
						var rowSpan = cell.attr("rowSpan");
						rowSpan = rowSpan?parseInt(rowSpan):1;
						cellStyle.height = cellStyle.height*rowSpan;
						
						return div({"class":classes.join(" "), cellIdx:colIdx, rowIdx:rowIdx, style:style(cellStyle)}, cell.text());
					})
				),
				div({style:"clear:left;"})
			);
		}}
	};
	
	function buildItem(el, columns){
		var container =$(H.div()); el.after(container);
		container.html(templates.table(el, columns));
		el.hide();
		
		var expandedColumn = -1;
		var colToExpand = -1;
		if(window.navigator.userAgent.match(/compatible;\s+MSIE/)){
			$(".vAccordionTable .cell").each(function(i,c){c=$(c); //IE workaraund
				c.animate({width:c.width()});
			});
		}
		
		$(".vAccordionTable .cell")
			.mouseover(function(){var _=$(this);
				var colIdx = parseInt(_.attr("cellIdx"));
				if(!(columns[colIdx] instanceof Array)) return;

				if(colIdx==expandedColumn) return;
				if(colIdx==colToExpand) return;
				colToExpand = colIdx;
				
				if(expandedColumn>=0){
					_.parent().parent().find(".cell[cellIdx="+expandedColumn+"]")
						.animate({width:columns[colIdx][0]});
				}
				
				_.parent().parent().find(".cell[cellIdx="+colIdx+"]")
					.animate({width:columns[colIdx][1]}, function(){
						colToExpand = -1;
						expandedColumn = colIdx;
					});
			});
	}
	
	$.fn.vAccordion = function(columns){
		$(this).each(function(i, el){
			buildItem($(el), columns);
		});
	};
	
})(jQuery, Html);