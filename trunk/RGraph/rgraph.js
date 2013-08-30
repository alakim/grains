var RGraph = (function($,R){
	var pixelShift = .5;
	
	function getRanges(rows, options){
		if(options.axes) return {
			x:{min:options.axes.x.min, max: options.axes.x.max},
			y:{min:options.axes.y.min, max: options.axes.y.max},
			basis:0
		};
			
		var maxBasis = 2;
		var maxX = 0;
		var maxY = 0;
		var minX = null;
		var minY = null;
		$.each(rows, function(i, row){
			for(var i=0; i<row.length; i++){
				var pair = getPair(row, i);
				if(typeof(pair.x)=="number"){
					if(maxX<pair.x) maxX = pair.x;
					if(minX==null || minX>pair.x) minX = pair.x;
				}
				if(typeof(pair.y)=="number"){
					if(maxY<pair.y) maxY = pair.y;
					if(minY==null || minY>pair.y) minY = pair.y;
				}
			}
		});
		var dY = maxY - minY;
		var basis = dY<minY*maxBasis? minY - dY/2 :0;
		return {x:{max:maxX, min:minX}, y:{max:maxY, min:minY}, basis:basis};
	}
	
	function log10(x){
		return Math.log(x)/Math.LN10;
	}
	
	function getLabels(range){
		var min = range[0];
		var max = range[1];
		var length = max - min;
		var dX = Math.pow(10, Math.round(log10(length)) - 1);
		var x0 = Math.floor(min/dX)*dX;
		var res = [];
		for(var i=0; i<=Math.ceil(length/dX); i++){
			var lbl = Math.round((x0+dX*i)*100)/100;
			res.push(lbl);
		}
		return res;
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
	
	R.fn.drawGrid = function (x, y, w, h, xStep, yStep, ranges, options) {
		var color = options.gridColor,
			labels = options.labels;

		color = color || "#000";
		var s = pixelShift;
		var txtStyle = {font: '12px Helvetica, Arial', fill: "#888"};
		
		var path = [];
		var nMag;
		for(nMag=1; yStep<12; nMag*=2,yStep*=2);
		
		if(options.axes){
			var n = (function(axis){return (axis.max - axis.min)/axis.step;})(options.axes.y);
			var step = h/n;
			for(var i=0; i<=n; i++){
				path = path.concat([
					"M", Math.round(x) + s, Math.round(y + i * step) + s,
					"H", Math.round(x + w) + s
				]);
				var val = options.axes.y.max - i*options.axes.y.step;
				if(options.axes.y.format) val = options.axes.y.format(val);
				this.text(Math.round(x/2) + s, Math.round(6 + i * step) + s + 12, val).attr(txtStyle);
			}
		}
		else{
			var hv = h/yStep;

			for (var i = 0; i <= hv; i++) {
				path = path.concat([
					"M", Math.round(x) + s, Math.round(y + i * yStep) + s,
					"H", Math.round(x + w) + s
				]);
				this.text(Math.round(x/2) + s, Math.round(6 + i * yStep) + s + 12, (hv-i)*nMag+ranges.basis).attr(txtStyle);
			}
		}
		var aLblX = options.axes?(function(axis){
				var res = [];
				var n = (axis.max - axis.min)/axis.step;
				for(var i=0; i<=n; i++){
					res.push(axis.min + i*axis.step);
				}
				return res;
			})(options.axes.x)
			:getLabels([ranges.x.min, ranges.x.max]);
		var columnWidth = w/(aLblX.length-1);
		for(var i=0; i<aLblX.length; i++){
			var lbl = aLblX[i];
			path = path.concat([
				"M", Math.round(x + i * columnWidth) + s, Math.round(y) + s,
				"V", Math.round(y + h) + s
			]);
			var label = labels && labels[lbl]?labels[lbl]:lbl;
			if(options.axes&&options.axes.x.format) label = options.axes.x.format(label);
			this.text(Math.round(x + i * columnWidth) + s, y+h + 12, label).attr(txtStyle);
		}
		
		if(options.axes){
			if(options.axes.y.title)
				this.text(options.leftgutter/2 +s, options.topgutter/2-3+s, options.axes.y.title).attr(txtStyle);
			if(options.axes.x.title)
				this.text(w+options.leftgutter*1.5+s, h+options.topgutter+s, options.axes.x.title).attr(txtStyle);
		}

		return this.path(path.join(",")).attr({stroke: color});
	};
	
	function formatData(v, precision){
		if(typeof(v)!="number") return v;
		return Math.round(v*precision)/precision;
	}
	
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
	
	function getPair(row, idx){
		var v = row[idx];
		if(v instanceof Array) return {x:v[0], y:v[1]};
		return {x:idx, y:v};
	}
	function getPrevPair(row, idx){
		if(row[idx-1]!=null || idx==1) return getPair(row, idx-1);
		return getPrevPair(row, idx-1);
	}
	function getNextPair(row, idx){
		if(row[idx+1]!=null || idx==row.length-1) return getPair(row, idx+1);
		return getPrevPair(row, idx+1);
	}

	function draw(panel, rows, options) {
		var ranges = getRanges(rows, options);
		var width = $(panel).width(),
			height = $(panel).height(),
			r = R(panel, width, height),
			xStep, yStep,
			xStep = (width - options.leftgutter*2) / (ranges.x.max - ranges.x.min),
			yStep = (height - options.bottomgutter - options.topgutter) / (ranges.y.max-ranges.basis);
		
		if(options.backColor)
			r.rect(0, 0, width, height).attr({fill:options.backColor, stroke:null}).toBack();
		
		r.drawGrid(
			options.leftgutter,
			options.topgutter,
			width-options.leftgutter*2,
			height - options.topgutter - options.bottomgutter,
			xStep, yStep, ranges,
			options
		);
		
		var label = r.set(),
			is_label_visible = false,
			leave_timer,
			blanket = r.set();
		label.push(r.text(60, 12, "24").attr({font: '12px Helvetica, Arial', fill: "#888"}));
		label.push(r.text(60, 27, "22").attr({font: '10px Helvetica, Arial', fill: "#ccc"}).attr({fill: "#000"}));
		label.hide();
		var frame = r.popup(100, 100, label, "right").attr({fill: "#ffc", stroke: "#cc8", "stroke-width": 2, "fill-opacity": .8}).hide();
		
		var rowItems = [];
			
		function drawRow(row, rowSettings){
			if(!row.length) return;
			var rowItm = {};
			rowItems.push(rowItm);
			var path = r.path().attr({stroke: rowSettings.color, "stroke-width": 2, "stroke-linejoin": "round"});
			rowItm.path = path;
			if(options.viewBackground){
				var bgp = r.path().attr({stroke: "none", opacity: options.bgOpacity, fill: rowSettings.color});
				rowItm.bgp = bgp;
			}
				
			var p, bgpp;
			for (var i = 0, ii = row.length; i < ii; i++) {
				var pair = getPair(row, i);
				if(typeof(pair.y)!="number") continue;
				var y = Math.round(height - options.bottomgutter - yStep * (pair.y - ranges.basis)) + pixelShift,
					x = Math.round(options.leftgutter + xStep * (pair.x - ranges.x.min)) + pixelShift;
					
				if(!p) p = ["M", x, y, "C", x, y];
				if(!bgpp && options.viewBackground) bgpp = ["M", options.leftgutter, height - options.bottomgutter, "L", x, y, "C", x, y];
				if (i && i < ii - 1) {
					var pair0 = getPrevPair(row, i),
						pair1 = getNextPair(row, i);
					var Y0 = Math.round(height - options.bottomgutter - yStep * pair0.y),
						X0 = Math.round(options.leftgutter + xStep * (pair0.x - ranges.x.min)),
						Y2 = Math.round(height - options.bottomgutter - yStep * pair1.y),
						X2 = Math.round(options.leftgutter + xStep * (pair1.x - ranges.x.min));
					var a = getAnchors(X0, Y0, x, y, X2, Y2);
					p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
					if(options.viewBackground)
						bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
				}
				var dot = r.circle(x, y, 4).attr({fill: options.dotColor, stroke: rowSettings.color, "stroke-width": 2});
				
				blanket.push(r.circle(x, y, 20).attr({stroke: "none", fill: "#fff", opacity: 0}));
				var rect = blanket[blanket.length - 1];
				(function addPopup (x, y, val, lbl, dot) {
					if(options.labels && options.labels[lbl]) lbl = options.labels[lbl];
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
						label[0].attr({text: formatData(val, options.precision), fill:rowSettings.color}).show().stop()
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
				})(x, y, pair.y, pair.x, dot);
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
		
		function drawLegend(){
			var animationSpeed = 150,
				labelOpacity = .6;
			var y = height-options.legendSize.h*1.7;
			var xMargin = 10;
			var fontSize = 14;
			var x = xMargin;
			var legendLabels = [];
			for(var i=0; i<rows.length; i++){
				var settings = options.rowSettings[i];
				var lbl = r.set();
				lbl.push(r.rect(x, y, options.legendSize.w, options.legendSize.h)
					.attr({fill:settings.color, stroke:null, opacity:labelOpacity}));
				lbl.push(r.text(x+options.legendSize.w+3, y+Math.round(fontSize*0.3), settings.name).attr({"text-anchor":"start", "font-size":fontSize}));
				legendLabels.push(lbl[0]);
				var txtBBox = lbl[1].getBBox();
				x = txtBBox.x + txtBBox.width + xMargin;
				function on(idx){return function(e){
					rowItems[idx].bgp.animate({opacity:.6}, animationSpeed);
					legendLabels[idx].animate({opacity:1}, animationSpeed);
				};}
				function off(idx){return function(e){
					rowItems[idx].bgp.animate({opacity:options.bgOpacity}, animationSpeed);
					legendLabels[idx].animate({opacity:labelOpacity}, animationSpeed);
				};}
				lbl.hover(on(i), off(i));
			}
		}
		
		$.each(rows, function(i, row){
			drawRow(row, options.rowSettings[i]);
		});
		if(options.viewLegend) drawLegend();
	}
	
	$.fn.rgraph = function(rows, options){
		var options = $.extend({
			backColor: "#fff",
			dotColor: "#dfc",
			bgOpacity: .3,
			precision: 10,
			leftgutter: 30,
			bottomgutter: 20,
			topgutter: 20,
			gridColor: "#ccc",
			viewTable: false,
			viewBackground: true,
			viewLegend: true,
			legendSize: {h:10, w:50}
		}, options);
		if(options.viewLegend) options.bottomgutter+=options.legendSize.h*2;
		if(!options.rowSettings) options.rowSettings = [];
		for(var i=0; i<rows.length; i++){
			options.rowSettings[i] = $.extend({
				name:"Row "+(i+1),
				color: "hsb(" + [Math.random(), .5, 1] + ")"
			}, options.rowSettings[i]);
		}

		$(this).each(function(i, gr){
			draw(gr, rows, options);
			if(options.viewTable)
				$(gr).append(table(rows));
		});
	};
	
	var __ = {
		version:"1.0"
	};
	
	if(typeof(JSUnit)!="undefined")$.extend(__, {
		getLabels: getLabels
	});
	
	return __;
})(jQuery, Raphael);