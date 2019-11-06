const Snowflake = (function($, $C, $S){const $H = $C.simple;
	const color = '#eeeeff';
	const strokeWidth = 2;

	function branch(paper, root, directions, size){
		//let path = ['M', root.x, root.y, 'L', root.x, root.y+size];
		let path = [];
		for(dir of directions){
			const dR = dir*Math.PI/180;
			// paper.circle(root.x, root.y, 5).attr({fill:'#ffff00'});
			const pt = [root.x+Math.cos(dR)*size, root.y+Math.sin(dR)*size];
			// paper.circle(...pt, 5).attr({fill:'#00ff00'});
			path = path.concat(['M', root.x, root.y, 'L', ...pt]); //root.x+dir, root.y+dir]);
		}

		paper.path(path.join(' ')).attr({stroke:color, strokeWidth:strokeWidth});
		// const nodePos = .6;
		// const node = {
		// 	x: root.x,
		// 	y: root.y+size*nodePos
		// };
		// paper.circle(node.x, node.y, 5).attr({fill:'#ff0000'});
	}

	function draw(){
		const paper = $S('#main');
		const shape = {x:130, y:130, size:80};
		branch(paper, {x,y}=shape, Array.from(hexRay()), shape.size);
	}

	function* hexRay(){
		for(let i=0; i<6; i++)
			yield 60*i;
	}

	return {draw};

})(jQuery, Clarino.version('1.4.0'), Snap);
