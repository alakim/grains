///<module>
///<summary>
///Заплатка для IE. Замена drop down lists для корректного отображения слоев
///</summary>
///</module>

///<public/><summary>Корневой объект модуля</summary>
var IEDDL = new Object();

///<private/><summary>Возвращает HTML-элемент, заданный идентификатором</summary>
///<param name="id">идентификатор элемента</param>
IEDDL.getElement = function(id){
	return document.getElementById(id);
}

IEDDL.imagePath = "ddl.gif";

///<public/><summary>Заменяет выпадающий список</summary>
 ///<param name="id">идентификатор списка</param>
IEDDL.replaceDDL = function(id){var _=IEDDL;
	var el = _.getElement(id);
	if(el.size==0)
		_._replaceSimpleDDL(el);
	else
		_._replaceMultilineDDL(el);
}

///<private/><summary>Заменяет все выпадающие списки</summary>
IEDDL.replaceDDLs = function(root){var _=IEDDL;
	root = root?root:document;
	var coll = root.getElementsByTagName("select");
	for(var i=0; i<coll.length; i++){
		var el = coll[i];
		if(el.size==0)
			_._replaceSimpleDDL(el);
		else
			_._replaceMultilineDDL(el);
	}
	_.buildLstView();
	_.configWin();
}

///<private/><summary>Заменяет заданный простой выпадающий список</summary>
///<param name="el">список</param>
IEDDL._replaceSimpleDDL = function(el){
	var val = IEDDL.getOption(el, el.value);
	if(val=="")
		val = "&nbsp;";
	var html = "<div class=ieddlfld onclick=\"IEDDL.openList('"+el.name+"')\" style=\"cursor:default; width:"+el.style.width+"; height:9px; background-color:white; border:1 solid #7F9DB9;\"><table border=0 width=100% cellpadding=0 cellspacing=0><tr><td class=ieddlfld><span class=ieddlfld style=\"padding-left:4px;\" id=\"tb_"+el.name+"\">"+val+"</span></td><td width=\"17\" height=\"19\"><img class=ieddlfld src=\""+IEDDL.imagePath+"\" width=\"17\" height=\"19\" border=\"0\"></td></tr></table></div>";
	el.style.display = "none";
	el.outerHTML = html+el.outerHTML;	
}

///<private/><summary>Заменяет заданный многострочный список</summary>
///<param name="el">список</param>
IEDDL._replaceMultilineDDL = function(el){
	el.style.display = "none";
	var html = "<div id=\"mb_"+el.name+"\" class=ieddlfld style=\"cursor:default; overflow-y:auto; padding:1px; width:"+el.style.width+"; height:"+el.style.height+"; background-color:white; border:1 solid #7F9DB9;\">";
	html+="</div>";
	el.outerHTML = html+el.outerHTML;	
	IEDDL._fillMultilineDDL(el);
}

///<private/><summary>Формирует элементы заданного многострочного списка</summary>
///<param name="el">список</param>
IEDDL._fillMultilineDDL = function(el){
	var dsp = IEDDL.getElement("mb_"+el.name);
	var html = "";
	var aOpt = el.options;
	if(aOpt.length==0)
		html = "&nbsp;";
	else{
		var selId = el.id;
		for(var i=0; i<aOpt.length; i++){
			var val = aOpt[i].value;
			html+="<span id=\"mb_"+el.name+"_"+val+"\" style=\"cursor:default; width:100%; padding-left:3px;\" onmouseover=\"this.style.backgroundColor=this.checked?'#B2B4BF':'#EEEEEE'\" onmouseout=\"this.style.backgroundColor=this.checked?'#B2B4BF':'white'\" onclick=\"IEDDL.setMultilineListValue('"+selId+"', '"+val+"')\">"+aOpt[i].innerText+"</span><br>";
		}
	}
	dsp.innerHTML = html;	
}

///<public/><summary>Обновляет содержимое заданного многострочного списка</summary>
///<param name="id">идентификатор списка</param>
IEDDL.updateMultilineDDl = function(id){var _=IEDDL;
	_._fillMultilineDDL(_.getElement(id));
}

///<private/><summary>Возвращает элемент списка с заданным значением</summary>
///<param name="ddl">список</param>
///<param name="val">значение элемента</param>
IEDDL.getOption = function(ddl, val){
	var coll = ddl.options;
	for(var i=0; i<coll.length; i++){
		var el = coll[i];
		if(el.value==val){
			return el.innerText;
		}
	}
	return "";
}

