const Snowflake = (function($, $C, $S){const $H = $C.simple;
	const color = '#eeeeff';
	const strokeWidth = 2;

	function branch(paper, root, directions, size){
		const path = ['M', root.x, root.y, 'L', root.x, root.y+size].join(' ');
		for(dir of directions){
			paper.path(path)
				.attr({stroke:color, strokeWidth:strokeWidth})
				.transform(['rotate(', dir, root.x, root.y, ')'].join(' '))
			;
		}
	}

	function draw(){
		const paper = $S('#main');
		const shape = {x:30, y:30, size:20};
		branch(paper, {x,y}=shape, Array.from(hexRay()), shape.size);
	}

	function* hexRay(){
		for(let i=0; i<6; i++)
			yield 60*i;
	}

	return {draw};

})(jQuery, Clarino.version('1.4.0'), Snap);
