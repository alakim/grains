if(typeof($)!="function") alert("jquery.js module required!");
if(typeof(Raphael)!="function") alert("raphael.js module required!");

var CrlMatrix = (function(){
	function extend(o,s){for(var k in s){o[k]=s[k];}}
	
	function ColorTable(data){var _=this;
		_.data = data;
		_.maxV = data[0].v;
		_.minV = data[0].v;
		for(var i=0; i<data.length; i++){
			var v = data[i].v;
			if(_.maxV<v)_.maxV = v;
			if(_.minV>v)_.minV = v;
		}
	}
	ColorTable.prototype = {
		palette:[
			"#0a0", "#00a", "#00f",
			"#a00", "#f00"
		],
		getColor: function(v){var _=this;
			var step = (_.maxV - _.minV)/(_.palette.length-1);
			var idx = Math.floor((v - _.minV)/step);
			return _.palette[idx];
		}
	};
	
	function Grid(data){var _=this;
		_.data = data;
		_.x = {min:data[0].x, max:data[0].x};
		_.y = {min:data[0].y, max:data[0].y};
		for(var i=0; i<data.length; i++){
			var d = data[i];
			if(_.x.min>d.x)_.x.min = d.x;
			if(_.x.max<d.x)_.x.max = d.x;
			if(_.y.min>d.y)_.y.min = d.y;
			if(_.y.max<d.y)_.y.max = d.y;
		}
	}
	Grid.prototype = {
		step:10,
		setSize: function(size){var _=this;
			_.size = size;
			
		},
		getPos: function(dataItem){var _=this;
			
		}
	};
	
	function __(pnlID, data){var _=this;
		_.pnlID = pnlID;
		_.data = data;
		_.idx = instances.length;
		_.colorTable = new ColorTable(data);
		_.grid = new Grid(data);
		instances.push(_);
	}
	
	
	
	var instances = [];
	
	var templates = {
		grid: function(matrix){var _=matrix;
			var step = 10;
			var style = {"stroke-width":1, stroke:"#ccc"};
			_.r.rect(0, 0, _.size.w, _.size.h).attr({
				fill:"#fff",
				stroke:"#888"
			});
			
			for(var i=0; i<_.size.h/step; i++){
				var pth = ["M0,", i*step, "L"+ _.size.w, ",", i*step].join("");
				_.r.path(pth).attr(style);
			}
			for(var i=0; i<_.size.w/step; i++){
				var pth = ["M", i*step, ",0L", i*step, ",", _.size.h].join("");
				_.r.path(pth).attr(style);
			}
		},
		
		main: function(matrix){var _=matrix;
			templates.grid(_);
			
			$.each(_.data, function(i, d){
				_.r.circle(d.x, d.y, 3).attr({
					fill:_.colorTable.getColor(d.v), "stroke-width":0
				});
			});
		}
	};
	
	__.prototype = {
		build: function(){var _=this;
			var pnl = $("#"+_.pnlID);
			var size = {w:pnl.width(), h:pnl.height()};
			_.grid.setSize(size);
			var r = Raphael(pnl[0], size.w, size.h);
			extend(_,{
				size: size,
				r: r
			});
			templates.main(_);
		}
	};
	
	function init(){
		$.each(instances, function(i, inst){
			inst.build();
		});
	}
	
	$(init);
	return __;
})();