///<private/><summary>Открывает заданный выпадающий список</summary>
///<param name="selId">идентификатор списка</param>
IEDDL.openList = function(selId){var _=IEDDL;
	var selLst = _.getElement("ieddlSelLst");
	if(selLst.style.display!="none"){
		selLst.style.display = "none";
		return;
	}
	
	var sel = _.getSelectElement(selId);
	
	var lst = "";
	for(var i=0; i<sel.options.length; i++){
		var el = sel.options[i];
		var val = el.value;
		if(val.match(/\"/ig))
			val = val.replace(/\"/ig, "\\x22")
		lst+="<span style=\"cursor:default; width:100%; padding-left:3px;\" onmouseover=\"this.style.backgroundColor='#B2B4BF'\" onmouseout=\"this.style.backgroundColor='white'\" onclick=\"IEDDL.setListValue('"+selId+"', '"+val+"')\">"+el.innerText+"</span><br>";
	}
	selLst.innerHTML = lst;
	IEDDL.moveLst("ieddlSelLst", "tb_"+selId, 0, 20);
	selLst.style.width = sel.style.width;
	selLst.style.display = "block";
}

///<private/><summary>Устанавливает значение заданного выпадающего списка</summary>
///<param name="selId">идентификатор списка</param>
///<param name="val">устанавливаемое значение</param>
IEDDL.setListValue = function(selId, val){var _=IEDDL;
	var sel = _.getSelectElement(selId);
	sel.value = val;
	var tb = _.getElement("tb_"+selId);
	for(var i=0; i<sel.options.length; i++){
		var el = sel.options[i];
		if(el.value==val){
			tb.innerText = el.innerText;
			break;
		}
	}
	if(sel.onchange!=null)
		sel.onchange();
		
	_.getElement('ieddlSelLst').style.display = "none";
}

///<private/><summary>Устанавливает значение заданного многострочного списка</summary>
///<param name="selId">идентификатор списка</param>
///<param name="val">устанавливаемое значение</param>
IEDDL.setMultilineListValue = function(selId, val){var _=IEDDL;
	var sel = _.getSelectElement(selId);
	sel.value = val;
	_.syncDisplay(selId);
	
	if(sel.onchange!=null)
		sel.onchange();
		
	_.getElement('ieddlSelLst').style.display = "none";
}

///<public/><summary>Отображает ("синхронизирует") текущее значение заданного выпадающего списка</summary>
///<param name="selId">идентификатор списка</param>
IEDDL.syncDisplay = function(selId){var _=IEDDL;
	var dspNm = "tb_"+selId;
	var dspl = _.getElement(dspNm);
	if(dspl==null)
		_.syncMultilineDisplay(selId);
	else{
		var sel = _.getSelectElement(selId);
		var idx = sel.selectedIndex;
		if(idx>=0 && sel.options[idx]!=null)
			dspl.innerText = sel.options[idx].text;
	}
}

///<public/><summary>Отображает ("синхронизирует") текущее значение заданного многострочного списка</summary>
///<param name="selId">идентификатор списка</param>
IEDDL.syncMultilineDisplay = function(selId){var _=IEDDL;
	var sel = _.getSelectElement(selId);
	var idx = sel.selectedIndex;
	if(idx>=0 && sel.options[idx]!=null){
		var txt = sel.options[idx].text;
		var dspl = _.getElement("mb_"+selId+"_"+sel.value);
		_._resetMultilineDisplay(selId);
		if(dspl!=null){
			dspl.checked = true;
			dspl.style.backgroundColor = "#B2B4BF";
		}
	}
}

///<public/><summary>Управляет отображением заданного выпадающего списка</summary>
///<param name="selId">идентификатор выпадающего списка</param>
///<param name="show">режим отображения (true - показать, false - скрыть)</param>
IEDDL.showDDL = function(selId, show){
	var dspl = IEDDL.getElement("tb_"+selId);
	if(dspl)
		dspl.style.display = show?"block":"none";
}

///<public/><summary>Управляет отображением заданного многострочного селектора</summary>
///<param name="selId">идентификатор селектора</param>
///<param name="show">режим отображения (true - показать, false - скрыть)</param>
IEDDL.showMultilineDDL = function(selId, show){
	var dspl = IEDDL.getElement("mb_"+selId);
	if(dspl)
		dspl.style.display = show?"block":"none";
}

///<private/><summary>Сбрасывает значение заданного многострочного селектора</summary>
///<param name="selId">идентификатор селектора</param>
IEDDL._resetMultilineDisplay = function(selId){
	var coll = document.getElementsByTagName("span");
	for(var i=0; i<coll.length; i++){
		var el = coll[i];
		if(el.id.match("mb_"+selId)){
			el.checked = false;
			el.style.backgroundColor = "white";
		}
	}
}

///<private/><summary>Возвращает выпадающий список, заданный его идентификатором (атрибут id), или именем (атрибут name)</summary>
///<param name="selId">идентификатор или имя выпадающего списка</param>
IEDDL.getSelectElement = function(selId){
	var sel = IEDDL.getElement(selId);
	if(sel!=null)
		return sel;
	var coll = document.getElementsByTagName("select");
	for(var i=0; i<coll.length; i++){
		var el = coll[i];
		if(el.name==selId){
			return el;
		}
	}
	return null;
}

///<private/><summary>Изменяет расположение (перемещает) "окно" выпадающего списка</summary>
///<param name="divId">идентификтор "окна"</param>
///<param name="ancorId">идентификатор метки</param>
///<param name="offsetX">смещение по горизонтали</param>
///<param name="offsetY">смещение по вертикали</param>
IEDDL.moveLst = function (divId, ancorId, offsetX, offsetY){var _=IEDDL;
	var c = _.getAnchorPosition(ancorId);
	var o = _.getElement(divId);
	var offX = offsetX!=null?offsetX:0;
	var offY = offsetY!=null?offsetY:0;
	if (o.style) {
		o.style.left = c.x + offX;
		o.style.top = c.y + offY;
	}
}

///<private/><summary>Возвращает экземпляр метки, заданной ее идентификатором</summary>
///<param name="ancId">идентификатор метки</param>
IEDDL.getAnchorPosition = function (ancId){var _=IEDDL;
	var coordinates = new Object();
	var anc = _.getElement(ancId);
	if(anc==null){
		coordinates.x = 0;
		coordinates.y = 0;
	}	
	else{
		coordinates.x = _.getPageOffsetLeft(anc);
		coordinates.y = _.getPageOffsetTop(anc);
	}
	return coordinates;
}


///<private/><summary>Возвращает горизонтальное смещение данного элемента внутри страницы</summary>
///<param name="el">элемент, для которого определяется смещение</param>
IEDDL.getPageOffsetLeft = function (el){
	var ol=el.offsetLeft;
	while((el=el.offsetParent) != null){
		ol += el.offsetLeft;
	}
	return ol;
}

///<private/><summary>Возвращает вертикальное смещение данного элемента внутри страницы</summary>
///<param name="el">элемент, для которого определяется смещение</param>
IEDDL.getPageOffsetTop = function(el){
	var ot=el.offsetTop;
	while((el=el.offsetParent) != null){
		ot += el.offsetTop;
		if(!el.tagName.match(/body/i) && el.scrollTop!=0){
			ot-=el.scrollTop;
		}
	}
	return ot + 4;
}

///<private/><summary>Формирует отображение списка</summary>
IEDDL.buildLstView = function(){
	var div = document.createElement("DIV");
	div.id="ieddlSelLst";
	var ds = div.style;
	ds.zIndex=9000;
	ds.display = "none";
	ds.backgroundColor = "white";
	ds.borderWidth = 1;
	ds.borderStyle = "solid";
	ds.borderColor = "black";
	ds.margin = 0;
	ds.position = "absolute";
	document.body.appendChild(div);
}

///<public/><summary>Закрывает все списки</summary>
IEDDL.closeAll = function(){
	if(event.srcElement.className=="ieddlfld")
		return;
	var lst = IEDDL.getElement("ieddlSelLst");
	if(lst)lst.style.display = "none";
}

///<private/><summary>Конфигурирует окно</summary>
IEDDL.configWin = function(){var _=IEDDL;
	_.addEventHandler(document, "click", _.docOnClick);
}

///<private/><summary>Добавляет обработчик события к заданному элементу</summary>
 ///<param name="element">DOM-элемент</param>
 ///<param name="event">имя события (без префикса "on")</param>
 ///<param name="handler">функция-обработчик</param>
 ///<optimize>addEventHandler</optimize>
IEDDL.addEventHandler = function(element, event, handler){
	if(element.addEventListener)
		element.addEventListener(event, handler, true);
	else
		element.attachEvent("on"+event, handler);
}

///<private/><summary>Обработчик события для документа</summary>
 ///<optimize>docOnClick</optimize>
IEDDL.docOnClick = function(){
	IEDDL.closeAll();
}

///<public/><summary>Инициализирует модуль</summary>
IEDDL.init = function(){
	if(window.navigator.userAgent.match(/MSIE/i) && !(window.navigator.userAgent.match(/Opera/i))){
		IEDDL.replaceDDLs();
	}
}

IEDDL.addEventHandler(window, "load", IEDDL.init);


///<optimization>
///<item name="getElement"/>
///<item name="replaceDDLs"/>
///<item name="_replaceSimpleDDL"/>
///<item name="_replaceMultilineDDL"/>
///<item name="_fillMultilineDDL"/>
///<item name="getOption"/>
///<item name="openList"/>
///<item name="setListValue"/>
///<item name="setMultilineListValue"/>
///<item name="_resetMultilineDisplay"/>
///<item name="getSelectElement"/>
///<item name="moveLst"/>
///<item name="getAnchorPosition"/>
///<item name="coordinates"/>
///<item name="getPageOffsetLeft"/>
///<item name="getPageOffsetTop"/>
///<item name="buildLstView"/>
///<item name="configWin"/>
///</optimization>
