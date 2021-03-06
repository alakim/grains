﻿define(["jquery", "html", "aesop"], function($, $H, $A){
	var instCounter = 1;
	var ticket, curClass;
	
	new $A.Class("Ticket",
		function(inst){
			return inst.ticketID!=null;
		},
		function(inst){
			inst.ticketID = instCounter++;
			inst.view = function(panel){
				function template(itm){with($H){
					return div(
						h2("Ticket #", itm.ticketID),
						p("Выберите категорию:"),
						ul(
							li({"class":"link catLink", catID:"consult"}, "Консультирование"),
							li({"class":"link catLink", catID:"getAccess"}, "Предоставление доступа")
						)
					);
				}}
				panel.html(template(this));
				panel.find(".catLink").click(function(){
					var catID = $(this).attr("catID");
					curClass = catID=="consult"?"ConsultationTicket"
						:"AccessTicket";
					$A.classify(inst, curClass); 
					var fc = $A.getFacet(inst, curClass).item()
					fc.view(panel);
				})
			};
		}
	);
	
	new $A.Class("ConsultationTicket", "Ticket",
		null,
		function(inst){
			console.log("inst", inst);
			inst.view = function(panel){
				function template(itm){with($H){
					return div(
						h2("Заявка на консультирование #", $A.getFacet(itm, "Ticket").item().ticketID),
						div(input({type:"button", "class":"btBack", value:"Назад"}))
					);
				}}
				panel.html(template(this));
				panel.find(".btBack").click(function(){
					$A.declassify(inst, curClass);
					var fc = $A.getFacet(inst, "Ticket").item();
					console.log(fc);
					fc.view(panel);
				});
			}
		}
	);
	
	new $A.Class("AccessTicket", "Ticket",
		null,
		function(inst){
			inst.view = function(panel){
				function template(itm){with($H){
					return div(
						h2("Заявка на предоставление доступа #", $A.getFacet(itm, "Ticket").item().ticketID),
						div(input({type:"button", "class":"btBack", value:"Назад"}))
					);
				}}
				panel.html(template(this));
				panel.find(".btBack").click(function(){
					$A.declassify(inst, curClass);
					$A.getFacet(inst, "Ticket").item().view(panel);
				});
			}
		}
	);

	return {
		create: function(){
			ticket = {};
			$A.classify(ticket, "Ticket");
			return ticket;
		}
	};
});