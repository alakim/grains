Coollab.Forms = (function($H){
	function editLink(node){with($H){
		return Coollab.UserID==node._.doc.user.id?span(" [", span({"class":"link lnkEdit", "data-node":node._.idx}, "edit"), "]"):null
	}}
	
	return {
		dataSet:{
			view:function(ds, pnl){
				pnl.html((function(){with($H){
					return div(
						h3(ds.name),
						div({"class":"pnlDataSet"},
							span({"class":"link lnkLoad", "data-dsID":ds.dataSetID}, "Загрузить")
						)
					);
				}})())
				.find(".lnkLoad").click(function(){
					var id = $(this).attr("data-dsID");
					Coollab.loadDataSet(id, pnl.find(".pnlDataSet"));
				}).end();
			}
		},
		calendar:{
			view: function(cal, pnl){
				function eventTemplate(evt){with($H){
					var members = Coollab.collectNodes(evt, "appearance").sort(function(m1, m2){
						return m1._.doc.user.name<m2._.doc.user.name?-1:m1._.doc.user.name>m2._.doc.user.name?1:0;
					});
					var myAppearance = Coollab.selectItems(members, function(m){
						return m._.doc.user.id==Coollab.UserID;
					});
					return div({"class":"eventView"},
						evt.date, ": ", evt.name, editLink(evt),
						div(
							"Участники: ",
							ol(
								apply(members, function(m){
									return li(m._.doc.user.name, " ", m.value>0?"придет":m.value<0?"не придет":"не решил", editLink(m));
								})
							),
							myAppearance?null:div(span({"class":"link lnkAddSelf", "data-event":evt.id}, "Добавить себя"))
						)
					);
				}};
				pnl.html((function(){with($H){
					var events = Coollab.collectNodes(cal);
					events = events.sort(function(e1, e2){
						return e1.date>e2.date?1:e1.date<e2.date?-1:0;
					});
					return div({"class":"calView"},
						h3("Календарь: ", cal.name),
						p("Создал ",cal._.doc.user.name, editLink(cal)),
						p("События"),
						ul(
							apply(events, function(evt){
								return li(eventTemplate(evt))
							})
						),
						p(span({"class":"link lnkAddEvent"}, "Добавить событие"))
					);
				}})())
				.find(".eventView .lnkAddSelf").click(function(){
					var evt = Coollab.getNodeByID(cal._.dataSetID, $(this).attr("data-event"));
					Coollab.addNode(evt, "appearance", true);
				}).end()
				.find(".calView .lnkAddEvent").click(function(){
					Coollab.addNode(cal, "event", false);
				}).end();
			},
			editor:function(cal, pnl, onready){
				pnl.html((function(){with($H){
					return div(
						h3("Календарь"),
						div("Название", input({type:"text", "class":"tbName", value:cal.name})),
						div(
							input({type:"button", "class":"btOK", value:"Сохранить"}),
							input({type:"button", "class":"btCancel", value:"Отмена"})
						)
					);
				}})())
				.find(".btOK").click(function(){
					cal.name = pnl.find(".tbName").val();
					if(onready) onready();
					Coollab.acceptChanges(cal._.dataSetID, pnl);
				}).end()
				.find(".btCancel").click(function(){
					Coollab.closeEditor($(this));
				}).end();
			}
		},
		event: {
			editor:function(evt, pnl, onready){
				pnl.html((function(){with($H){
					return div(
						h3("Событие"),
						table(
							tr(td("Дата"), td(input({type:"text", "class":"tbDate", value:evt.date||""}))),
							tr(td("Название"), td(input({type:"text", "class":"tbName", value:evt.name||""})))
						),
						div(
							input({type:"button", "class":"btOK", value:"Сохранить"}),
							input({type:"button", "class":"btCancel", value:"Отмена"})
						)
					);
				}})())
				.find(".btOK").click(function(){
					evt.date = pnl.find(".tbDate").val();
					evt.name = pnl.find(".tbName").val();
					if(onready) onready();
					Coollab.acceptChanges(evt._.dataSetID, pnl);
				}).end()
				.find(".btCancel").click(function(){
					Coollab.closeEditor($(this));
				}).end();
			}
		},
		appearance:{
			editor: function(app, pnl, onready){
				pnl.html((function(){with($H){
					var event = app.trg?Coollab.getNodeByID(app._.dataSetID, app.trg)
						:app._.parent;
					return div(
						h3("Участие в событии"),
						p(event.date, " ", event.name),
						div(select({"class":"selApp"},
							option({value:"0"}, app.value==0?{selected:true}:null, "не знаю"),
							option({value:"1"}, app.value>0?{selected:true}:null, "приду"),
							option({value:"-1"}, app.value<0?{selected:true}:null, "не приду")
						)),
						div(
							input({type:"button", "class":"btOK", value:"Сохранить"}),
							input({type:"button", "class":"btCancel", value:"Отмена"})
						)
					);
				}})())
				.find(".btOK").click(function(){
					app.value = +pnl.find(".selApp").val();
					if(onready) onready();
					Coollab.acceptChanges(app._.dataSetID, pnl);
				}).end()
				.find(".btCancel").click(function(){
					Coollab.closeEditor($(this));
				}).end();
			}
		},
		forum:{
			view:function(forum, pnl){
				pnl.html((function(){with($H){
					return div({"class":"forumPnl"},
						h3(forum.name),
						apply(forum.nodes, function(nd){
							// return Coollab.Forms[nd.type].view.template(nd);
							return div({"class":"forumItem", "data-idx":nd._.idx});
						})
					);
				}})())
				.find(".forumPnl .forumItem").each(function(i, itmPnl){itmPnl=$(itmPnl);
					var el = Coollab.getNodeByIdx(forum._.dataSetID, itmPnl.attr("data-idx"));
					Coollab.Forms[el.type].view(el, itmPnl);
				}).end();
			}
		},
		topic:{
			view:function(tpc, pnl){
				pnl.html((function(){with($H){
					var messages = Coollab.collectNodes(tpc).sort(function(m1, m2){
						return m1.date<m2.date?-1:m1.date>m2.date?1:0;
					});
					return div({"class":"topic"},
						div(tpc.name),
						apply(messages, function(msg){
							return div({"class":"message"},
								span({"class":"userLbl"}, msg._.doc.user.name, " [", msg.date, "]: "), msg.text, editLink(msg)
							);
						}),
						div(span({"class":"link lnkAddMessage"}, "Добавить сообщение"))
					);
				}})())
				.find(".topic .lnkAddMessage").click(function(){
					//var evt = Coollab.getNodeByID(cal._.dataSetID, $(this).attr("data-event"));
					Coollab.addNode(tpc, "message", true);
				}).end();
			}
		},
		message:{
			editor:function(msg, pnl, onready){
				pnl.html((function(){with($H){
					return div(
						h3("Сообщение"),
						div(textarea({"class":"tbText"}, msg.text)),
						div(
							input({type:"button", "class":"btOK", value:"Сохранить"}),
							input({type:"button", "class":"btCancel", value:"Отмена"})
						)
					);
				}})())
				.find(".btOK").click(function(){
					msg.text = pnl.find(".tbText").val();
					if(onready) onready();
					Coollab.acceptChanges(msg._.dataSetID, pnl);
				}).end()
				.find(".btCancel").click(function(){
					Coollab.closeEditor($(this));
				}).end();
			}
		}
	};
})(Html);
