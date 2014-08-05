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
						th("Fixed")
					),
					apply($A.getClass("Bug").getAll(), function(fc){
						var bug = fc.item;
						return tr(
							td(bug.id),
							td(bug.time),
							td(bug.title),
							td(bug.message),
							td(bug.fixed)
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
		}}
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
	Bug.prototype.fix = function(){
		this.fixed = true;
		$A.classify(this);
	};
	Bug.index = {};
	Bug.newID = (function(){
		var idx = 0;
		return function(){
			return ++idx;
		}
	})();
	
		
	// Aesop Classes 
	new $A.Class("Bug", function(inst){
		return inst.constructor == Bug;
	});
	
	new $A.Class("Fixed Bugs", function(inst){
		return inst.fixed;
	});
	
	new $A.Class("Bugs to fix", function(inst){
		return !inst.fixed;
	});

	
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
	
	
	return {
		viewBugs: function(){
			$("#out").html(templates.main());
		},
		fixBug: function(id){
			Bug.index[id].fix();
			this.viewBugs();
		}
	};
});