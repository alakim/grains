// Оболочка для тестирования
var FlowTest = {
	version: "1.2.287",
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
	
	function formatHtml(str){
		return str.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/\'/g, "&apos;");
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
			var selectedTests = [];
			each(_.tests, function(t, i){
				switch(cmdType){
					case "+": if(contains(numbers, i+1)){
							steps.push(t.sequence);
							selectedTests.push(t);
						}
						break;
					case "-": if(!contains(numbers, i+1)){
							steps.push(t.sequence); 
							selectedTests.push(t);
						}
						break;
					default: 
						steps.push(t.sequence);
						selectedTests.push(t);
						break;
				}
			});

			var sq = sequence(steps); // перед инициализацией логов
			each(selectedTests, function(t){t.log.init();});
			sq.run(); // только после инициализации логов
		}}
	};
	
	function json(o){
		if(o==null) return 'null';
		if(typeof(o)=="string") return "'"+o.replace(/\"/g, "\\\"")+"'";
		if(typeof(o)=="boolean") return o.toString();
		if(typeof(o)=="number") return o.toString();
		if(typeof(o)=="function") return "";
		if(typeof(o.length)!="undefined"){
			var res = [];
			for(var i=0; i<o.length; i++) res.push(json(o[i]));
			return "["+res.join(",")+"]";
		}
		if(typeof(o)=="object"){
			var res = [];
			for(var k in o) res.push(k+":"+json(o[k]));
			return "{"+res.join(",")+"}";
		}
		return "";
	}
	
	function compare(x, y){ // сравнение произвольных объектов
		if(x==null && y==null)
			return true;
		if((typeof(x)=="function" && typeof(y)=="undefined") || (typeof(y)=="function" && typeof(x)=="undefined"))// Это случай для работы с макетами - метод макета может быть не определен (соответствующее ожидание не запрограммировано), но ссылка на него передается среди аргументов вызова другого метода
			return true; 
		if((x==null && y!=null)||(x!=null && y==null))
			return false
		
		if((typeof(x)=="function" && Object.getTypeName(y)=="JSUnit.CallbackMarker") || (typeof(y)=="function" && Object.getTypeName(x)=="JSUnit.CallbackMarker") )
			return true; 
		if(typeof(x)!=typeof(y))
			return false;
		if(typeof(x)=="string") return x==y;
		if(typeof(x)=="number") return x==y;
		if(typeof(x)=="boolean") return x==y;
		if(typeof(x)=="function" && typeof(y)=="function")
			return true; // методы объектов при сравнении не учитываются
			
		if(typeof(x.length)!="undefined"){
			if(x.length!=y.length){
				return false;
			}
			for(var i=0; i<x.length; i++){
				if(!compare(x[i], y[i])){
					return false;
				}
			}
			return true;
		}
		if(typeof(x)=="object"){
			for(var k in x){
				if(!compare(x[k], y[k]))
					return false;
			}
			return true;
		}
		
		return x==y;
	}
	
	var testSet = new TestSet();
	
	extend(__,{
		assert: function(x, expected, el, message){
			message = message||"";
			if(!el.result) el.result = "OK";
			var failure = !compare(x, expected);
			if(failure) write(["Assertion failed within ", el.$SeqID().replace(/^1\./, ""),
				": ",
				message,
				" expected ", formatHtml(json(expected)), 
				", but was ", formatHtml(json(x))
			].join(""));
			if(failure) el.result = "Failure";
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
