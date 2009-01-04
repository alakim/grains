function Process(F, next){
	this.F = F;
	Process.registerInstance(this, next);
}

function Synchronization(next){
	Process.registerInstance(this, next);
}

(function(){
	function extend(o,s){for(var k in s)o[k] = s[k];}
	
	Process.prototype = {
		pid:null,
		F:null,
		next:null,
		
		start: function(){var _=this;
			window.setTimeout(function(){_.F(); _.oncomplete()}, 10);
		},
		
		oncomplete: function(){var _=this;
			Process.instances[_.pid] = null;
			
			if(!_.next)
				return;
			switch(typeof(_.next)){
				case "function": _.next(_.pid); break;
				case "object":
					if(typeof(_.next.start)=="function")
						_.next.start(_.pid);
					else if(typeof(_.next.run)=="function")
						_.next.run(_.pid);
					else
						throw "Runnable object expected";
					break;
				case "string": (new Function(_.next))(_.pid); break;
			};
		}
	};
	
	extend(Process, {
		instances:[],
		getInstance: function(idx){return Process.instances[idx];},
		registerInstance: function(inst, next){var _=inst;
			Process.instances.push(_);
			_.pid = Process.instances.length;
			_.next = next;
			if(next && next.registerParent)
				next.registerParent(_);
		}
	});
	
	Synchronization.prototype = {
		processes:[],
		pid:null,
		next:null,
		
		registerParent: function(proc){var _=this;
			_.processes.push(proc.pid);
		},
		
		start: function(parentID){var _=this;
			var uncompleted = false;
			for(var i=0; i<_.processes.length; i++){var p = _.processes[i];
				if(p==parentID)
					_.processes[i] = 0;
				else if(p>0)
					uncompleted = true;
			}
			if(!uncompleted)
				_.next(_.pid);
		}
	};
})();
