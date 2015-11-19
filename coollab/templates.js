Coollab.Templates = (function($H){
	return {
		calendar: function(cal){with($H){
			return div(
				h3("Календарь"),
				p("Создал User#",cal._.doc.user.id, ", ",cal._.doc.user.name, Coollab.UserID==cal._.doc.user.id?span(" [", span({"class":"link lnkEdit", "data-node":cal._.idx}, "edit"), "]"):null),
				p("События"),
				ul(
					apply(Coollab.collectNodes(cal), function(evt){
						return li(Coollab.Templates.event(evt))
					})
				)
			);
		}},
		event: function(evt){with($H){
			return markup(
				evt.date, ": ", evt.name,
				div(
					"Участники: ",
					ol(
						apply(Coollab.collectNodes(evt), function(m){
							return li("User#", m._.doc.user.id, ", ", m._.doc.user.name, " ", m.value?"+":"-", Coollab.UserID==m._.doc.user.id?span(" [", span({"class":"link lnkEdit", "data-node":m._.idx}, "edit"), "]"):null);
						})
					)
				)
			);
		}}
	};
})(Html);