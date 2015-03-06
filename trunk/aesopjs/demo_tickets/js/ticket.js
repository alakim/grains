define(["jquery", "html", "aesop"], function($, $H, $A){
	var instCounter = 1;
	
	new $A.Class("Ticket",
		function(inst){
			return inst.ticketID!=null;
		},
		function(){
			this.ticketID = instCounter++;
			this.view = function(){return templates.mainList(this)};
		}
	);

	var templates = {
		mainList: function(itm){with($H){
			return markup(
				"Ticket #",
				itm.ticketID
			);
		}}
	};

	return {};
});