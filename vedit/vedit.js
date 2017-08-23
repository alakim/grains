(function($, $C){

	var Settings = {
		size: {w: 800, h:200},
		button:{
			size:30
		},
		marker:{
			size:{w:20, h:12},
			bgColor:{lo:'#ff0000', hi:'#ffff00'},
			color: '#ffff00',
			textLabels: true,
			highlightOpposite: true
		}
	};

	var $H = $C.simple;
	var px = $C.css.unit.px,
		pc = $C.css.unit.pc,
		css = $C.css.keywords;


	$C.css.writeStylesheet({
		'.vedit':{
			width: px(Settings.size.w),
			// height: px(Settings.size.h),
			' .veditButtonsPanel':{
				width: pc(100),
				background: '#eee',
				border: px(1)+' solid #888',
				padding: px(1, 5),
				' button':{
					background: '#ccc',
					border: px(1)+' solid #888',
					borderRadius: px(4),
					margin: px(0, 8),
					height: px(Settings.button.size),
					minWidth: px(Settings.button.size)
				}
			},
			' .veditEditor':{
				padding:px(5),
				border:px(1)+' solid #ccc',
				width: pc(100),
				height:px(Settings.size.h - Settings.button.size),
				' .marker':{
					cursor: css.default
				}
			}
		}
	});

	var uid = (function(){
		var counter = 1;
		return function(){
			return counter++;
		};
	})();

	function selectWith(tagName){
		var selection = window.getSelection();
		console.log(selection);
		selection.anchorNode.nodeValue = 'XXX';
	}

	var templates = {
		marker: function(name, closing){
			var svg = $C.getTagDefinitions('path;text;tspan'),
				sz = Settings.marker.size;

			function pair(x, y){
				return [x, y].join(',');
			}

			return $C.html.svg({
					'class':'marker',
					width:sz.w, height: sz.h,
					'data-name':name,
					'data-closing':closing?true:false
				},
				svg.path({
					style:'fill:'+Settings.marker.bgColor.lo+';stroke:none;',
					d:[
						'M',
						pair(closing?sz.w:0, 0),
						pair(sz.w/2, 0),
						pair(closing?0:sz.w, sz.h/2),
						pair(sz.w/2, sz.h),
						pair(closing?sz.w:0, sz.h),
						'Z'
					].join(' ')
				}),
				Settings.marker.textLabels?svg.text({
					//style:'font-size:'+px(sz.h*.7)+';fill:'+Settings.marker.color,
					style:$C.formatStyle({
						'font-size': px(sz.h*.8),
						'font-weight':$C.css.keywords.bold,
						'text-anchor':'middle',
						fill: Settings.marker.color
					}),
					x:closing?sz.w*.7 :sz.w*.4,
					y:sz.h*.8
				},
					svg.tspan(name)
				):null
			);
		}
	};

	function insertMarkers(docText){
		return docText.replace(/<(\/)?([^>]+)>/gi, function(str, closing, name){
			return templates.marker(name, closing);
		});
	}

	function highlightOpposite(marker, hide){
		if(!Settings.marker.highlightOpposite) return;
		var opposite = marker[0].opposite;
		
		if(hide){
			var oSt = marker[0].oldStyle;
			if(oSt) marker.find('path').attr({style: oSt});
			if(opposite) $(opposite).find('path').attr({style:oSt});
			return;
		}

		var path = marker.find('path');
		marker[0].oldStyle = path.attr('style');
		var st = getStyle(marker[0].oldStyle);
		st.fill = Settings.marker.bgColor.hi;
		setStyle(path, st);

		if(opposite){
			setStyle($(opposite).find('path'), st);
		}

	}

	function getStyle(str){
		var res = {};
		var pairs = str.split(';');
		for(var p,i=0; p=pairs[i],i<pairs.length; i++){
			var v = p.split(':');
			if(v[0].length){
				res[v[0]] = v[1];
			}
		}
		return res;
	}
	function setStyle(el, style){
		var res = [];
		for(var k in style){
			res.push([k, style[k]].join(':'));
		}
		$(el).attr({style: res.join(';')});
	}

	function setOpposites(el){
		var path = [];
		el.find('.marker').each(function(i, mrk){mrk=$(mrk);
			var closed = mrk.attr('data-closed')=='true';
			if(closed) return;

			var nm = mrk.attr('data-name'),
				closing = mrk.attr('data-closing')=='true';

			if(closing){
				var opened = path[path.length-1],
					oNm = opened.attr('data-name');
				if(oNm!=nm){
					console.error('Unclosed tag %s', oNm);
					return;
				}
				opened[0].opposite = mrk[0];
				mrk[0].opposite = opened[0];
				path.splice(path.length-1, 1);
			}
			else{
				path.push(mrk);
			}
		});
	}

	function init(el, config, docText){
		el.addClass('vedit');
		el.html((function(){with($H){
			return markup(
				div({'class':'veditButtonsPanel'},
					button({'class':'btSelI'}, 'I'),
					button({'class':'btSelB'}, 'B'),
				),
				div({'class':'veditEditor', contenteditable:true}, insertMarkers(docText))
			);
		}})())
		.find('.btSelI').click(function(){
			selectWith('I');
		}).end()
		.find('.btSelB').click(function(){
			selectWith('B');
		}).end()
		.find('.marker').mouseover(function(){
			//var title = $(this).attr('data-name');
			highlightOpposite($(this));
		}).mouseout(function(){
			highlightOpposite($(this), true);
		}).end();

		setOpposites(el);

		function harvest(node){
			node = node || el.find('.veditEditor')[0];

			if(node.nodeName=='svg'){
				var nd = $(node),
					nm = nd.attr('data-name'),
					cls = nd.attr('data-closing')=='true';
				return [
					'<',
					cls?'/':'',
					,nm,
					'>'
				].join('');
			}

			if(!node.childNodes.length) return node.nodeValue;
			
			var res = [];
			for(var n,i=0; n=node.childNodes[i],i<node.childNodes.length; i++){
				res.push(harvest(n));
			}

			return res.join('');
		}

		return {
			harvest: harvest
		}
	}

	$.fn.vedit = function(config, docText){
		// $(this).each(function(i, el){
		// 	init($(el), config, docText);
		// });
		var el = $(this)[0];
		return init($(el), config, docText); 
	}
})(jQuery, Clarino.version('0.0.0'));
