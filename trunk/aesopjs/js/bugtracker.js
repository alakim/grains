define("bugtracker", ["jquery", "html", "aesop"], function($, $H, $A){
	// Тестовое приложение - простой багтрекер.
	// Содержит список ошибок, их описание, и текущее состояние
	
	// Шаблоны для отображения
	var templates = {
		main: function(){with($H){
			return div(
				table({border:1, cellpadding:3, cellspacing:0},
					tr(
						th("ID"),
						th("Time"), 
						th("Title"),
						th("Message"),
						th("State"),
						th()
					),
					apply($A.getClass("Bug").getAll(), function(fc){
						var bug = fc.item,
							fcInc = $A.getFacet(bug, "IncomingBugs"),
							fcAcc = $A.getFacet(bug, "AcceptedBugs"),
							fcFix = $A.getFacet(bug, "FixedBugs"),
							fcCrit = $A.getFacet(bug, "CriticalBugs");
						
						return tr(
							td(bug.id),
							td(bug.time),
							td(
								fcCrit?{style:"color:red;"}:null,
								bug.title
							),
							td(bug.message),
							td(
								fcAcc?("Accepted "+templates.date(fcAcc.accepted))
									:fcFix?("Fixed "+templates.date(fcFix.fixed))
									:null
							),
							td(
								fcInc?div(
										input({type:"button", "class":"btAcc", value:"Accept", itmID:bug.id}),
										" with priority ",
										input({type:"text", id:"tbPriority_"+bug.id})
									)
									:fcAcc?input({type:"button", "class":"btFix", value:"Fix", itmID:bug.id})
									:null
							)
						);
					})
				),
				templates.classes()
			);
		}},
		classes: function(){with($H){
			var names = $A.getClassNames();
			return div({style:"margin-top:25px;"},
				table({border:1, cellpadding:3, cellspacing:0},
					tr(
						th("Class Name"),
						th("Instances Count")
					),
					apply(names, function(nm){
						return tr(
							td(nm),
							td($A.getInstancesCount(nm))
						);
					})
				)
			);
		}},
		date: function(d){
			function addZero(v){return v<10?"0"+v:v;}
			var m = addZero(d.getMinutes()),
				h = addZero(d.getHours()),
				D = addZero(d.getDate()),
				M = addZero(d.getMonth()+1),
				Y = d.getFullYear();
			
			return [
				[Y, M, D].join("-"), 
				[h, m].join(":")
			].join(" ");
		}
	};
	
	// Класс сообщений об ошибках
	function Bug(time, title, message){var _=this;
		_.id = Bug.newID();
		_.time = time;
		_.title = title;
		_.message = message;
		_.fixed = false;
		Bug.index[_.id] = _;
		$A.classify(_);
	}
	$.extend(Bug.prototype, {
		accept: function(priority){
			$A.declassify(this, "IncomingBugs");
			$A.classify(this, "AcceptedBugs", {
				accepted: new Date(),
				priority: priority
			});
			$A.classify(this);
		},
		fix :function(){
			$A.declassify(this, "AcceptedBugs");
			$A.classify(this, "FixedBugs", {fixed: new Date()});
		}
	});
	Bug.index = {};
	Bug.newID = (function(){
		var idx = 0;
		return function(){
			return ++idx;
		}
	})();
	
		
	// Aesop Classes 
	new $A.Class("Bug", 
		function(inst){return inst.constructor == Bug;}
	);
	
	new $A.Class("IncomingBugs",
		function(inst){return !$A.getFacet(inst, "FixedBugs") && !$A.getFacet(inst, "AcceptedBugs");}
	);
	
	new $A.Class("AcceptedBugs",
		function(inst){return inst.accepted;}
	);

	new $A.Class("FixedBugs",
		function(inst){return inst.fixed;}
	);
	
	new $A.Class("CriticalBugs",
		function(inst){
			var fc = $A.getFacet(inst, "AcceptedBugs");
			if(!fc) return false;
			return fc.priority>10;
		}
	);
	
	// Тестовое заполнение списка
	function sampleFill(){
		new Bug(
			"2014.08.04T12:00",
			"Ошибка отображения списка",
			"Список ошибок отображается криво"
		);
		new Bug(
			"2014.08.04T12:30",
			"Не отображается время элементов списка ошибок",
			"Вместо времени - зюки."
		);
	}
	sampleFill();
	
	function viewBugs(){
		$("#out").html(templates.main());
		$("#out .btAcc").click(function(){
			acceptBug($(this).attr("itmID"));
		});
		$("#out .btFix").click(function(){
			fixBug($(this).attr("itmID"));
		});
	}
	
	function acceptBug(id){
		var priority = $("#tbPriority_"+id).val();
		Bug.index[id].accept(+priority);
		viewBugs();
	}
	
	function fixBug(id){
		Bug.index[id].fix();
		viewBugs();
	}
	
	return {
		viewBugs: viewBugs
	};
});