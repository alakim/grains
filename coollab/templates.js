Coollab.Templates = (function($H){
	return {
		editLink: function(node){with($H){
			return Coollab.UserID==node._.doc.user.id?span(" [", span({"class":"link lnkEdit", "data-node":node._.idx}, "edit"), "]"):null
		}},
		calendar: {
			view:function(cal){with($H){
				return div({"class":"calView"},
					h3("Календарь: ", cal.name),
					p("Создал User#",cal._.doc.user.id, ", ",cal._.doc.user.name, Coollab.Templates.editLink(cal)),
					p("События"),
					ul(
						apply(Coollab.collectNodes(cal), function(evt){
							return li(Coollab.Templates.event.view(evt))
						})
					),
					p(span({"class":"link lnkAddEvent"}, "Добавить событие"))
				);
			}},
			viewEvents: function(cal, pnl){
				pnl.find(".calView .lnkAddEvent").click(function(){
					//alert("Add Event to "+cal.name);
					Coollab.addNode(cal, "event");
				}).end();
			},
			editor:function(cal, pnl){
				pnl.html((function(){with($H){
					return div(
						h3("Календарь"),
						div("Название", input({type:"text", "class":"tbName", value:cal.name})),
						div(input({type:"button", "class":"btOK", value:"Сохранить"}))
					);
				}})())
				.find(".btOK").click(function(){
					cal.name = pnl.find(".tbName").val();
					Coollab.acceptChanges();
				}).end();
			}
		},
		event: {
			view: function(evt){with($H){
				return markup(
					evt.date, ": ", evt.name, Coollab.Templates.editLink(evt),
					div(
						"Участники: ",
						ol(
							apply(Coollab.collectNodes(evt), function(m){
								return li(m._.doc.user.name, " ", m.value>0?"придет":m.value<0?"не придет":"не решил", Coollab.Templates.editLink(m));
							})
						)
					)
				);
			}},
			editor:function(evt, pnl){
				pnl.html((function(){with($H){
					return div(
						h3("Событие"),
						div("Название", input({type:"text", "class":"tbName", value:evt.name})),
						div(input({type:"button", "class":"btOK", value:"Сохранить"}))
					);
				}})())
				.find(".btOK").click(function(){
					evt.name = pnl.find(".tbName").val();
					Coollab.acceptChanges();
				}).end();
			}
		},
		appearance:{
			editor: function(app, pnl){
				pnl.html((function(){with($H){
					var event = Coollab.getNode(app.trg);
					return div(
						h3("Участие в событии"),
						p(event.date, " ", event.name),
						div(select({"class":"selApp"},
							option({value:"0"}, app.value==0?{selected:true}:null, "не знаю"),
							option({value:"1"}, app.value>0?{selected:true}:null, "приду"),
							option({value:"-1"}, app.value<0?{selected:true}:null, "не приду")
						)),
						div(input({type:"button", "class":"btOK", value:"Сохранить"}))
					);
				}})())
				.find(".btOK").click(function(){
					app.value = +pnl.find(".selApp").val();
					Coollab.acceptChanges();
				}).end();
			}
		}
	};
})(Html);
