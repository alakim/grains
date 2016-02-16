(function($,$R,$D){
	var staffSize = {w:500, h:24};
	var staffColor = "#888",
		signColor = "#000";
	
	
	var signs = {
		clef: function(paper, x, y){
			var p = "m 1.683657,0.360588 c 1.4602,-0.1294 2.84985,0.4508 3.72775,1.6348 0.84402,1.1382 1.12629,2.6417 0.86388,4.0238 -0.27129,1.4282 -1.18144,2.6206 -2.38695,3.4046 -0.3026,0.1968 -0.62133,0.3685 -0.95011,0.5171 0.0666,0.5232 0.13273,1.0466 0.19956,1.5698 0.12338,0.9702 0.34887,1.9839 0.34256,2.9627 -0.008,1.3301 -0.44281,2.6648 -1.61747,3.4056 -1.16041,0.7316 -2.69236,0.7507 -3.84926,0.014 -1.18308,-0.7535 -2.02055,-2.2808 -1.44175,-3.666 0.5774,-1.3805 2.35914,-1.8196 3.29803,-0.5293 0.52833,0.7256 0.58698,1.8339 -0.0491,2.5166 -0.37925,0.4069 -1.11531,0.731 -1.67004,0.5125 0.0152,0.7248 1.12325,1.0873 1.7135,1.0655 0.85314,-0.037 1.69272,-0.3407 2.24441,-1.016 0.5753,-0.704 0.74051,-1.628 0.71784,-2.5138 -0.0173,-0.6758 -0.15118,-1.3497 -0.24605,-2.018 -0.0965,-0.6816 -0.19302,-1.363 -0.28929,-2.0446 -3.06903,0.7424 -5.90229,-1.1083 -7.125789,-3.8897 -0.59797,-1.3581 -0.84145,-2.9213 -0.58815,-4.3895 0.25727,-1.4915 1.024179,-2.8323 1.956059,-4.0042 0.95221,-1.1973 2.07686,-2.2425 3.19895,-3.2763 0.12899,-0.1187 0.25797,-0.2374 0.38649,-0.3563 0.10539,-0.097 0.13249,-0.083 0.10702,-0.237 -0.0194,-0.1191 -0.0388,-0.2383 -0.0568,-0.3575 -0.0776,-0.5103 -0.13926,-1.023 -0.18016,-1.5373 -0.0722,-0.9017 -0.0944,-1.8212 -0.006,-2.7227 0.11777,-1.2032 0.45122,-2.4174 0.95408,-3.5156 0.25096,-0.5484 0.55637,-1.0859 0.9653,-1.5329 0.28858,-0.3155 0.75522,-0.7319 1.21135,-0.7531 0.29045,-0.014 0.5087,0.3869 0.6267,0.5961 0.26662,0.4732 0.44982,0.9949 0.60848,1.5123 0.37037,1.2104 0.63629,2.5148 0.60591,3.7857 -0.0371,1.5759 -0.56572,3.1536 -1.34735,4.5115 -0.41103,0.7136 -0.90173,1.3805 -1.45577,1.9894 -0.26708,0.2938 -0.54866,0.5739 -0.84355,0.8396 -0.14254,0.1285 -0.0182,0.4926 0.006,0.6795 0.0376,0.2863 0.075,0.5721 0.11263,0.8581 0.0853,0.6538 0.17105,1.3074 0.2568,1.9609 m -0.33251,2.3856 c -1.42469,0.3437 -2.57412,1.96 -2.11402,3.4216 0.10095,0.3206 0.28134,0.6104 0.50917,0.8562 0.11567,0.1248 0.24325,0.2386 0.37785,0.3428 0.15258,0.1173 0.35775,0.1996 0.49608,0.3297 0.11099,0.1047 0.068,0.2769 -0.0664,0.336 -0.15937,0.07 -0.33999,-0.064 -0.47482,-0.1385 -0.33322,-0.1844 -0.63629,-0.4211 -0.89847,-0.6966 -1.05105,-1.1053 -1.39595,-2.7912 -0.80079,-4.2042 0.30448,-0.7225 0.81037,-1.3626 1.42773,-1.8439 0.28485,-0.2218 0.59657,-0.4113 0.93001,-0.5515 0.0802,-0.033 0.16124,-0.064 0.24349,-0.092 0.13786,-0.046 0.0666,-0.1461 0.0502,-0.2727 -0.0367,-0.2879 -0.0734,-0.5758 -0.11029,-0.8639 -0.0839,-0.6578 -0.16778,-1.3163 -0.2519,-1.9743 -2.30587,1.8355 -4.94144,4.1552 -4.88279,7.374 0.053,2.8851 2.69119,5.1468 5.54478,4.9183 0.26101,-0.021 0.52015,-0.065 0.77415,-0.1285 0.18553,-0.047 0.0841,-0.2346 0.0633,-0.3984 -0.0208,-0.1641 -0.0421,-0.3281 -0.0629,-0.4924 -0.0839,-0.6571 -0.16754,-1.3141 -0.25166,-1.9715 -0.16731,-1.3169 -0.33509,-2.6334 -0.50286,-3.9504 m 2.89237,-14.6858 c 0.0266,-0.783 -0.54865,-1.6546 -1.4102,-1.3288 -0.6732,0.2544 -1.1104,0.9216 -1.4088,1.5424 -0.81691,1.699 -0.90571,3.5502 -0.59236,5.3861 1.71935,-1.3303 3.34267,-3.3314 3.41136,-5.5997 m -1.38543,21.2933 c 1.43287,-0.7078 2.35774,-2.3367 2.08902,-3.9317 -0.2505,-1.4864 -1.43825,-2.6321 -2.96131,-2.7153 0.28998,2.2157 0.58067,4.4313 0.87229,6.647";
			paper.path(p).attr({fill:signColor, "stroke-width":0}).transform(["T", x+10, y+11, "S", 1.3]);
		},
		addLines: function(paper, x, y, step, offset){
			y+=3.5;
			var dX = 7;
			for(var yL = offset.y+staffSize.h + step; yL<=y; yL+=step){
				paper.path(["M", x-dX+1, yL, "L", x+dX+1, yL]).attr({stroke:staffColor});
			}
		},
		sharp: function(paper, x, y){
			var p = "m 1.342469,0.9957 c -0.21844,0.060145 -0.43725,0.1164153 -0.655505,0.1678889 -0.08062,0.019003 -0.03505,0.3073659 -0.03505,0.3806097 0,0.5580923 0,1.116738 0,1.6746458 0,0.015128 0.0094,0.092431 -0.0081,0.091509 -0.05203,-9.225e-4 -0.307182,0.015682 -0.336516,-0.023246 -0.05682,-0.071952 0,-0.4359577 0,-0.5211936 0,-0.4961025 0,-0.9927585 0,-1.488861 -0.162723,0.031179 -0.325077,0.059407 -0.486693,0.083944 0,-0.2835662 0,-0.5673169 0,-0.8508831 0,-0.045385 -0.02878,-0.2322771 0.02085,-0.2450071 0.147594,-0.038006 0.296111,-0.077672 0.444813,-0.1188137 0.07011,-0.019556 0.02103,-0.6468335 0.02103,-0.7276416 0,-0.2739726 0,-0.5481296 0,-0.8221022 -0.162723,0.041142 -0.325077,0.082284 -0.486693,0.1236105 0,-0.2855956 0,-0.5713758 0,-0.8571559 0,-0.04188 -0.02657,-0.1968544 0.02085,-0.2108759 0.147594,-0.043909 0.296111,-0.086712 0.444813,-0.1278538 0.05959,-0.016604 0.02103,-0.4870624 0.02103,-0.5497901 0,-0.3708315 0,-0.7414786 0,-1.1117567 0,-0.1105115 -0.06752,-0.494811 0.06273,-0.5055116 0.03764,-0.00406 0.281721,-0.036161 0.281721,-0.00295 0,0.097228 0,0.1950094 0,0.2922374 0,0.5914855 0,1.1829711 0,1.7742721 0.21844,-0.05996 0.437249,-0.1162308 0.655505,-0.1677044 0.08081,-0.018634 0.03505,-0.3077348 0.03505,-0.3806097 0,-0.565103 0,-1.130575 0,-1.6958625 1.84e-4,-0.1699183 0.345003,-0.00572 0.344818,-0.046123 0,0.1857847 0,0.371754 0,0.5571698 0,0.4940731 0,0.9875927 0,1.4809278 0.162539,-0.031364 0.324893,-0.059591 0.486509,-0.084682 0,0.278216 0,0.5560629 0,0.8342788 0,0.077672 0.0369,0.1896591 -0.04483,0.2105069 -0.145012,0.037268 -0.290392,0.076196 -0.436327,0.1167842 -0.04096,0.011254 -0.0053,0.6639914 -0.0053,0.7233983 0,0.2739726 0,0.5483141 0,0.8224712 0.162539,-0.050551 0.324893,-0.1016558 0.486509,-0.1520225 0,0.2693602 0,0.5387204 0,0.8082652 0,0.056639 0.03173,0.232277 0,0.2828282 -0.03634,0.058669 -0.30755,0.1081131 -0.373415,0.1296988 -0.08155,0.028043 -0.112909,0.012915 -0.113094,0.09483 0,0.1121719 0,0.2245283 0,0.3365158 0,0.3654812 0,0.7309625 0,1.0964437 0,0.067525 0.03542,0.5184262 -0.03007,0.523592 -0.03358,0.00406 -0.314746,0.027674 -0.314746,0.011808 0,-0.080255 0,-0.1606937 0,-0.2409483 C 1.342491,2.1198177 1.342491,1.5578511 1.342491,0.9957 M 0.65191,0.058105 c 0.199806,-0.04926 0.399982,-0.099995 0.599788,-0.152207 0.144089,-0.037637 0.09077,-0.1398459 0.09077,-0.2855956 0,-0.4302384 0,-0.8610303 0,-1.2914532 -0.199806,0.048891 -0.399982,0.099995 -0.599788,0.152207 -0.144089,0.037821 -0.09077,0.1398459 -0.09077,0.2857801 0,0.4304229 0,0.8608458 0,1.2912687";
			paper.path(p).attr({fill:signColor, "stroke-width":0}).transform(["T", x-9.5, y+4, "S", 2]);
		},
		flat: function(paper, x, y){
			var p = "m 0.78685,-0.2242889 c 0.100766,-0.019193 0.55751,-0.1394526 0.55781,-0.02849 0,0.185337 0,0.3706741 0,0.5560111 0,0.7788353 0,1.5570708 0,2.3356062 0,1.3042568 0,2.6085135 0,3.9127703 C 1.93426,6.1014616 2.736187,5.6471161 3.46554,6.0690727 4.117818,6.4463444 4.368533,7.1822943 4.117818,7.8945523 3.874001,8.587617 3.296997,9.142428 2.748483,9.598873 2.043723,10.185774 1.398942,10.783171 0.78655,11.34368 c 0,-3.8027076 0,-7.6048154 0,-11.4069233 3e-4,-0.053982 3e-4,-0.1076634 3e-4,-0.1610453 M 1.34466,10.236456 C 1.96365,9.554488 2.869942,8.686283 2.944617,7.6447372 2.977607,7.192191 2.765278,6.6610715 2.274044,6.5872965 1.909668,6.5225185 1.491311,6.9474741 1.368052,7.2536701 c -0.04978,0.1241578 -0.02339,0.2909011 -0.02339,0.4216567 0,0.3325872 0,0.6651742 0,0.9977612 0,0.521223 0,1.041846 0,1.563368";
			paper.path(p).attr({fill:signColor, "stroke-width":0}).transform(["T", x-11, y-5, "S", 1.5]);
		},
		natural: function(paper, x, y){
			var p = "m 0.85319,1.65318 c 0.752,-0.124 1.86,-0.676 1.86,0.238 0,1.367 0,2.735 0,4.103 0,2.514 0,5.026 0,7.538 2.797,-0.848 5.623,-1.581 8.405,-2.083 0,6.414 0,12.828 0,19.241 0,3.361 0,6.725 0,10.086 0,0.997 0.267,1.133 -0.802,1.282 -0.45,0.062 -1.058,0.377 -1.058,-0.157 0,-0.707 0,-1.415 0,-2.124 0,-3.187 0,-6.373 0,-9.56 -2.798,0.848 -5.624,1.579 -8.406,2.076 0.001,-10.213 0.001,-20.426 0.001,-30.64 m 1.86,24.784 c 0.674,-0.125 6.55,-1.41 6.545,-1.743 0,-2.466 0,-4.934 0,-7.4 -0.676,0.132 -6.551,1.428 -6.545,1.761 0,2.46 0,4.923 0,7.382";
			paper.path(p).attr({fill:signColor, "stroke-width":0}).transform(["T", x-14, y-18, "S", .4]);
		},
		whole: function(paper, x, y){
			var p = "M 0.890558,1.1090854 C 2.076764,1.0761814 4.254094,1.8401509 4.299524,3.454775 4.351974,5.0289796 2.132717,5.8251848 0.979414,5.8004648 -0.239529,5.8316988 -2.383954,5.0688984 -2.429719,3.454775 -2.481829,1.8971062 -0.24621,1.0841987 0.890558,1.1090854 Z M 1.334675,5.3982705 C 2.040854,5.272668 2.315943,4.9122294 2.266504,3.8471154 2.184994,2.3888258 1.357057,1.339913 0.535464,1.5005904 c -0.690145,0.1433069 -0.981101,0.4477923 -0.931996,1.5129064 0.06514,1.4577884 0.909447,2.5449501 1.731207,2.3847737 z";
			paper.path(p).attr({fill:signColor, "stroke-width":0}).transform(["T", x, y, "S", 1.5]);
		},
		half: function(paper, x, y){
			var p = "m 1.3105576,0.07516 c 0.2729632,0.03513 0.5459265,0.07477 0.8179888,0.117563 0,8.584379 0,17.168757 0,25.753136 -0.054052,2.643149 -3.3886174,5.427734 -5.9268154,5.26828 -0.763486,-0.03243 -1.533279,-0.202245 -2.140014,-0.671598 -0.971587,-0.763486 -1.177886,-1.832367 -1.148157,-2.951246 0.08513,-2.650356 3.29763,-4.596232 5.928167,-4.782261 0.761684,-0.04865 1.5269723,0.0095 2.4683802,0.562592 C 1.3105576,15.606137 1.3105576,7.840198 1.3105576,0.07516 Z M -6.102691,29.111962 c 0,0.427913 0.211704,0.5707 0.728352,0.710785 0.882401,0.153598 2.530991,-0.488271 3.904816,-1.62787 1.405355,-1.099059 2.7071102,-2.710714 2.6152216,-3.65032 -0.029729,-0.335123 -0.3292675,-0.517549 -0.6337612,-0.531963 -1.3071604,-0.163507 -3.6917604,1.540035 -4.6367714,2.263433 -1.159869,0.92294 -2.039117,1.938219 -1.977857,2.835935 z";
			paper.path(p).attr({fill:signColor, "stroke-width":0}).transform(["T", x+3.5, y-22, "S", .8]);
		},
		quarter: function(paper, x, y){
			var p = "m 0.12463,0.287643 c 0,0.723825 -0.45475,1.455058 -1.084901,1.999659 C -1.573694,2.831186 -2.385219,3.15355 -3.097335,3.113404 -3.550174,3.090704 -3.970274,2.899291 -4.259661,2.619941 -4.565536,2.337963 -4.74237,1.956335 -4.74237,1.53743 c 0,-0.660977 0.449015,-1.268665 1.063155,-1.729868 0.613662,-0.475301 1.391732,-0.799816 2.039566,-0.814153 0.567064,-0.01219 1.039976,0.02485 1.329363,0.281022 0,-4.179019 0,-8.357561 0,-12.536581 0.144812,0.01912 0.290103,0.03967 0.434677,0.06285 2.39e-4,4.495409 2.39e-4,8.990819 2.39e-4,13.486945 z";
			paper.path(p).attr({fill:signColor, "stroke-width":0}).transform(["T", x+3.5, y-1, "S", 1.5]);
		},
		noteHead: function(paper, x, y){
			var p = "m 1.04066,0.091566 c 0,1.839233 -1.155516,3.697288 -2.756723,5.081115 -1.558702,1.382005 -3.62078,2.201128 -5.430259,2.099117 -1.150659,-0.05769 -2.21813,-0.544058 -2.953458,-1.253884 -0.777226,-0.716505 -1.22656,-1.686216 -1.22656,-2.750651 0,-1.679537 1.140943,-3.223666 2.701467,-4.395577 1.55931,-1.207736 3.536378,-2.032324 5.182518,-2.068757 1.440904,-0.03097 2.642568,0.06315 3.377897,0.714077 5.48e-4,3.91e-4 1.021579,0.729699 1.105118,2.57456 z";
			paper.path(p).attr({fill:signColor, "stroke-width":0}).transform(["T", x+5.5, y+1, "S", .6]);
		}
	};


	
	function init(pnl, staff){
		
		var offset = {x:10, y:19};
		var paper = new $R(pnl[0], staffSize.w, staffSize.h+offset.y*2);
		var step = staffSize.h/4,
			stepX = 25,
			beamSize = 20;
			
		var posX = offset.x + stepX;
		
		for(var i=0; i<5; i++){
			var y = offset.y + i*step;
			var p = ["M", offset.x, y, "L", offset.x+staffSize.w, y];
			paper.path(p).attr({stroke:staffColor});
		}
		signs.clef(paper, offset.x, offset.y);
		
		function drawSequence(seq, groupMode){
			groupMode = groupMode || false;
			
			if(!(seq instanceof Array)){
				var chords = [], groups = [];
				seq = seq.replace(/&lt;([a-g]([ei]?s|n)?'* +)*[a-g]([ei]?s|n)?'*&gt;\d/ig, function(x){
					var idx = chords.length;
					chords.push(x);
					return "#CH"+idx;
				});
				seq = seq.replace(/\[([^\]]+)\]/g, function(x){
					x = x.substr(1, x.length-2);
					var idx = groups.length;
					//console.log(x);
					groups.push(x);
					return "#GRP"+idx;
				});
				seq = seq.split(" ");
			}
			//console.log(seq);
			// console.log(groups);
			
			var duration = 1;
			
			var groupSize;
			if(groupMode)
				groupSize = [];
			
			
			var reNote = /([a-g])(((e?s)|(is)|n)?)('*)(\d+)?/i,
				reChord = /#CH(\d+)/,
				reGroup = /#GRP(\d+)/,
				reBar = /\s*\|\s*/,
				reEmpty = /^\s*$/,
				reClef = /\$(\d)([#b])/,
				reChordSym = /[ABCDEFG][b#]?m?\:/;
			var notes = $D("c;d;e;f;g;a;b".split(";")).index(function(x, i){return x;}, function(x, i){return i;}).raw();

			function drawNote(paper, note, octave, alt){
				posY = offset.y + staffSize.h - (notes[note]-1)*step/2;
				posY += octave=="''"?step/2 - 1*staffSize.h
					:octave==""?1*staffSize.h - step/2
					:0;
					
				if(groupSize) groupSize.push({x:posX+3.5, y:posY, dur:duration});
				
				if(posY> offset.y+staffSize.h) signs.addLines(paper, posX, posY, step, offset);
				
				var sign = groupMode?signs.noteHead
					:{1:signs.whole, 2:signs.half, 4:signs.quarter}[duration]; 
				if(sign) sign(paper, posX, posY);
				
				var altSign = {"is":signs.sharp, "s":signs.flat, "es":signs.flat, "n":signs.natural}[alt];
				if(altSign) altSign(paper, posX, posY);
				
				// if(groupMode)
				// 	paper.path(["M", posX+3, posY, "L", posX+3, posY-beamSize]).attr({"stroke-width":1, stroke:signColor});
			}
			
			function drawBeam(){
				//console.log("beam for "+seq.length);
				var iMx = groupSize.length-1;
				paper.path(["M", groupSize[0].x-.5, groupSize[0].y-beamSize, "L", groupSize[iMx].x+.5, groupSize[iMx].y-beamSize]).attr({"stroke-width":2, stroke:signColor});
				// if(duration==16)
				// 	paper.path(["M", groupSize[0].x-.5, groupSize[0].y-beamSize+4, "L", groupSize[iMx].x+.5, groupSize[iMx].y-beamSize+4]).attr({"stroke-width":2, stroke:signColor});
				var bmAng = (groupSize[groupSize.length-1].y - groupSize[0].y)/(groupSize.length-1),
					bmY = groupSize[0].y-beamSize;
				for(var i=0; i<groupSize.length; i++){
					var sz = groupSize[i];
					paper.path(["M", sz.x, sz.y, "L", sz.x, bmY+bmAng*i]).attr({"stroke-width":1, stroke:signColor});
					if(sz.dur==16){
						if(i>0 && groupSize[i-1].dur==16)
							paper.path(["M", groupSize[i-1].x, bmY+bmAng*(i-1)+4, "L", sz.x, bmY+bmAng*i+4]).attr({"stroke-width":2, stroke:signColor});
						else if(i==groupSize.length-1 && groupSize[i-1].dur!=16)
							paper.path(["M", groupSize[i-1].x+stepX*.4, bmY+bmAng*(i-1)*1.6+4, "L", sz.x, bmY+bmAng*i+4]).attr({"stroke-width":2, stroke:signColor});
						else if(i==0 && groupSize[1].dur!=16)
							paper.path(["M", sz.x, bmY+bmAng*i+4, "L", groupSize[1].x-stepX*.4, bmY+bmAng*(i-1)*1.4+1.4]).attr({"stroke-width":2, stroke:signColor});
						
					}
				}
			}

			
			$D.each(seq, function(s, i){
				var mt;
				// console.log("'"+s+"'");
				if(s.match(reEmpty)){
				}
				else if(mt = s.match(reClef)){
					var num = +mt[1],
						sign = mt[2];
					// var signs = "f;c;g;d;a;e;b".split(";");
					var notes = [4,1,5,2,6,3,7];
					if(sign=="#"){
						for(var i=0; i<num; i++){
							var posY = offset.y + staffSize.h - (notes[i]-2)*step/2;
							posY+=step/2 - 1*staffSize.h;
							signs.sharp(paper, posX+10+5*i, posY);
						}
					}
					else if(sign=="b"){
						for(var i=0; i<num; i++){
							var posY = offset.y + staffSize.h - (notes[notes.length-i-1]-1.5)*step/2;
							if(i%2) posY+=step/2 - 1*staffSize.h;
							signs.flat(paper, posX+10+5*i, posY);
						}
					}
					posX+=num*stepX*.2;
				}
				else if(s.match(reChordSym)){
					var sym = s.replace(":", "");
					paper.text(posX+24, offset.y-12, sym).attr({"stroke-width":0, fill:signColor, "font-size":14});
				}
				else if(s.match(reBar)){
					posX+=15;
					paper.path(["M", posX, offset.y, "L", posX, offset.y + staffSize.h]).attr({stroke:staffColor})
				}
				else if(mt = s.match(reChord)){
					posX+=24;
					$D.each(s.split(" "), function(n){
						var cIdx = +n.match(/\d+/);
						var chrd = chords[cIdx];
						var dur = chrd.match(/\d+$/);
						if(dur) duration = +dur;
						chrd = chrd.replace(/^&lt;/, "").replace(/&gt;\d$/, "");
						$D.each(chrd.split(" "), function(nn){
							var mmt = nn.match(/([a-g])((is)|(es)|n)?(''*)/i);
							var note = mmt[1],
								alt = mmt[2],
								octave = mmt[5];
							drawNote(paper, note, octave, alt);
						});
						
					});
				}
				else if(mt=s.match(reGroup)){
					var gIdx = +mt[1];
					// paper.path(["M", posX, offset.y+15, "L", posX+20, offset.y+15]).attr({"stroke-width":2, stroke:signColor});
					drawSequence(groups[gIdx], true);
				}
				else{
					mt = s.match(reNote);
					if(!mt)
						console.log(s, mt);
					var note = mt[1],
						alt = mt[2]
						octave = mt[6];
					if(mt[7])
						duration = +mt[7];
					posX += alt?24:15;
					drawNote(paper, note, octave, alt);
				}
			});
			if(groupMode) drawBeam();
		}
		
		drawSequence(staff);
		
	}
	
	$.fn.staff = function(){
		$(this).each(function(i,el){el=$(el);
			var staff = el.html();
			el.html("");
			init(el, staff);
		});
	};
	
})(jQuery, Raphael, JDB);
