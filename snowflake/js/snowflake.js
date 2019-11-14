const Snowflake = (function($, $C, $S){const $H = $C.simple;
	const color = '#eeeeff';
	const strokeWidth = 2;
	let paper;

	const Settings = {
		branchLevel: 2,
		doubleBranchesPropability: .7,
		highlightNodes: false,
		levelLengthFactor: .7
	};

	function randomLength(lng){
		//return lng*.4;
		// const ss = new Date().getTime();
		const rr = Math.random();
		return Settings.levelLengthFactor * (rr+.1)*lng;
	}

	function draw(snapPaper, pos, size){
		paper = snapPaper;
		const path = buildPath(pos, size);
		paper.path(path).attr({stroke:color, strokeWidth:strokeWidth});
	}

	function* hexRay(){
		for(let i=0; i<6; i++)
			yield 60*i;
	}

	function buildPath(pos, size){

		const levelSizes = [];
		const levelNodes = [];

		function branchCount(){
			return Math.random()>Settings.doubleBranchesPropability?1:2;
		}

		function branch(root, directions, level=0){
			let size = levelSizes[level];
			if(!size){
				size = randomLength(levelSizes[level-1]);
				levelSizes[level] = size;
			}

			let nodeLng = levelNodes[level];
			if(!nodeLng){
				const bCount = branchCount();
				if(level===0 && bCount>1){
					nodeLng = [];
					for(let i=0; i<bCount; i++){
						nodeLng[i] = i*size/2 + randomLength(size/2);
					}
				}
				else{
					nodeLng = randomLength(size);

				}
				levelNodes[level] = nodeLng;
			}

			// console.log(root, directions, size);
			if(level>Settings.branchLevel) return;
			if(size<1) return;

			let path = [];
			for(let dir of directions){
				const dR = dir*Math.PI/180;

				function ptAtLng(lng){
					return [root[0]+Math.cos(dR)*lng, root[1]+Math.sin(dR)*lng];
				}

				const pt = ptAtLng(size);
				path = path.concat(['M', root[0], root[1], 'L', ...pt]);

				function addNode(pos, xIdx){
					const node = ptAtLng(pos);
					// if(xIdx!=null) console.log(xIdx, pos);
					//console.log('xIdx: %o', xIdx);
					if(Settings.highlightNodes && xIdx!=null) paper.circle(...node, 5).attr({fill:(xIdx?'#ff0000':'#00ff00')});
					// console.log('root: %o, x: %o, y:%o, xIdx: %o', root, x, y, xIdx);
					if(Settings.branchLevel>0) path = path.concat(branch(node, [dir+60, dir-60], level+1));
				}
				if(nodeLng instanceof Array){
					for(let i=0; i<nodeLng.length; i++) addNode(nodeLng[i], i);
					// const i = 1; addNode(nodeLng[i], i);
				}
				else addNode(nodeLng);
			}

			return path;
		}

		levelSizes[0] = size;
		levelNodes[0] = 0;
		const snowflake = branch(pos, Array.from(hexRay())).join(' ');
		// console.log('levelNodes: %o', levelNodes);
		return snowflake;
	}

	return {draw, buildPath,
		settings: function(S){$C.extend(Settings, S);}
	};

})(jQuery, Clarino.version('1.4.0'), Snap);
