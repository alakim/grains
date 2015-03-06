var MockJoomla = (function($, $H){
	
	var templates = {
		inclusion: function(itype, iname, istyle){with($H){
			return div({"class":"inclusion"}, 
				"Inclusion",
				iname?markup(" ", iname):null,
				itype?markup(" of type ", itype):null,
				istyle?markup(" of style ", istyle):null
			);
		}}
	};
	
	function init(){
		var code = $("body").html();
		var reInclusion = /\<jdoc:include(\s+[a-z]+=\"([^\"]+)\")+\s*\>/ig;
		var reAttr = /[a-z]+=\"[^\"]+\"/ig;
		var hcode = code.replace(reInclusion, function(x, y, z, a){
			var itype, iname, istyle;
			var mt = x.match(reAttr);
			$.each(mt, function(i, m){
				var mm = m.match(/([a-z]+)=\"([^\"]+)\"/i);
				var name = mm[1], 
					val = mm[2];
				switch(name){
					case "type": itype=val; break;
					case "name": iname=val; break;
					case "style": istyle=val; break;
					default: break;
				}
			});
			return templates.inclusion(itype, iname, istyle);
		});
		$("body").html(hcode);
	}
	
	
	$(init);
	return {
		
	};
})(jQuery, Html);
