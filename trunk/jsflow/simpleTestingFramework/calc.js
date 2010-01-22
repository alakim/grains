// Объект тестирования - калькулятор

function Calc(){
}

(function(){
	Calc.prototype = {
		delay: 800,
		
		add: function(x, y, onready){var _=this;
			var res = x+y;
			window.setTimeout(function(){onready(res);}, _.delay);
		},
		
		sub: function(x, y, onready){var _=this;
			var res = x-y;
			window.setTimeout(function(){onready(res);}, _.delay);
		},
		
		mul: function(x, y, onready){var _=this;
			var res = x*y;
			window.setTimeout(function(){onready(res);}, _.delay);
		},
		
		div: function(x, y, onready){var _=this;
			var res = x/y;
			window.setTimeout(function(){onready(res);}, _.delay);
		}
	};
})();
