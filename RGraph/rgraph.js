(function($,R){
	var pixelShift = .5;
	
	function getMaxVal(rows){
		var maxX = 0;
		var maxY = 0;
		$.each(rows, function(i, row){
			$.each(row, function(j, pair){
				if(typeof(pair[0])=="number" && maxX<pair[0]) maxX = pair[0];
				if(typeof(pair[1])=="number" && maxY<pair[1]) maxY = pair[1];
			});
		});
		return {x:maxX, y:maxY};
	}
	
	function table(data){with(Html){
		return table({border:1, cellspacing:0, cellpadding:3},
			tr(
				th("X"),
				apply(data, function(d){
					return td(d[0]);
				})
			),
			times(getRowCount(data), function(rNr){
				return tr(
					th("Y"+rNr),
					apply(data, function(d){
						return td(d[rNr]);
					})
				)
			})
		);
	}}
	
	R.fn.drawGrid = function (x, y, w, h, xStep, yStep, color) {
		color = color || "#000";
		var s = pixelShift;
		var txtStyle = {font: '12px Helvetica, Arial', fill: "#888"};
		var path = [];
		var wv = w/xStep, hv = h/yStep,
			rowHeight = h / hv, columnWidth = w / wv;
		for (var i = 0; i <= hv; i++) {
			path = path.concat([
				"M", Math.round(x) + s, Math.round(y + i * rowHeight) + s,
				"H", Math.round(x + w) + s
			]);
			this.text(Math.round(x/2) + s, Math.round(6 + i * rowHeight) + s + 12, hv-i).attr(txtStyle).toBack();
		}
		for (i = 0; i <= wv; i++) {
			path = path.concat([
				"M", Math.round(x + i * columnWidth) + s, Math.round(y) + s,
				"V", Math.round(y + h) + s
			]);
			this.text(Math.round(x + i * columnWidth) + s, y+h + 12, i).attr(txtStyle).toBack();
		}
		return this.path(path.join(",")).attr({stroke: color});
	};
	
	function formatData(v, precision){
		return Math.round(v*precision)/precision;
	}

	function draw(panel, rows, options) {
		var rowCount = rows.length;
		
		function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
			var l1 = (p2x - p1x) / 2,
				l2 = (p3x - p2x) / 2,
				a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
				b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
			a = p1y < p2y ? Math.PI - a : a;
			b = p3y < p2y ? Math.PI - b : b;
			var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
				dx1 = l1 * Math.sin(alpha + a),
				dy1 = l1 * Math.cos(alpha + a),
				dx2 = l2 * Math.sin(alpha + b),
				dy2 = l2 * Math.cos(alpha + b);
			return {
				x1: p2x - dx1,
				y1: p2y + dy1,
				x2: p2x + dx2,
				y2: p2y + dy2
			};
		}
		
		
		var maxVal = getMaxVal(rows);
		
		var width = $(panel).width(),
			height = $(panel).height(),
			r = R(panel, width, height),
			txt = {font: '12px Helvetica, Arial', fill: "#888"},
			txt1 = {font: '10px Helvetica, Arial', fill: "#ccc"},
			txt2 = {font: '12px Helvetica, Arial', fill: "#000"},
			xStep = (width - options.leftgutter*2) / maxVal.x,
			yStep = (height - options.bottomgutter - options.topgutter) / maxVal.y;
		
		r.drawGrid(
			options.leftgutter,
			options.topgutter,
			width-options.leftgutter*2,
			height - options.topgutter - options.bottomgutter,
			xStep, yStep,
			options.gridColor
		);
		
		var label = r.set(),
			is_label_visible = false,
			leave_timer,
			blanket = r.set();
		label.push(r.text(60, 12, "24").attr(txt));
		label.push(r.text(60, 27, "22").attr(txt1).attr({fill: "#000"}));
		label.hide();
		var frame = r.popup(100, 100, label, "right").attr({fill: "#ffc", stroke: "#cc8", "stroke-width": 2, "fill-opacity": .8}).hide();
			
		function drawRow(row, color){
			var path = r.path().attr({stroke: color, "stroke-width": 2, "stroke-linejoin": "round"});
			if(options.viewBackground)
				var bgp = r.path().attr({stroke: "none", opacity: .3, fill: color});
				
			var p, bgpp;
			for (var i = 0, ii = row.length; i < ii; i++) {
				if(typeof(row[i][1])!="number") continue;
				var y = Math.round(height - options.bottomgutter - yStep * row[i][1]) + pixelShift,
					x = Math.round(options.leftgutter + xStep * (row[i][0])) + pixelShift;
				if (!i) {
					p = ["M", x, y, "C", x, y];
					if(options.viewBackground)
						bgpp = ["M", options.leftgutter + xStep, height - options.bottomgutter, "L", x, y, "C", x, y];
				}
				if (i && i < ii - 1) {
					var Y0 = Math.round(height - options.bottomgutter - yStep * row[i - 1][1]),
						X0 = Math.round(options.leftgutter + xStep * (row[i-1][0])),
						Y2 = Math.round(height - options.bottomgutter - yStep * row[i + 1][1]),
						X2 = Math.round(options.leftgutter + xStep * (row[i+1][0]));
					var a = getAnchors(X0, Y0, x, y, X2, Y2);
					p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
					if(options.viewBackground)
						bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
				}
				var dot = r.circle(x, y, 4).attr({fill: "#ccc", stroke: color, "stroke-width": 2});
				
				blanket.push(r.circle(x, y, 20).attr({stroke: "none", fill: "#fff", opacity: 0}));
				var rect = blanket[blanket.length - 1];
				(function addPopup (x, y, val, lbl, dot) {
					var timer, i = 0;
					rect.hover(function () {
						clearTimeout(leave_timer);
						var side = "right";
						if (x + frame.getBBox().width > width) {
							side = "left";
						}
						var ppp = r.popup(x, y, label, side, 1);
						frame.show().stop()
							.animate({path: ppp.path}, 200 * is_label_visible);
						label[0].attr({text: formatData(val, options.precision), fill:color}).show().stop()
							.animateWith(frame, {translation: [ppp.dx, ppp.dy]}, 200 * is_label_visible);
						label[1].attr({text: formatData(lbl, options.precision)}).show().stop()
							.animateWith(frame, {translation: [ppp.dx, ppp.dy]}, 200 * is_label_visible);
						dot.attr("r", 8);
						is_label_visible = true;
					}, function () {
						dot.attr("r", 4);
						leave_timer = setTimeout(function () {
							frame.hide();
							label[0].hide();
							label[1].hide();
							is_label_visible = false;
						}, 600);
					});
				})(x, y, row[i][1], row[i][0], dot);
			}
			p = p.concat([x, y, x, y]);
			path.attr({path: p});
			if(options.viewBackground){
				bgpp = bgpp.concat([x, y, x, y, "L", x, height - options.bottomgutter, "z"]);
				bgp.attr({path: bgpp});
			}
			frame.toFront();
			label[0].toFront();
			label[1].toFront();
			blanket.toFront();
		}
		
		$.each(rows, function(i, row){
			var color;
			if(!options.color)
				color = "hsb(" + [Math.random(), .5, 1] + ")";
			drawRow(row, color);
		});
	}
	
	$.fn.rgraph = function(rows, options){
		var options = $.extend({
			precision: 10,
			colorhue: Math.random(),
			leftgutter: 30,
			bottomgutter: 20,
			topgutter: 20,
			gridColor: "#ccc",
			viewTable: false,
			viewBackground: true
		}, options);
		if(!options.color && options.colorhue) options.color = "hsb(" + [options.colorhue, .5, 1] + ")";

		$(this).each(function(i, gr){
			draw(gr, rows, options);
			if(options.viewTable)
				$(gr).append(table(rows));
		});
	};
})(jQuery, Raphael);