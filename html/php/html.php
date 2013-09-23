<?php

class Html {
	public static function tag($tagName, $children){
		$content = '';
		$attrs = '';
		foreach($children as $t){
			if(gettype($t)=="array"){
				foreach(array_keys($t) as $k){
					$attrs.=' '.$k.'="'.$t[$k].'"';
				}
			}
			else
				$content .= $t;
		}
		return "<$tagName$attrs>$content</$tagName>";
	}
	
	public static function div(){return Html::tag("div", func_get_args());}
	public static function span(){return Html::tag("span", func_get_args());}
	public static function a(){return Html::tag("a", func_get_args());}
	public static function ul(){return Html::tag("ul", func_get_args());}
	public static function ol(){return Html::tag("ol", func_get_args());}
	public static function li(){return Html::tag("li", func_get_args());}
	public static function p(){return Html::tag("p", func_get_args());}
	public static function img(){return Html::tag("img", func_get_args());}
}

