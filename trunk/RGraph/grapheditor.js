var GraphEditor = (function($){
	function build(panel){
		panel.html(Html.div("Simple Graph Editor"));
	}
	
	$.fn.graphEditor = function(){
		$.each($(this), function(i, panel){
			build($(panel));
		});
	}
	
	var __ = {
	};
	return __;
})(jQuery);