var Controls = (function($, $C){var $H = $C.simple;

	with($C.css.unit){
		var css = $C.css.keywords;
		var $T = $C.css.template;
		$C.css.writeStylesheet({
			'#msivotingcontainer':{
				' .modalDialog':{
					display:css.block,
					position:css.absolute,
					top:0, left:0,
					width:'100vw',
					height:'100vh',
					backgroundColor:'rgba(0, 0, 0, 0)',
					'.top':{
						backgroundColor:'rgba(0, 0, 0, .7)',
					},
					' .dlgBody':{
						width:px(800),
						backgroundColor:'#ccc',
						border: $T.border(1, '#888'),
						borderRadius:px(5),
						color:'#000',
						margin:px(100, css.auto),
						' .dlgTitle':{
							fontWeight:css.bold,
							textAlign:css.center,
							padding:px(3),
							borderBottom: $T.border(1, '#888')
						},
						' button.attention':{
							color:'#a00'
						},
						' .dlgContent':{
							padding:px(5),
							minHeight:px(300),
							' table.inputFields':{
								' th':{
									textAlign:css.left
								}
							}
						},
						' .dlgFooter':{
							padding:px(3),
							borderTop: $T.border(1, '#888'),
							textAlign:css.right
						}
					},
					'.errorDialog':{
						' .dlgBody':{
							width:px(500)
						},
						' .dlgTitle':{
							color:'#f00'
						},
						' .dlgContent':{
							minHeight:px(100)
						}
					},
					'.infoDialog':{
						' .dlgBody':{width:px(500)},
						' .dlgTitle':{color:'#008'},
						' .dlgContent':{minHeight:px(100)}
					},
					'.confirmDialog':{
						' .dlgBody':{width:px(500)},
						' .dlgTitle':{color:'#06a'},
						' .dlgContent':{minHeight:px(100)},
						' .btYes':{color:'#f00'}
					}
				},
				' .imageViewControl':{
					position:css.absolute,
					top:0, left:0,
					backgroundColor:'rgba(0,0,0,.7)',
					textAlign:css.center,
					width:'100vw',
					height:'100vh',
					display:css.flex,
					justifyContent:css.center,
					alignItems:css.center,
					' img':{
						maxWidth:'95vw',
						maxHeight:'95vh'
					}
				}
			}
		});
	}

	function container(){
		var id = 'msivotingcontainer';
		var cont = $('#'+id);
		if(cont.length) return cont;
		cont = $($H.div({id:id}));
		$('body').append(cont);
		return cont;
	}

	var dialogZIndex = (function(){
		var idx = 1e3;
		return function(){return idx++;};
	})();


	var ModalDialog = (function(){

		function close(dlg){
			dlg.remove();
			decorateTop();
		}

		function decorateTop(){
			var topDialog;
			$('.modalDialog')
				.removeClass('top')
				.each(function(i, el){el=$(el);
					if(!topDialog || el.css('z-index')>topDialog.css('z-index'))
						topDialog = el;
				})
			;
			if(topDialog) topDialog.addClass('top');
		}

		function open(className, title, constructor){
			container().find('.'+className).remove();
			var dlg = $($H.div({'class':'modalDialog '+className, style:'z-index:'+dialogZIndex()},
				$H.div({'class':'dlgBody'},
					$H.div({'class':'dlgTitle'}, title),
					$H.div({'class':'dlgContent'}, 'Загрузка...'),
					$H.div({'class':'dlgFooter'},
						$H.span({'class':'customButtons'}),
						$H.button({'class':'btClose'}, 'Закрыть')
					)
				)
			));
			dlg
				.click(function(){
					close(dlg);
				})
				.find('.dlgBody').click(function(ev){
					ev.stopPropagation();
				}).end()
				.find('.btClose').click(function(){
					close(dlg);
				}).end()
			;
			container().append(dlg);
			constructor(dlg);
			dlg.close = function(){close(dlg);};
			decorateTop();
		}

		return {
			open: open
		};
	})();

	function ErrorDialog(msg){
		ModalDialog.open('errorDialog', 'Ошибка', function(dlg){
			dlg
				.find('.dlgContent').html(msg).end()
			;
		});
	}

	function InfoDialog(msg){
		ModalDialog.open('infoDialog', 'Сообщение', function(dlg){
			dlg
				.find('.dlgContent').html(msg).end()
			;
		});
	}

	function ConfirmDialog(msg, onOK){
		ModalDialog.open('confirmDialog', 'Запрос подтверждения', function(dlg){
			dlg
				.find('.dlgContent').html(msg).end()
				.find('.customButtons').html($H.markup(
					$H.button({'class':'btYes'}, 'ДА')
				)).end()
				.find('.btClose').html('НЕТ').end()
				.find('.btYes').click(function(){
					dlg.close();
					onOK();
				}).end()
			;
		});
	}

	function harvest(dlg){dlg=$(dlg);
		var res = {};
		function fieldName(el){
			return el.attr('class').slice(3);
		}
		dlg.find('input,textarea').each(function(i, el){el=$(el);
			var cls = el.attr('class');
			switch(el.attr('type')){
				case 'checkbox': res[cls.slice(3)] = el.prop('checked')?1:0; break;
				default: // default behaviour for all text boxes
					var val = el.val();
					if(val && val.length) res[fieldName(el)] = val;
					break;
			}
		});
		dlg.find('select').each(function(i, el){el=$(el);
			var cls = el.attr('class');
			var val = el.val();
			if(val && val.length) res[fieldName(el)] = val;
		});

		return res;
	}

	return {
		ModalDialog: ModalDialog,
		ErrorDialog: ErrorDialog,
		InfoDialog: InfoDialog,
		ConfirmDialog: ConfirmDialog,
		harvest: harvest
	};

})(jQuery, Clarino.version('1.3.0'));
