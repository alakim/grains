/*
 */
var layouts = {
    'L': {
        rotation: {
            A: 'c',
            c: 'd',
            d: 'h',
            h: 'g',
            g: 'A'
        },
        cells: {
            c: {
                layout: 'C',
                actions: {
                    c: 'B',
                    g: 'e',
                    A: 'a'
                }
            },
            d: {
                layout: 'R',
                actions: {
                    d: 'C',
                    c: 'b',
                    g: 'e',
                    h: 'f',
                    A: 'a'
                }

            },
            g: {
                layout: 'C',
                actions: {
                    g: 'B',
                    c: 'a',
                    A: 'e'
                }
            },
            h: {
                layout: 'R',
                actions: {
                    h: 'C',
                    c: 'a',
                    d: 'b',
                    g: 'f',
                    A: 'e'
                }

            }
        }
    },
    'C': {
        rotation: {
            a: 'B',
            B: 'd',
            d: 'h',
            h: 'e',
            e: 'a'
        },
        cells: {
            a: {
                layout: 'L',
                actions: {
                    a: 'A',
                    e: 'g',
                    B: 'c'
                }

            },
            d: {
                layout: 'R',
                actions: {
                    d: 'C',
                    h: 'f',
                    B: 'b'
                }

            },
            e: {
                layout: 'L',
                actions: {
                    e: 'A',
                    a: 'c',
                    B: 'g'
                }
            },
            h: {
                layout: 'R',
                actions: {
                    h: 'C',
                    d: 'b',
                    B: 'f'
                }

            }
        },
    },
    'R': {
        rotation: {
            e: 'a',
            f: 'e',
            C: 'f',
            b: 'C',
            a: 'b'
        },
        cells: {
            a: {
                layout: 'L',
                actions: {
                    a: 'A',
                    b: 'c',
                    e: 'g',
                    f: 'h',
                    C: 'd'
                }
            },
            b: {
                layout: 'C',
                actions: {
                    b: 'B',
                    f: 'h',
                    C: 'd'
                }
            },
            e: {
                layout: 'L',
                actions: {
                    e: 'A',
                    a: 'c',
                    b: 'd',
                    f: 'g',
                    C: 'h'
                }
            },
            f: {
                layout: 'C',
                actions: {
                    f: 'B',
                    b: 'd',
                    C: 'h'
                }
            },
        }

    }
};

var currentLayout = 'R';
var currentStates = ['a', 'e', 'b', 'f', 'C'];

var position = {
    a: {left: 0, top: 0, width: 200, height: 200},
    b: {left: 200, top: 0, width: 200, height: 200},
    c: {left: 400, top: 0, width: 200, height: 200},
    d: {left: 600, top: 0, width: 200, height: 200},
    e: {left: 0, top: 200, width: 200, height: 200},
    f: {left: 200, top: 200, width: 200, height: 200},
    g: {left: 400, top: 200, width: 200, height: 200},
    h: {left: 600, top: 200, width: 200, height: 200},
    A: {left: 0, top: 0, width: 400, height: 400},
    B: {left: 200, top: 0, width: 400, height: 400},
    C: {left: 400, top: 0, width: 400, height: 400}
}

var animations = [];

var moveControl = {};

var vertushkaTimer;

var ANIMATION_MANU = 400;
var ANIMATION_AUTO = 800;
var MOVE_CONTROL_DELAY = 400;
var ROTATION_INTERVAL = 9000;


function mousenotlongfunc() {
    if ($('#' + Object.keys(moveControl)[0]).is(':hover')) {
        $('#' + Object.keys(moveControl)[0]).trigger('mousemove', [true]);
    }
}

