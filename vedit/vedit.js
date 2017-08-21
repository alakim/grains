(function($, $C){
	var Settings = {
		size: {w: 800, h:200},
		button:{
			size:30
		}
	};

	var $H = $C.simple;
	var px = $C.css.unit.px,
		pc = $C.css.unit.pc;


	$C.css.writeStylesheet({
		'.vedit':{
			width: px(Settings.size.w),
			height: px(Settings.size.h),
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
				height:px(Settings.size.h - Settings.button.size)
			}
		}
	});

	var log = console.log;

	function getSelection(){
		var selection = window.getSelection();
		console.log(selection);
		if(selection.anchorNode.parentNode!=selection.focusNode.parentNode){
			log('Выделение через границы элементов недопустимо');
			return;
		}
		var val = selection.anchorNode.nodeValue;
		var range = {
			from: selection.anchorOffset,
			to: selection.focusOffset
		};
		var selVal = val?val.slice(range.from, range.to):null;
		log('selection from '+range.from+' to '+range.to+': "'+selVal+'"');
		return range;
	}

	function init(el){
		el.addClass('vedit');
		el.html((function(){with($H){
			return markup(
				div({'class':'veditButtonsPanel'},
					button({'class':'btSelI'}, 'I'),
					button({'class':'btSelB'}, 'B'),
				),
				div({'class':'veditEditor', contenteditable:true})
			);
		}})())
		.find('.btSelI').click(function(){
			// alert('I');
			console.log(getSelection());
		}).end()
		.find('.btSelB').click(function(){
			// alert('B');
			console.log(getSelection());
		}).end();
	}

	$.fn.vedit = function(){
		$(this).each(function(i, el){
			init($(el));
		});
	}
})(jQuery, Clarino.version('0.0.0'));
