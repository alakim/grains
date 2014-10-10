<?php
class JSONDB{
	public function __construct($root){
		$this->root = $root;
	}
	
	static function getObject($filePath){
		$f = fopen($filePath, "r") or die("Unable to open file ".$filePath);
		$json = fread($f,filesize($filePath));
		fclose($f);
		$obj = json_decode($json) or die("JSON parsing error ".$filePath);
		return $obj;
	}
	
	static function getDirectory($filePath){
		$obj = new stdClass();
		foreach(scandir($filePath) as $nm){
			if($nm!="." && $nm!=".."){
				$pp = $filePath."/".$nm;
				if(is_dir($pp))
					$val = JSONDB::getDirectory($pp);
				else
					$val = JSONDB::getObject($pp);
				$obj->$nm = $val;
			}
		}
		return $obj;
	}
	
	public function getValue($path){
		$steps = explode("/", $path);
		$fPath = $this->root;
		$obj = null;
		foreach($steps as $st){
			if($obj!=null){
				$a = get_object_vars($obj);
				$obj = $a[$st];
			}
			else{
				$fPath = $fPath."/".$st;
				if(file_exists($fPath)){
					if(!is_dir($fPath)){
						$obj = JSONDB::getObject($fPath);
					}
				}
				else{
					die("File ".$fPath." does not exist");
				}
			}
		}
		if($obj==null){
			if(!is_dir($fPath)){
				$obj = JSONDB::getObject($fPath);
			}
			else{
				$obj = JSONDB::getDirectory($fPath);
			}
		}
		//print_r($obj);
		return $obj;
	}
}