$(document).ready(function () {
    $(function () {
        $('.vertushka__item').each(function (e) {
            $(this).attr('id', 'nav-fragment-' + e);
            $(this).attr('data-pos', currentStates[e]);
        });
    });

    $(".vertushka__item").mousemove(
		function (e, trigger, noAnimations) {
			if (getCssMediaDesktop()) {
				if (!trigger) {
					if (moveControl[e.currentTarget.id]) {// мышь уже тут была
						if (moveControl[e.currentTarget.id] + MOVE_CONTROL_DELAY < e.timeStamp) { // мышь уже тут долго, продолжаем обработку
						} else { // мышь тут недолго
							var t = moveControl[e.currentTarget.id];
							moveControl = {};
							moveControl[e.currentTarget.id] = t; // сбрасываем записи о мыши с прочих блоков
							var mousenotlong = window.setTimeout(window.mousenotlongfunc, (MOVE_CONTROL_DELAY + moveControl[e.currentTarget.id] - e.timeStamp));
							return;
						}
					} else {
						moveControl[e.currentTarget.id] = e.timeStamp;//записываем время первого захода мыши на блок
						return;
					}
				}

				$(".vertushka__item").removeClass('vertushka__text_big');
				if (animations.length) {
					return false;
				}
				var layoutPos = layouts[currentLayout].cells[$(this).attr('data-pos')];
				if (layoutPos == undefined) {
					return false; //====>>> по большой картинке
				}
				currentLayout = layoutPos.layout;
				for (oldPos in layoutPos.actions) {
					var newPos = layoutPos.actions[oldPos];
					if (newPos == 'A' || newPos == 'B' || newPos == 'C') {
						//увеличение
						animations.push('Grows' + oldPos);

						if (!noAnimations) {
							var ANIM_RAND = ANIMATION_MANU;//
						} else {
							var ANIM_RAND = 10;
						}

						$('.vertushka__item');
						$('.vertushka__item[data-pos=' + oldPos + ']').animate(position[newPos], ANIM_RAND, function () {
							$('.vertushka__item[data-pos=' + oldPos + ']');
							animations.pop();
						});
						animations.push('GrowsImage' + oldPos);
						$('.vertushka__item[data-pos=' + oldPos + '] img').animate({width: 400, height: 400}, ANIM_RAND, function () {
							animations.pop();
						})
						$('.vertushka__item[data-pos=' + oldPos + '] .vertushka__text').addClass('vertushka__text_big');
						$('.vertushka__item[data-pos=' + oldPos + '] .vertushka__b-title').css('display', 'block');
						$('.vertushka__item[data-pos=' + oldPos + '] .vertushka__b-subtitle').css('display', 'block');
						$('.vertushka__item[data-pos=' + oldPos + '] .vertushka__b-author').css('display', 'block');
						$('.vertushka__item[data-pos=' + oldPos + '] .vertushka__s-title').hide();
						$('.vertushka__item[data-pos=' + oldPos + '] .vertushka__s-subtitle').hide();
					} else {
						if (oldPos == 'A' || oldPos == 'B' || oldPos == 'C') {
							//уменьшение
							animations.push('shrink' + oldPos);
							$('.vertushka__item[data-pos=' + oldPos + ']').animate(position[newPos], ANIM_RAND, function () {
								animations.pop();
							});
							if (!$(this).hasClass('vertushka__item_big')) {
								animations.push('shrinkImage' + oldPos);
								$('.vertushka__item[data-pos=' + oldPos + '] img').animate({width: 200, height: 200}, ANIM_RAND, function () {
									animations.pop();
								});
							}
							$('.vertushka__item[data-pos=' + oldPos + '] .vertushka__text').removeClass('vertushka__text_big');
							$('.vertushka__item[data-pos=' + oldPos + '] .vertushka__b-title').hide();
							$('.vertushka__item[data-pos=' + oldPos + '] .vertushka__b-subtitle').hide();
							$('.vertushka__item[data-pos=' + oldPos + '] .vertushka__b-author').hide();
							$('.vertushka__item[data-pos=' + oldPos + '] .vertushka__s-title').css('display', 'block');
							$('.vertushka__item[data-pos=' + oldPos + '] .vertushka__s-subtitle').css('display', 'block');
						} else {
							//перемещение
							animations.push('moving' + oldPos);
							$('.vertushka__item[data-pos=' + oldPos + ']').animate(position[newPos], ANIM_RAND, function () {
								animations.pop();
							});
						}
					}

					$('.vertushka__item[data-pos=' + oldPos + ']').attr('data-pos', newPos);
				}
				$('.vertushka__item').removeClass('vertushka__item_big');
			}
		}
    );
	
	if(getCssMediaPhoneLs()) {
		$('.vertushka__item').hover(
			function () {
				$('.vertushka__s-title, .vertushka__s-subtitle', this).hide();
				$('.vertushka__b-title, .vertushka__b-subtitle, .vertushka__b-author, .vertushka__b-anons', this).css('display', 'block');
			},
			function () {
				$('.vertushka__s-title, .vertushka__s-subtitle', this).css('display', 'block');
				$('.vertushka__b-title, .vertushka__b-subtitle, .vertushka__b-author, .vertushka__b-anons', this).hide();
			}
		);
	}
});