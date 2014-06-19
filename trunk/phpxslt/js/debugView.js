var Debug = (function($, H){
	var debugData;
	
	var templates = {
		main: function(data){with(H){
			return div(
				h2("DEBUG INFO"),
				ul({"class":"debugInfo"},
					apply(data, function(el){
						if(!el) return;
						return li(
							a({href:"?p="+el.id+"&debug"}, el.id, ": ", el.message)
						);
					})
				)
			);
		}}
	};
	
	function rebuild(){
		setTimeout(function(){
			$("#menuPnl").append(templates.main(debugData));
		}, 100);
	}
	
	function DebugDef(data){
		debugData = data;
		rebuild();
	}
	
	return DebugDef;
})(jQuery, Html);