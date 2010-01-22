// Оболочка для тестирования
var FlowTest = {
	version: "1.0.282",
	panelID: "FlowTestPanel"
};

(function(){
	var __ = FlowTest;
	
	function $(id){return document.getElementById(id);}
	
	function write(msg){
		$(__.panelID).innerHTML+=msg+"<br>";
	}
	
	function extend(o,s){for(var k in s)o[k]=s[k];}
	
	function each(coll, F){
		if(!coll) return;
		if(typeof(coll.length)=="undefined" || typeof(coll.length)!="number")
			for(var k in coll) F(coll[k], k);
		else
			for(var i=0; i<coll.length; i++) F(coll[i], i);
	}
	
	function contains(coll, el){
		for(var i=0; i<coll.length; i++){
			if(coll[i]==el) return true;
		}
		return false;
	}
	
	var testIdCounter = 1;
	
	function TestLog(test){var _=this;
		_.log = new JSFlow.Log();
		_.test = test;
	}
	
	TestLog.prototype = {
		cellID: function(el){var _=this;
			return ["LogCell",_.test.id, el.$SeqID()].join("_");
		},
		
		logBegin: function(el){var _=this;
			var cell = $(_.cellID(el));
			if(cell) cell.style.backgroundColor = "#ffff00";
		},
		
		logEnd: function(el){var _=this;
			var cell = $(_.cellID(el));
			var color = el.result=="OK"?"00ff00":el.result=="Failure"?"ff0000":"eeeeee";
			if(cell) cell.style.backgroundColor = "#"+color;			
		},
		
		init: function(){with(Html){var _=this;
			extend(_.log, {
				logBegin: function(el){_.logBegin(el);},
				logEnd: function(el){_.logEnd(el);}
			});
			_.log.connect(_.test.sequence);
			
			function testViewTemplate(elem){with(Html){
				return table({border:1, cellpadding:3, cellspacing:0}, tr(
					apply(elem.elements, function(el, i){
						return td({id:_.cellID(el), align:"center"},
							i+1,
							el.elements.length>1?div(
								testViewTemplate(el)
							):null
						);
					})
				));
			}}
			
			$(__.panelID).innerHTML += div(
				p({style:"font-weight:bold;"}, _.test.id, ". ", _.test.title),
				testViewTemplate(_.test.sequence)
			);
		}}
	};
	
	
	function TestSet(){
		this.tests = [];
	}
	
	TestSet.prototype = {
		addTest: function(t){
			this.tests.push(t);
		},
		
		run: function(){with(JSFlow){var _=this;
			var command = document.location.hash.substr(1);
			var cmdType = command[0];
			var numbers = command.substr(1).split(",");
			
			var steps = [];
			each(_.tests, function(t, i){
				switch(cmdType){
					case "+": if(contains(numbers, i+1))steps.push(t.sequence); break;
					case "-": if(!contains(numbers, i+1))steps.push(t.sequence); break;
					default: steps.push(t.sequence); break;
				}
			});

			var sq = sequence(steps); // перед инициализацией логов
			each(_.tests, function(t){t.log.init();});
			sq.run(); // только после инициализации логов
		}}
	};
	
	var testSet = new TestSet();
	
	extend(__,{
		assert: function(x, expected, el){
			var failure = x!=expected;
			if(failure) write(["Assertion failed within ", el.$SeqID().replace(/^1\./, ""),": expected ", expected, ", but was ", x].join(""));
			el.result = failure?"Failure":"OK";
		},

		Test: function(title, sequence){var _=this;
			_.title = title;
			_.sequence = sequence;
			testSet.addTest(_);
			_.log = new TestLog(_);
			_.id = testIdCounter++;
		},
		
		runAll: function(){
			testSet.run();
		}
	});
	
	__.Test.prototype = {
		run: function(){
			this.sequence.run();
		}
	};
	
})();
