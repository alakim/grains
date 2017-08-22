(function($, $C){
	var Settings = {
		size: {w: 800, h:200},
		button:{
			size:30
		},
		marker:{
			size:{w:20, h:12},
			bgColor:'#ff0000',
			color: '#ffff00'
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
				' .veditMarker':{
					backgroundColor: '#222',
					fontWeight: css.bold,
					padding: px(1, 5),
					'.start':{color: '#0f0'},
					'.end':{color: '#0f0'}
				}
			}
		}
	});

	function selectWith(tagName){
		var selection = window.getSelection();
		console.log(selection);
		selection.anchorNode.nodeValue = 'XXX';
	}

	function insertMarkers(docText){
		var svg = $C.getTagDefinitions('path;text;tspan'),
			sz = Settings.marker.size;
		function pair(x, y){
			return [x, y].join(',');
		}

		return docText.replace(/<(\/)?([^>]+)>/gi, function(str, closing, name){
			return $C.html.svg({
					width:sz.w, height: sz.h,
					'data-name':name,
					'data-closing':closing?true:false
				},
				svg.path({
					style:'fill:'+Settings.marker.bgColor+';stroke:none;',
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
				svg.text({
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
				)
			)
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
		}).end();

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
