define(["jquery", "html", "aesop"], function($, $H, $A){
	
	var templates = {
		main: function(){with($H){
			var classes = $A.getClassNames();
			return div(
				table({border:1, cellpadding:3, cellspacing:0},
					tr(
						th("Class Name"),
						th("Parent Class"),
						th("Subclasses Count"),
						th("Instances Count")
					),
					apply(classes, function(clsNm){
						var cls = $A.getClass(clsNm);
						return tr(
							td(clsNm),
							td(cls.parentName),
							td(cls.subclasses.length),
							td($A.getInstancesCount(clsNm))
						);
					})
				)
			);
		}}
	};
	
	return {
		view: function(pnlID){
			$("#"+pnlID).html(templates.main());
		}
	};
});