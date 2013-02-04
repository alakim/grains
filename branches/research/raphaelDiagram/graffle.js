Raphael.fn.connection = function (obj1, obj2, line, bg, directed) {
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
        {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
        {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
        {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
        {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
        {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
        {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
        {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
        d = {}, dis = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
	
	function getMarkPos(conn){
		return conn.getPointAtLength(conn.getTotalLength()*3/4);
	}
	
    if (line && line.line) {
        line.bg && line.bg.attr({path: path});
        line.line.attr({path: path});
		if(line.mark){
			var pos = getMarkPos(line.line);
			//line.mark.attr({cx:pos.x, cy:pos.y});
			line.mark.reshape(line.line);
		}
    } else {
        var color = typeof line == "string" ? line : "#000";
		var pp = this.path(path).attr({stroke: color, fill: "none"});
		var markPos = getMarkPos(pp);
        var res = {
            bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
            line: pp,
            from: obj1,
            to: obj2
        };
		if(directed){
			var w = res.line.attr("stroke-width") || res.bg && res.bg.attr("stroke-width") || 3;
			// res.mark = this.circle(markPos.x, markPos.y, w).attr({fill:res.line.attr("stroke")});
			res.mark = this.EndArrow(res.line, w, w, "#f00", "#f00", 0.2);
		}
		return res;
    }
};

var Graffle = (function(){
	function init(r, shapes, connections) {
		function dragger(){var _=this;
			_.ox = _.type=="rect" || _.type=="text" || _.type=="set" ? _.attr("x") : _.attr("cx");
			_.oy = _.type=="rect" || _.type=="text" || _.type=="set"?_.attr("y"):_.attr("cy");
		}
		var ddx = 0, ddy = 0;
		
		function move(dx, dy){
			var _ = this;
			if(_.set!=null){
				var st = sets[_.set];
				st.translate(dx-ddx, dy-ddy);
				ddx = dx; ddy = dy;
			}
			else{
				var att = _.type == "rect" ? {x: _.ox + dx, y: _.oy + dy} 
					: _.type == "text"?{x: _.ox + dx, y: _.oy + dy} 
					: {cx: _.ox + dx, cy: _.oy + dy};
				_.attr(att);
			}
			for (var i = connections.length; i--;) 
				r.connection(connections[i]);
			
			r.safari();
		}
		function up(){
			ddx = 0;
			ddy = 0;
		}
		
		var sets = [];
		
		for (var i = 0; i < shapes.length; i++) {
			var shp = shapes[i];
			if(shp.type!="set" && shp.type!="text"){
				if(shp.attr("fill")=="none") shp.attr({fill:__.defaultFill});
				if(shp.attr("stroke")=="#000") shp.attr({stroke:__.defaultStroke});
			}
			shp.attr({cursor: "move"});
			if(shp.type=="set"){
				for(var j=0; j<shp.items.length; j++){
					shp.items[j].set = sets.length;
				}
				sets.push(shp);
			}
			shp.drag(move, dragger, up);
		}
	};
	
	var __ = function(canvas, nodes, connections){
		init(canvas, nodes, connections);
	};
	
	__.defaultFill = "#eee";
	__.defaultStroke = "#888";
	
	return __;
})();




