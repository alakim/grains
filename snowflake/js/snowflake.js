const Snowflake = (function($, $C, $S){const $H = $C.simple;
	const color = '#eeeeff';
	const strokeWidth = 2;
	let paper;

	let branchLevel = 2;

	function branch(root, directions, size, level=0){
		console.log(root, directions, size);
		if(level>branchLevel) return;
		if(size<1) return;

		let path = [];
		for(dir of directions){
			const dR = dir*Math.PI/180;
			[x, y] = root;

			function ptAtLng(lng){
				return [x+Math.cos(dR)*lng, y+Math.sin(dR)*lng];
			}

			const pt = ptAtLng(size);
			path = path.concat(['M', x, y, 'L', ...pt]);

			const node = ptAtLng(size*.7);
			// paper.circle(...node, 5).attr({fill:'#00ff00'});
			
			if(branchLevel>0) path = path.concat(branch(node, [dir+60, dir-60], size*.4, level+1));
		}

		return path;
	}

	function draw(){
		paper = $S('#main');
		const shape = {x:130, y:130, size:80};
		const path = branch([shape.x, shape.y], Array.from(hexRay()), shape.size);
		paper.path(path.join(' ')).attr({stroke:color, strokeWidth:strokeWidth});
	}

	function* hexRay(){
		for(let i=0; i<6; i++)
			yield 60*i;
	}

	return {draw};

})(jQuery, Clarino.version('1.4.0'), Snap);
