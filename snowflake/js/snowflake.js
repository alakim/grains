const Snowflake = (function($, $C, $S){const $H = $C.simple;

	function branch(paper, root, size){
		paper.circle(root.x, root.y, size).attr({fill:'#eeeeff'});
	}

	function draw(){
		const paper = $S('#main');
		const shape = {x:30, y:30, size:20};
		branch(paper, {x,y}=shape, shape.size);
	}

	return {draw};

})(jQuery, Clarino.version('1.4.0'), Snap);
