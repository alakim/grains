Coollab.Templates = (function($H){
	return {
		calendar: function(cal){with($H){
			return div(
				h3("Календарь"),
				p("Создал User#",cal._doc.user.id, ", ",cal._doc.user.name),
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
							return li("User#", m._doc.user.id, ", ", m._doc.user.name, " ", m.value?"+":"-");
						})
					)
				)
			);
		}}
	};
})(Html);