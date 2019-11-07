const Snowflake = (function($, $C, $S){const $H = $C.simple;
	const color = '#eeeeff';
	const strokeWidth = 2;
	let paper;

	let branchLevel = 2;

	function randomLength(lng){
		//return lng*.4;
		return .8 * (Math.random()+.1)*lng;
	}

	const levelSizes = [];
	const levelNodes = [];

	function branch(root, directions, level=0){
		let size = levelSizes[level];
		if(!size){
			size = randomLength(levelSizes[level-1]);
			levelSizes[level] = size;
		}

		let nodeLng = levelNodes[level];
		if(!nodeLng){
			nodeLng = randomLength(size);
			levelNodes[level] = nodeLng;
		}

		// console.log(root, directions, size);
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

			const node = ptAtLng(nodeLng);
			// paper.circle(...node, 5).attr({fill:'#00ff00'});
			
			if(branchLevel>0) path = path.concat(branch(node, [dir+60, dir-60], level+1));
		}

		return path;
	}

	function draw(){
		paper = $S('#main');
		const shape = {x:130, y:130, size:80};
		levelSizes[0] = shape.size;
		levelNodes[0] = 0;
		const path = branch([shape.x, shape.y], Array.from(hexRay()));
		paper.path(path.join(' ')).attr({stroke:color, strokeWidth:strokeWidth});
	}

	function* hexRay(){
		for(let i=0; i<6; i++)
			yield 60*i;
	}

	return {draw};

})(jQuery, Clarino.version('1.4.0'), Snap);
