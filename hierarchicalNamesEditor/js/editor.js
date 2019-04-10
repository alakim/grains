const Editor = (function($, $C){const $H = $C.simple;


	const {px,pc} = $C.css.unit;
	const css = $C.css.keywords;

	$C.css.writeStylesheet({
		'.dlgNodeEditor':{
			' .selLevel':{
				margin:px(8)
			},
			' .tbName':{
				width:px(400)
			}
		},
		'.pnlEditor':{
			' .link':{
				cursor:css.pointer,
				color:'#afe',
				':hover':{
					color:'#afa',
					textDecoration:css.underline
				}
			}
		}
	});

	let nodesIndex = {};
	let nodesHierarchy;

	function indexNodes(data){
		nodesIndex = {};
		for(let nd of data){
			nodesIndex[nd.id] = nd;
		}
		return nodesIndex;
	}

	function buildHierarchy(data){

		function insertNode(root, path, node){
			if(!path.length) return;
			//console.log(path);
			if(typeof(path)=='string') path = path.split('/');
			[head, ...tail] = path;
			if(!root[head]) root[head] = {};
			if(!tail.length){
				root[head].node = node;
			}
			else
				insertNode(root[head], tail, node);
		}

		const root = {};
		for(let dd of data){
			insertNode(root, dd.name, dd);
		}

		nodesHierarchy = root;
		return root;
	}


	function getHierarchyLevel(path){
		let root = nodesHierarchy;
		return []; //TODO: доделать
	}

	function editNode(ndID){
		// console.log('node ID: %o', ndID);
		const node = nodesIndex[ndID];
		// console.log('node: %o', node);
		const tokens = node.name.split('/');
		const nodePath = (nn=>nn.splice(0, nn.length-1))(tokens);
		const {markup,apply,div,span,ul,ol,li,select,option,button,input} = $H;
		Controls.ModalDialog.open('dlgNodeEditor', 'Редактирование элемента', dlg=>{
			dlg.find('.dlgContent')
				.html(markup(
					apply(nodePath, (pp, level)=>markup(
						select({'class':'selLevel', 'data-level':level},
							//TODO: apply(getHierarchyLevel(level), nn=>option({value:nn}, nn))
							option({value:pp}, pp)
						)
					)),
					input({type:'text', 'class':'tbName', value:tokens[tokens.length-1]})
				))
			;
		});
	}

	function open(data){
		nodesIndex = indexNodes(data);
		const root = buildHierarchy(data);
		console.log(root);

		const {markup,apply,div,span,ul,ol,li,button,input} = $H;


		function levelTemplate(tag, level){
			if(tag==='node') return;
			// console.log('level: %o', level);
			return li(
				span({'class':'link lnkNode'}, level.node?{'data-id':level.node.id}:null, tag), 
				level.node?` (ID:${level.node.id})`: ul(
					apply(level, (l,t)=>levelTemplate(t, l))
				)
			);
		}

		$('#main')
			.html(markup(
				div('Source data:'),
				ul(
					apply(data, dd=>li(
						dd.name
					))
				),

				div('Hierarchy:'),
				div(button({'class':'btAddNode'}, 'Add node')),
				div({'class':'pnlEditor'},
					ul(
						levelTemplate(null, root)
					)
				)
			))
			.find('.lnkNode').click(function(){
				editNode($(this).attr('data-id'));
			}).end()
			.find('.btAddNode').click(function(){
				editNode();
			}).end()
		;
	}

	return {
		open
	};

})(jQuery, Clarino.version('1.2.0'));
