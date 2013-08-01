(function($,H){
	var templates = {
		main: function(topLevel){with(H){
			return div(
				apply(topLevel, function(itm, idx){
					return templates.menuItem(itm, idx);
				})
			);
		}},
		menuItem: function(itm, idx){with(H){
			var ref = $(itm).find("a")[0];
			ref = $(ref);
			return span({"class":"topLevel"},
				a({href:ref.attr("href"), menuIdx:idx},
					ref.text()
				)
			);
		}},
		subPanel:function(level, idx){with(H){
			return div({"class":"subPanel", menuIdx:idx},
				apply(level, function(itm){
					
				})
			);
		}}
	};
	
	function getSubLevel(itm){
		return $(itm).find("ul:eq(0)>li");
	}
	
	function getTopLevel(pnl){
		return pnl.find("ul.nav>li");
	}
	
	function buildMenu(pnl){
		pnl.show();
		var topLevel = getTopLevel(pnl);
		topLevel.each(function(i, itm){
			var sub = getSubLevel(itm);
			//console.log(sub.toArray());
		});
		pnl.html(templates.main(topLevel));
	}
	
	$.fn.HMenu = function(){
		$(this).each(function(i, el){
			buildMenu($(el));
		});
	};
})(jQuery, Html);
