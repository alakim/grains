if(typeof(Html)!="object") alert("Module html.js required!");

function AsyncTest(title, processPanelID, steps){var _=this;
	_.title = title;
	_.steps = steps;
	_.processPanelID = processPanelID;
}

AsyncTest.version = "1.1.217";

(function(){
	function $(id){return document.getElementById(id);}
	
	var __=AsyncTest;
	
	function Log(){
		this.messages = [];
	}
	
	Log.prototype = {
		log:function(msgType, msg){
			this.messages.push({type:msgType, message:msg});
		},
		
		clear: function(){this.messages = [];},
		
		render: function(){with(Html){var _=this;
			return div(ol(
				apply(_.messages, function(msg, i){
					var color = msg.type.match(/fail(ure|ed)/i)?"red":"green";
					return li(span({style:"font-weight:bold; color:"+color+";"}, msg.type), msg.message&&msg.message.length?": ":" ", msg.message);
				})
			));
		}}
	};
	
	function ProcessDisplay(panelID, test){var _=this;
		_.panelID = panelID;
		_.test = test;
		_.id = ProcessDisplay.instances.length;
		ProcessDisplay.instances.push(_);
	}
	
	ProcessDisplay.instances = [];
	
	ProcessDisplay.prototype = {
		init: function(){var _=this;
			_.buildDisplay();
		},
		
		stepID: function(nr){
			return "ATstDisplay"+this.id+"_"+nr;
		},
		
		displayBegin: function(stepNr){var _=this;
			var pnl = $(_.stepID(stepNr));
			if(!pnl) return;
			pnl.style.backgroundColor = "#00ffff";
		},
		
		displayEnd: function(stepNr, success){var _=this;
			var pnl = $(_.stepID(stepNr));
			if(!pnl) return;
			pnl.style.backgroundColor = !success?"#ff0000":"#00ff00";
		},
		
		displayLog: function(content){var _=this;
			$("ATstDisplayResults"+_.id).innerHTML = content;
		},
		
		buildDisplay: function(){with(Html){var _=this;
			var pnl = $(_.panelID);
			pnl.innerHTML = div({style:"border:1px solid #888888; margin:5px; padding:5px;"},
				h2(_.test.title),
				table({border:1, cellpadding:5, cellspacing:0}, tr(
					apply(_.test.steps, function(s, i){
						return td(div({
							style:"margin:0px; padding:5px;",
							id:_.stepID(i),
							style:"background-color:#cccccc;"
						}, i+1));
					})
				)),
				div({id:"ATstDisplayResults"+_.id})
			);
		}}
	};
	
	__.prototype = {
		curStep:0,
		log:null,
		steps:null,
		display:null,
		
		reset: function(){var _=this
			_.curStep = 0;
			if(!_.log) _.log = new Log(); else _.log.clear();
			if(!_.display) _.display = new ProcessDisplay(_.processPanelID, _);
			_.display.init();
		},
		run: function(){this.reset(); this.goOn();},
		
		goOn: function(success){var _=this;
			success = success!=null?success:true;
			_.display.displayEnd(_.curStep-1, success);
			this.doStep();
		},
		
		doStep: function(){var _=this;
			_.display.displayBegin(_.curStep);
			var action = _.steps[_.curStep];
			_.curStep++;
			if(action) 
				action(); 
			else {
				_.display.displayLog(_.log.render());
				_.onEnd();
			}
		},
		
		assert: function(val, expected){var _=this;
			var error = val!=expected;
			if(error)
				_.log.log("Assertion Failed", Html.format("Expected {1}, but was {0}", val, expected));
			else
				_.log.log("OK");
			_.goOn(!error);
		},
		
		onEnd: function(){
		}
	};
})();
