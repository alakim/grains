var TimelineEditor = (function($, $H, $R){
	
	
	function init(pnl){pnl=$(pnl);
		pnl.html(function(){with($H){
			return div(
				"Timeline Editor "
			);
		}});
	}
	
	
	
	return {
		init:init
	};
})(jQuery, Html, Raphael);