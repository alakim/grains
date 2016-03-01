var XEdit = (function($){
	function extend(o,s){for(var k in s){o[k]=s[k];}}
	
	var XEdit={
		lang: "", //"en"|"de"|fr"| ...
		mode: "nerd", //"nerd"|"laic"
	};
	extend(XEdit, {
		setMode: function(mode) {
			if(mode=="nerd" || mode=="laic") XEdit.mode=mode;
			if(mode=="nerd") $(".xedit").removeClass("laic").addClass("nerd");
			if(mode=="laic") $(".xedit").removeClass("nerd").addClass("laic");
		},
		xmlEscape: function(str) {
			return String(str)
				.replace(/&/g, '&amp;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&apos;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');
		},
		xmlUnscape: function(value){
			return String(value)
				.replace(/&quot;/g, '"')
				.replace(/&#39;/g, "'")
				.replace(/&lt;/g, '<')
				.replace(/&gt;/g, '>')
				.replace(/&amp;/g, '&');
		},
		isNamespaceDeclaration: function(attributeName) {
			var ret=false;
			if(attributeName=="xmlns") ret=true;
			if(attributeName.length>=6 && attributeName.substring(0, 6)=="xmlns:") ret=true;
			return ret;
		},
		namespaces:{},
		xml2js: function(xml, jsParent) {
			if(typeof(xml)=="string") xml=$.parseXML(xml);
			if(xml.documentElement) xml=xml.documentElement;
			var js=new XEdit.surrogate(jsParent);
			js.type="element";
			js.name=xml.nodeName;
			js.htmlID="";
			js.attributes=[];
			for(var i=0; i<xml.attributes.length; i++) {
				var attr=xml.attributes[i];
				if(!XEdit.isNamespaceDeclaration(attr.nodeName)) {
					if(attr.name!="xml:space") {
						js["attributes"].push({type: "attribute", name: attr.nodeName, value: attr.value, htmlID: ""});
					}
				} else {
					XEdit.namespaces[attr.nodeName]=attr.value;
				}
			}
			js.children=[];
			for(var i=0; i<xml.childNodes.length; i++) {
				var child=xml.childNodes[i];
				if(child.nodeType==1) { //element node
					js["children"].push(XEdit.xml2js(child, js));
				}
				if(child.nodeType==3) { //text node
					js["children"].push({type: "text", value: child.nodeValue, htmlID: ""});
				}
			}
			js=XEdit.enrichElement(js);
			return js;
		},
		js2xml: function(js) {
			var xml="<"+js.name;
			for(var i=0; i<js.attributes.length; i++) {
				var att=js.attributes[i];
				xml+=" "+att.name+"='"+XEdit.xmlEscape(att.value)+"'";
			}
			if(js.children.length>0) {
				var hasText=false;
				for(var i=0; i<js.children.length; i++) {
					var child=js.children[i];
					if(child.type=="text") hasText=true;
				}
				if(hasText) xml+=" xml:space='preserve'";
				xml+=">";
				for(var i=0; i<js.children.length; i++) {
					var child=js.children[i];
					if(child.type=="text") xml+=XEdit.xmlEscape(child.value); //text node
					else if(child.type=="element") xml+=XEdit.js2xml(child); //element node
				}
				xml+="</"+js.name+">";
			} else {
				xml+="/>";
			}
			return xml;
		},
		enrichElement: function(jsElement) {
			jsElement.hasAttribute=function(name) {
				var ret=false;
				for(var i=0; i<this.attributes.length; i++) {
					if(this.attributes[i].name==name) ret=true;
				}
				return ret;
			};
			jsElement.getAttributeValue=function(name, ifNull) {
				var ret=ifNull;
				for(var i=0; i<this.attributes.length; i++) {
					if(this.attributes[i].name==name) ret=this.attributes[i].value;
				}
				return ret;
			};
			jsElement.hasChildElement=function(name) {
				var ret=false;
				for(var i=0; i<this.children.length; i++) {
					if(this.children[i].name==name) ret=true;
				}
				return ret;
			};
			return jsElement;
		},
		verifyDocSpec: function() { 
			if(!XEdit.docSpec || typeof(XEdit.docSpec)!="object") XEdit.docSpec={};
			if(!XEdit.docSpec.elements || typeof(XEdit.docSpec.elements)!="object") XEdit.docSpec.elements={};
			if(!XEdit.docSpec.onchange || typeof(XEdit.docSpec.onchange)!="function") XEdit.docSpec.onchange=function(){};
			if(!XEdit.docSpec.validate || typeof(XEdit.docSpec.validate)!="function") XEdit.docSpec.validate=function(){};
		},
		asFunction: function(specProperty, defaultValue){
			if(typeof(specProperty)=="function")
				return specProperty;
			else if (typeof(specProperty)==typeof(defaultValue))
				return function() { return specProperty; }
			else
				return function() { return defaultValue };
		},
		verifyDocSpecElement: function(name) { //make sure the DocSpec object has such an element, that the element has everything it needs
			if(!XEdit.docSpec.elements[name] || typeof(XEdit.docSpec.elements[name])!="object") XEdit.docSpec.elements[name]={};
			var spec=XEdit.docSpec.elements[name];
			if(!spec.attributes || typeof(spec.attributes)!="object") spec.attributes={};
			if(!spec.menu || typeof(spec.menu)!="object") spec.menu=[];
			if(!spec.inlineMenu || typeof(spec.inlineMenu)!="object") spec.inlineMenu=[];
			if(!spec.canDropTo || typeof(spec.canDropTo)!="object") spec.canDropTo=[];
			if(!spec.mustBeAfter || typeof(spec.mustBeAfter)!="object") spec.mustBeAfter=[];
			if(!spec.mustBeBefore || typeof(spec.mustBeBefore)!="object") spec.mustBeBefore=[];
			spec.oneliner=XEdit.asFunction(spec.oneliner, false);
			spec.hasText=XEdit.asFunction(spec.hasText, false);
			spec.collapsible=XEdit.asFunction(spec.collapsible, true);
			spec.collapsed=XEdit.asFunction(spec.collapsed, false);
			for(var i=0; i<spec.menu.length; i++) XEdit.verifyDocSpecMenuItem(spec.menu[i]);
			for(var i=0; i<spec.inlineMenu.length; i++) XEdit.verifyDocSpecMenuItem(spec.inlineMenu[i]);
		},
		verifyDocSpecAttribute: function(elementName, attributeName) {
			var elSpec=XEdit.docSpec.elements[elementName];
			if(!elSpec.attributes[attributeName] || typeof(elSpec.attributes[attributeName])!="object") elSpec.attributes[attributeName]={};
			var spec=elSpec.attributes[attributeName];
			if(!spec.asker || typeof(spec.asker)!="function") spec.asker=function(){return ""};
			if(!spec.menu || typeof(spec.menu)!="object") spec.menu=[];
			for(var i=0; i<spec.menu.length; i++) XEdit.verifyDocSpecMenuItem(spec.menu[i]);
		},
		verifyDocSpecMenuItem: function(menuItem) {
			if(!menuItem.caption) menuItem.caption="?";
			if(!menuItem.action || typeof(menuItem.action)!="function") menuItem.action=function(){};
			if(!menuItem.hideIf) menuItem.hideIf=function(){return false;};
		},
		nextID: function() { 
			return "xedit"+(++XEdit.lastIDNum);
		},
		lastIDNum: 0,
		docSpec: null,
		refresh: function() {
			$(".xedit .children ").each(function(){ //determine whether each element does or doesn't have children:
				if(this.childNodes.length==0 && !$(this.parentNode).hasClass("hasText")) $(this.parentNode).addClass("noChildren");
				else {
					$(this.parentNode).removeClass("noChildren");
					XEdit.updateCollapsoid(this.parentNode.id);
				}
			});
			var merged=false; while(!merged) { //merge adjacent text nodes
				merged=true; var textnodes=$(".xedit .textnode").toArray();
				for(var i=0; i<textnodes.length; i++) {
					var $this=$(textnodes[i]);
					if($this.next().hasClass("textnode")) {
						var js1=XEdit.harvestText($this.toArray()[0]);
						var js2=XEdit.harvestText($this.next().toArray()[0]);
						js1.value+=js2.value;
						$this.next().remove();
						$this.replaceWith(XEdit.renderText(js1));
						merged=false;
						break;
					}
				}
			}
			$(".xedit .element ").each(function(){ //reorder elements if necessary
				var elSpec=XEdit.docSpec.elements[this.getAttribute("data-name")];
				if(elSpec.mustBeBefore) { //is it after an element it cannot be after? then move it up until it's not!
					var $this=$(this);
					var ok; do {
						ok=true;
						for(var ii=0; ii<elSpec.mustBeBefore.length; ii++) {
							if( $this.prevAll("*[data-name='"+elSpec.mustBeBefore[ii]+"']").toArray().length>0 ) {
								$this.prev().before($this);
								ok=false;
							}
						}
					} while(!ok)
				}
				if(elSpec.mustBeAfter) { //is it before an element it cannot be before? then move it down until it's not!
					var $this=$(this);
					var ok; do {
						ok=true;
						for(var ii=0; ii<elSpec.mustBeAfter.length; ii++) {
							if( $this.nextAll("*[data-name='"+elSpec.mustBeAfter[ii]+"']").toArray().length>0 ) {
								$this.next().after($this);
								ok=false;
							}
						}
					} while(!ok)
				}
			});
			$(".xedit .attribute ").each(function(){ //reorder attributes if necessary
				var atName=this.getAttribute("data-name");
				var elName=this.parentNode.parentNode.parentNode.getAttribute("data-name");
				var elSpec=XEdit.docSpec.elements[elName];
				var mustBeAfter=[]; for(var sibName in elSpec.attributes) {
					if(sibName==atName) break; else mustBeAfter.push(sibName);
				}
				var mustBeBefore=[]; var seen=false; for(var sibName in elSpec.attributes) {
					if(sibName==atName) seen=true; else if(seen) mustBeBefore.push(sibName);
				}
				if(mustBeBefore.length>0) { //is it after an attribute it cannot be after? then move it up until it's not!
					var $this=$(this);
					var ok; do {
						ok=true;
						for(var ii=0; ii<mustBeBefore.length; ii++) {
							if( $this.prevAll("*[data-name='"+mustBeBefore[ii]+"']").toArray().length>0 ) {
								$this.prev().before($this);
								ok=false;
							}
						}
					} while(!ok)
				}
				if(mustBeAfter.length>0) { //is it before an attribute it cannot be before? then move it down until it's not!
					var $this=$(this);
					var ok; do {
						ok=true;
						for(var ii=0; ii<mustBeAfter.length; ii++) {
							if( $this.nextAll("*[data-name='"+mustBeAfter[ii]+"']").toArray().length>0 ) {
								$this.next().after($this);
								ok=false;
							}
						}
					} while(!ok)
				}
			});
		},
		harvest: function() {
			var rootElement=$(".xedit .element").first().toArray()[0];
			var js=XEdit.harvestElement(rootElement);
			for(var key in XEdit.namespaces) {
				js.attributes.push({
					type: "attribute",
					name: key,
					value: XEdit.namespaces[key],
					parent: js
				});
			}
			return XEdit.js2xml(js);
		},
		harvestElement: function(htmlElement, jsParent) {
			var js=new XEdit.surrogate(jsParent);
			js.type="element";
			js.name=htmlElement.getAttribute("data-name");
			js.htmlID=htmlElement.id;
			js.attributes=[];
			var htmlAttributes=$(htmlElement).find(".tag.opening > .attributes").toArray()[0];
			for(var i=0; i<htmlAttributes.childNodes.length; i++) {
				var htmlAttribute=htmlAttributes.childNodes[i];
				if($(htmlAttribute).hasClass("attribute")) js["attributes"].push(XEdit.harvestAttribute(htmlAttribute, js));
			}
			js.children=[];
			var htmlChildren=$(htmlElement).children(".children").toArray()[0];
			for(var i=0; i<htmlChildren.childNodes.length; i++) {
				var htmlChild=htmlChildren.childNodes[i];
				if($(htmlChild).hasClass("element")) js["children"].push(XEdit.harvestElement(htmlChild, js));
				else if($(htmlChild).hasClass("textnode")) js["children"].push(XEdit.harvestText(htmlChild, js));
			}
			js=XEdit.enrichElement(js);
			return js;
		},
		harvestAttribute: function(htmlAttribute, jsParent) {
			var js = new XEdit.surrogate(jsParent);
			js.type = "attribute";
			js.name = htmlAttribute.getAttribute("data-name");
			js.htmlID = htmlAttribute.id;
			js.value = htmlAttribute.getAttribute("data-value");
			return js;
		},
		surrogate: function(jsParent) {
			this.internalParent=jsParent;
		},
		harvestText: function (htmlText, jsParent) {
			var js = new XEdit.surrogate(jsParent);
			js.type = "text";
			js.htmlID = htmlText.id;
			js.value = htmlText.getAttribute("data-value");
			return js;
		},
		harvestParentOf: function(js) {
			var jsParent=null;
			var $parent=$("#"+js.htmlID).parent().closest(".element");
			if($parent.toArray().length==1) {
				jsParent=XEdit.harvestElement($parent.toArray()[0]);
				for(var i=0; i<jsParent.attributes.length; i++) if(jsParent.attributes[i].htmlID==js.htmlID) jsParent.attributes[i]=js;
				for(var i=0; i<jsParent.children.length; i++) if(jsParent.children[i].htmlID==js.htmlID) jsParent.children[i]=js;
			}
			return jsParent;
		},
		render: function(data, editor, docSpec) { //renders the contents of an editor
			XEdit.docSpec=docSpec;
			XEdit.verifyDocSpec();
			
			XEdit.namespaces={};
			
			if(typeof(data)=="string") data=$.parseXML(data);
			if(data.documentElement) data=XEdit.xml2js(data);
			
			if(typeof(editor)=="string") editor=document.getElementById(editor);
			if(!$(editor).hasClass("xedit")) $(editor).addClass("xedit"); 
			$(editor).addClass(XEdit.mode);
			
			$(editor).hide();
			editor.innerHTML=XEdit.renderElement(data, editor);
			$(editor).show();
			
			$(document.body).off("click", XEdit.clickoff);
			$(document.body).on("click", XEdit.clickoff);

			$(document.body).off("dragend", XEdit.dragend);
			$(document.body).on("dragend", XEdit.dragend);
			
			XEdit.refresh();
			XEdit.validate();
		},
		renderElement: function(element) {
			var htmlID=XEdit.nextID();
			XEdit.verifyDocSpecElement(element.name);
			var spec=XEdit.docSpec.elements[element.name];
			var classNames="element";
			if(spec.canDropTo && spec.canDropTo.length>0) classNames+=" draggable";
			var hasText = spec.hasText(element);
			if(hasText) classNames+=" hasText";
			if(spec.inlineMenu && spec.inlineMenu.length>0) classNames+=" hasInlineMenu";
			if(spec.oneliner(element)) classNames+=" oneliner";
			if(!spec.collapsible()) {
				classNames+=" uncollapsible";
			} else {
				if(spec.collapsed(element) && element.children.length>0) classNames+=" collapsed";
			}
			if(spec.menu.length>0) classNames+=" hasMenu"; 
			var displayName=element.name;
			if(spec.displayName) displayName="<span class='displayName'>"+XEdit.textByLang(spec.displayName)+"</span>";
			var html="";
			html+='<div data-name="'+element.name+'" id="'+htmlID+'" class="'+classNames+'">';
				html+='<span class="connector">';
					html+='<span class="plusminus" onclick="XEdit.plusminus(\''+htmlID+'\')"></span>';
					html+='<span class="draghandle" draggable="true" ondragstart="XEdit.drag(event)"></span>';
				html+='</span>';
				html+='<span class="tag opening" style="background-color: '+spec.backgroundColour+';">';
					html+='<span class="punc">&lt;</span>';
					html+='<span class="name" onclick="XEdit.click(\''+htmlID+'\', \'openingTagName\')">'+displayName+'</span>';
					html+='<span class="warner"><span class="inside" onclick="XEdit.click(\''+htmlID+'\', \'warner\')"></span></span>';
					html+='<span class="attributes">';
						for(var i=0; i<element.attributes.length; i++) {
							XEdit.verifyDocSpecAttribute(element.name, element.attributes[i].name);
							html+=XEdit.renderAttribute(element.attributes[i], element.name);
						}
					html+='</span>';
					html+='<span class="punc slash">/</span>';
					html+='<span class="punc">&gt;</span>';
				html+='</span>';
				html+='<span class="childrenCollapsed" onclick="XEdit.plusminus(\''+htmlID+'\', true)">&middot;&middot;&middot;</span>';
				html+='<div class="children">';
					var prevChildType="";
					if(hasText && (element.children.length==0 || element.children[0].type=="element")) {
						html+=XEdit.renderText({type: "text", value: ""}); 
					}
					for(var i=0; i<element.children.length; i++) {
						var child=element.children[i];
						if(hasText && prevChildType=="element" && child.type=="element") {
							html+=XEdit.renderText({type: "text", value: ""}); 
						}
						if(child.type=="text") html+=XEdit.renderText(child); 
						else if(child.type=="element") html+=XEdit.renderElement(child); 
						prevChildType=child.type;
					}
					if(hasText && element.children.length>1 && element.children[element.children.length-1].type=="element") {
						html+=XEdit.renderText({type: "text", value: ""}); 
					}
				html+='</div>';
				html+='<span class="tag closing" style="background-color: '+spec.backgroundColour+';">';
					html+='<span class="punc">&lt;</span>';
					html+='<span class="punc">/</span>';
					html+='<span class="name" onclick="XEdit.click(\''+htmlID+'\', \'closingTagName\')">'+displayName+'</span>';
					html+='<span class="punc">&gt;</span>';
				html+='</span>';
			html+='</div>';
			element.htmlID = htmlID;
			return html;
		},
		renderAttribute: function(attribute, optionalParentName) {
			var htmlID=XEdit.nextID();
			var readonly=false; //TBE
			classNames="attribute"; if(readonly) classNames+=" readonly";
			
			var displayName=attribute.name;
			if(optionalParentName) {
				var spec=XEdit.docSpec.elements[optionalParentName].attributes[attribute.name];
				if(spec) {
					if(spec.displayName) displayName="<span class='displayName'>"+XEdit.textByLang(spec.displayName)+"</span>";
				}
			}
			
			var html="";
			html+='<span data-name="'+attribute.name+'" data-value="'+XEdit.xmlEscape(attribute.value)+'" id="'+htmlID+'" class="'+classNames+'">';
				html+='<span class="punc"> </span>';
				var onclick=''; if(!readonly) onclick=' onclick="XEdit.click(\''+htmlID+'\', \'attributeName\')"';
				html+='<span class="name"'+onclick+'>'+displayName+'</span>';
				html+='<span class="warner"><span class="inside" onclick="XEdit.click(\''+htmlID+'\', \'warner\')"></span></span>';
				html+='<span class="punc">=</span>';
				var onclick=''; if(!readonly) onclick=' onclick="XEdit.click(\''+htmlID+'\', \'attributeValue\')"';
				html+='<span class="valueContainer"'+onclick+'>';
					html+='<span class="punc">"</span>';
					html+='<span class="value">'+XEdit.xmlEscape(attribute.value)+'</span>';
					html+='<span class="punc">"</span>';
				html+='</span>';
			html+='</span>';
			attribute.htmlID = htmlID;
			return html;
		},
		renderText: function(text) {
			var htmlID=XEdit.nextID();
			var classNames="textnode";
			if($.trim(text.value)=="") classNames+=" whitespace";
			if(text.value=="") classNames+=" empty";
			var html="";
			html+='<div id="'+htmlID+'" data-value="'+XEdit.xmlEscape(text.value)+'" class="'+classNames+'">';
				html+='<span class="connector"></span>';
				html+='<span class="value" onclick="XEdit.click(\''+htmlID+'\', \'text\')"><span class="insertionPoint"><span class="inside"></span></span><span class="dots"></span>'+XEdit.chewText(text.value)+'</span>';
			html+='</div>';
			text.htmlID = htmlID;
			return html;
		},
		chewText: function(txt) {
			var ret="";
			ret+="<span class='word'>"; //start word
			for(var i=0; i<txt.length; i++) {
				if(txt[i]==" ") ret+="</span>"; //end word
				var t=XEdit.xmlEscape(txt[i])
				if(i==0 && t==" ") t="&nbsp;"; //leading space
				if(i==txt.length-1 && t==" ") t="&nbsp;"; //trailing space
				ret+="<span class='char'>"+t+"<span class='selector'><span class='inside' onclick='XEdit.charClick(this.parentNode.parentNode)'></span></span></span>";
				if(txt[i]==" ") ret+="<span class='word'>"; //start word
			}
			ret+="</span>"; //end word
			return ret;
		},
		charClick: function(c) {
			XEdit.clickoff();
			XEdit.notclick=true;
			if(
				$(".xedit .char.on").toArray().length==1 && //if there is precisely one previously selected character
				$(".xedit .char.on").closest(".element").is($(c).closest(".element")) //and if it has the same parent element as this character
			) {
				var $element=$(".xedit .char.on").closest(".element");
				var chars=$element.find(".char").toArray();
				var iFrom=$.inArray($(".xedit .char.on").toArray()[0], chars);
				var iTill=$.inArray(c, chars);
				if(iFrom>iTill) {var temp=iFrom; iFrom=iTill; iTill=temp;}
				for(var i=0; i<chars.length; i++) { //highlight all chars between start and end
					if(i>=iFrom && i<=iTill) $(chars[i]).addClass("on");
				}
				XEdit.textFromID=$(chars[iFrom]).closest(".textnode").attr("id");
				XEdit.textTillID=$(chars[iTill]).closest(".textnode").attr("id");
				XEdit.textFromIndex=$.inArray(chars[iFrom], $("#"+XEdit.textFromID).find(".char").toArray());
				XEdit.textTillIndex=$.inArray(chars[iTill], $("#"+XEdit.textTillID).find(".char").toArray());
				//Show inline menu etc:
				var htmlID=$element.attr("id");
				var content=XEdit.inlineMenu(htmlID); //compose bubble content
				if(content!="") {
					document.body.appendChild(XEdit.makeBubble(content)); //create bubble
					XEdit.showBubble($("#"+htmlID+" .char.on").last()); //anchor bubble to highlighted chars
				}
				XEdit.clearChars=true;
			} else {
				$(".xedit .char.on").removeClass("on");
				$(c).addClass("on");
			}
		},
		wrap:function(htmlID, param) {
			XEdit.clickoff();
			var xml=param.template;
			var ph=param.placeholder;
			if(XEdit.textFromID==XEdit.textTillID) { //abc --> a<XYZ>b</XYZ>c
				var jsOld=XEdit.harvestText(document.getElementById(XEdit.textFromID));
				var txtOpen=jsOld.value.substring(0, XEdit.textFromIndex);
				var txtMiddle=jsOld.value.substring(XEdit.textFromIndex, XEdit.textTillIndex+1);
				var txtClose=jsOld.value.substring(XEdit.textTillIndex+1);
				xml=xml.replace(ph, XEdit.xmlEscape(txtMiddle));
				var html="";
				html+=XEdit.renderText({type: "text", value: txtOpen});
				html+=XEdit.renderElement(XEdit.xml2js(xml));
				html+=XEdit.renderText({type: "text", value: txtClose});
				$("#"+XEdit.textFromID).replaceWith(html);
			} else { //ab<...>cd --> a<XYZ>b<...>c</XYZ>d
				var jsOldOpen=XEdit.harvestText(document.getElementById(XEdit.textFromID));
				var jsOldClose=XEdit.harvestText(document.getElementById(XEdit.textTillID));
				var txtOpen=jsOldOpen.value.substring(0, XEdit.textFromIndex);
				var txtMiddleOpen=jsOldOpen.value.substring(XEdit.textFromIndex);
				var txtMiddleClose=jsOldClose.value.substring(0, XEdit.textTillIndex+1);
				var txtClose=jsOldClose.value.substring(XEdit.textTillIndex+1);
				xml=xml.replace(ph, XEdit.xmlEscape(txtMiddleOpen)+ph);
				$("#"+XEdit.textFromID).nextUntil("#"+XEdit.textTillID).each(function(){
					if($(this).hasClass("element")) xml=xml.replace(ph, XEdit.js2xml(XEdit.harvestElement(this))+ph);
					else if($(this).hasClass("textnode")) xml=xml.replace(ph, XEdit.js2xml(XEdit.harvestText(this))+ph);
				});
				xml=xml.replace(ph, XEdit.xmlEscape(txtMiddleClose));
				$("#"+XEdit.textFromID).nextUntil("#"+XEdit.textTillID).remove();
				$("#"+XEdit.textTillID).remove();
				var html="";
				html+=XEdit.renderText({type: "text", value: txtOpen});
				html+=XEdit.renderElement(XEdit.xml2js(xml));
				html+=XEdit.renderText({type: "text", value: txtClose});
				$("#"+XEdit.textFromID).replaceWith(html);
			}
			XEdit.refresh();
		},
		plusminus: function(htmlID, forceExpand) {
			var $element=$("#"+htmlID);
			var $children=$element.children(".children");
			if($element.hasClass("collapsed")) {
				$children.hide();
				$element.removeClass("collapsed");
				if($element.hasClass("oneliner")) $children.fadeIn("fast"); else $children.slideDown("fast");
			} else if(!forceExpand) {
				XEdit.updateCollapsoid(htmlID);
				if($element.hasClass("oneliner")) $children.fadeOut("fast", function(){ $element.addClass("collapsed"); });
				else $children.slideUp("fast", function(){ $element.addClass("collapsed"); });
			}
		},
		unwrap: function(htmlID, param) {
			XEdit.clickoff();
			$("#"+htmlID).replaceWith($("#"+htmlID+" > .children > *"));
			XEdit.refresh();
		},
		updateCollapsoid: function(htmlID) {
			var $element=$("#"+htmlID);
			var whisper="";
			var elementName=$element.data("name");
			var spec=XEdit.docSpec.elements[elementName];
			if(spec.collapsoid) {
				whisper=spec.collapsoid(XEdit.harvestElement($element.toArray()[0]));
			} else {
				var abbreviated=false;
				$element.find(".textnode").each(function(){
					var txt=XEdit.harvestText(this).value;
					for(var i=0; i<txt.length; i++) {
						if(whisper.length<35) whisper+=txt[i]; else abbreviated=true;
					}
					whisper+=" ";
				});
				whisper=whisper.replace(/  +/g, " ").replace(/ +$/g, "");
				if(abbreviated && !$element.hasClass("oneliner") && whisper!="...") whisper+="...";
			}
			if(whisper=="" || !whisper) whisper="...";
			$element.children(".childrenCollapsed").html(whisper);
		},
		click: function(htmlID, what) {
			if(!XEdit.notclick) {
				XEdit.clickoff();
				$(".xedit .char.on").removeClass("on");
				if(what=="openingTagName" || what=="closingTagName") {
					$("#"+htmlID).addClass("current"); //make the element current
					var content=XEdit.elementMenu(htmlID); //compose bubble content
					if(content!="") {
						document.body.appendChild(XEdit.makeBubble(content)); //create bubble
						if(what=="openingTagName") XEdit.showBubble($("#"+htmlID+" > .tag.opening > .name")); //anchor bubble to opening tag
						if(what=="closingTagName") XEdit.showBubble($("#"+htmlID+" > .tag.closing > .name")); //anchor bubble to closing tag
					}
				}
				if(what=="attributeName") {
					$("#"+htmlID).addClass("current"); //make the attribute current
					var content=XEdit.attributeMenu(htmlID); //compose bubble content
					if(content!="") {
						document.body.appendChild(XEdit.makeBubble(content)); //create bubble
						XEdit.showBubble($("#"+htmlID+" > .name")); //anchor bubble to attribute name
					}
				}
				if(what=="attributeValue") {
					$("#"+htmlID+" > .valueContainer").addClass("current"); //make attribute value current
					var name=$("#"+htmlID).attr("data-name"); //obtain attribute's name
					var value=$("#"+htmlID).attr("data-value"); //obtain current value
					var elName=$("#"+htmlID).closest(".element").attr("data-name");
					XEdit.verifyDocSpecAttribute(elName, name);
					var spec=XEdit.docSpec.elements[elName].attributes[name];
					var content=spec.asker(value, spec.askerParameter); //compose bubble content
					if(content!="") {
						document.body.appendChild(XEdit.makeBubble(content)); //create bubble
						XEdit.showBubble($("#"+htmlID+" > .valueContainer > .value")); //anchor bubble to value
						XEdit.answer=function(val) {
							var obj=document.getElementById(htmlID);
							var html=XEdit.renderAttribute({type: "attribute", name: name, value: val}, elName);
							$(obj).replaceWith(html);
							XEdit.clickoff();
							XEdit.changed();
						};
					}
				}
				if(what=="text") {
					$("#"+htmlID).addClass("current");
					var value=$("#"+htmlID).attr("data-value"); //obtain current value
					var elName=$("#"+htmlID).closest(".element").attr("data-name");
					var spec=XEdit.docSpec.elements[elName];
					if (typeof(spec.asker) != "function") {
						var content=XEdit.askLongString(value); //compose bubble content  
					} else {
						var content=spec.asker(value, spec.askerParameter); //use specified asker
					}			
					document.body.appendChild(XEdit.makeBubble(content)); //create bubble
					XEdit.showBubble($("#"+htmlID+" > .value")); //anchor bubble to value
					XEdit.answer=function(val) {
						var obj=document.getElementById(htmlID);
						var jsText = {type: "text", value: val};
						var html=XEdit.renderText(jsText);
						$(obj).replaceWith(html);
						XEdit.clickoff();
						XEdit.changed(XEdit.harvestText(document.getElementById(jsText.htmlID)));
					};
				}
				if(what=="warner") {
					//$("#"+htmlID).addClass("current");
					var content=""; //compose bubble content
					for(var iWarning=0; iWarning<XEdit.warnings.length; iWarning++) {
						var warning=XEdit.warnings[iWarning];
						if(warning.htmlID==htmlID) {
							content+="<div class='warning'>"+XEdit.formatCaption(XEdit.textByLang(warning.text))+"</div>";
						}
					}
					document.body.appendChild(XEdit.makeBubble(content)); //create bubble
					XEdit.showBubble($("#"+htmlID+" .warner .inside").first()); //anchor bubble to warner
				}
				XEdit.notclick=true;
			}
		}
	});
	
	XEdit.surrogate.prototype.parent = function() {
		if (!this.internalParent) {
			this.internalParent=XEdit.harvestParentOf(this);
		}
		return this.internalParent;
	};
	
	extend(XEdit, {
		notclick: false,
		clearChars: false, 
		clickoff: function() { 
			if(!XEdit.notclick) {
				XEdit.destroyBubble();
				$(".xedit .current").removeClass("current");
				if(XEdit.clearChars) {
					$(".xedit .char.on").removeClass("on");
					XEdit.clearChars=false;
				}
			}
			XEdit.notclick=false;
		},
		destroyBubble: function() {
			if(document.getElementById("xeditBubble")) {
				var bubble=document.getElementById("xeditBubble");
				bubble.parentNode.removeChild(bubble);
			}
		},
		makeBubble: function(content) {
			XEdit.destroyBubble();
			var bubble=document.createElement("div");
			bubble.id="xeditBubble";
			bubble.className=XEdit.mode;
			bubble.innerHTML="<div class='inside' onclick='XEdit.notclick=true;'>"
					+"<div id='xeditBubbleContent'>"+content+"</div>"
				+"</div>";
			return bubble;
		},
		showBubble: function($anchor) {
			var $bubble=$("#xeditBubble");
			var offset=$anchor.offset(); var left=offset.left; var top=offset.top;
			var screenWidth=$("body").width();
			if(left<screenWidth/2) {
				var width=$anchor.width(); if(width>40) width=40;
				var height=$anchor.height(); if(height>25) height=25;
				if(XEdit.mode=="laic") { width=width-25; height=height+10; }
				$bubble.css({top: (top+height)+"px", left: (left+width-15)+"px"});
			} else {
				var width=$anchor.width(); if(width>40) width=40;
				var height=$anchor.height(); if(height>25) height=25;
				if(XEdit.mode=="laic") { height=height+10; }
				$bubble.addClass("rightAnchored");
				$bubble.css({top: (top+height)+"px", right: (screenWidth-left)+"px"});
			}
			$bubble.slideDown("fast", function() {
				$bubble.find(".focusme").first().focus(); //if the context menu contains anything with the class name 'focusme', focus it.
			});
		},
		askString: function(defaultString) {
			var html="";
			html+="<form onsubmit='XEdit.answer(this.val.value); return false'>";
				html+="<input name='val' class='textbox focusme' value='"+XEdit.xmlEscape(defaultString)+"'/>";
				html+=" <input type='submit' value='OK'>";
			html+="</form>";
			return html;
		},
		askLongString: function(defaultString) {
			var html="";
			html+="<form onsubmit='XEdit.answer(this.val.value); return false'>";
				html+="<textarea name='val' class='textbox focusme' spellcheck='false'>"+XEdit.xmlEscape(defaultString)+"</textarea>";
				html+="<div class='submitline'><input type='submit' value='OK'></div>";
			html+="</form>";
			return html;
		},
		askPicklist: function(defaultString, picklist) {
			var html="";
			html+="<div class='menu'>";
			for(var i=0; i<picklist.length; i++) {
				var item=picklist[i];
				if(typeof(item)=="string") item={value: item, caption: ""};
				html+="<div class='menuItem techno"+(item.value==defaultString?" current":"")+"' onclick='XEdit.answer(\""+XEdit.xmlEscape(item.value)+"\")'>";
				html+="<span class='punc'>\"</span>";
				html+=XEdit.xmlEscape(item.value);
				html+="<span class='punc'>\"</span>";
				if(item.caption!="") html+=" <span class='explainer'>"+XEdit.xmlEscape(XEdit.textByLang(item.caption))+"</span>";
				html+="</div>";
			}
			html+="</div>";
			return html;
		},
		attributeMenu: function(htmlID) {
			var name=$("#"+htmlID).attr("data-name"); //obtain attribute's name
			var elName=$("#"+htmlID).closest(".element").attr("data-name"); //obtain element's name
			XEdit.verifyDocSpecAttribute(elName, name);
			var spec=XEdit.docSpec.elements[elName].attributes[name];
			var html="";
			for(var i=0; i<spec.menu.length; i++) {
				var item=spec.menu[i];
				var includeIt=!item.hideIf(XEdit.harvestAttribute(document.getElementById(htmlID)));
				if(includeIt) {
					html+="<div class='menuItem' onclick='XEdit.callMenuFunction(XEdit.docSpec.elements[\""+elName+"\"].attributes[\""+name+"\"].menu["+i+"], \""+htmlID+"\")'>";
					html+=XEdit.formatCaption(XEdit.textByLang(item.caption));
					html+="</div>";
				}
			}
			if(html!="") html="<div class='menu'>"+html+"</div>";
			return html;
		},
		elementMenu: function(htmlID) {
			var elName=$("#"+htmlID).attr("data-name"); //obtain element's name
			var spec=XEdit.docSpec.elements[elName];
			var html="";
			for(var i=0; i<spec.menu.length; i++) {
				var item=spec.menu[i];
				var includeIt=!item.hideIf(XEdit.harvestElement(document.getElementById(htmlID)));
				if(includeIt) {
					html+="<div class='menuItem' onclick='XEdit.callMenuFunction(XEdit.docSpec.elements[\""+elName+"\"].menu["+i+"], \""+htmlID+"\")'>";
					html+=XEdit.formatCaption(XEdit.textByLang(item.caption));
					html+="</div>";
				}
			}
			if(html!="") html="<div class='menu'>"+html+"</div>";
			return html;
		},
		inlineMenu: function(htmlID) {
			var elName=$("#"+htmlID).attr("data-name"); //obtain element's name
			var spec=XEdit.docSpec.elements[elName];
			var html="";
			for(var i=0; i<spec.inlineMenu.length; i++) {
				var item=spec.inlineMenu[i];
				var includeIt=!item.hideIf(XEdit.harvestElement(document.getElementById(htmlID)));
				if(includeIt) {
					html+="<div class='menuItem' onclick='XEdit.callMenuFunction(XEdit.docSpec.elements[\""+elName+"\"].inlineMenu["+i+"], \""+htmlID+"\")'>";
					html+=XEdit.formatCaption(XEdit.textByLang(item.caption));
					html+="</div>";
				}
			}
			if(html!="") html="<div class='menu'>"+html+"</div>";
			return html;
		},
		callMenuFunction: function(menuItem, htmlID) {
			menuItem.action(htmlID, menuItem.actionParameter);
			XEdit.changed();
		},
		formatCaption: function(caption) {
			caption=caption.replace(/\<([^\>]+)\>/g, "<span class='techno'><span class='punc'>&lt;</span><span class='elName'>$1</span><span class='punc'>&gt;</span></span>");
			caption=caption.replace(/\@"([^\"]+)"/g, "<span class='techno'><span class='punc'>\"</span><span class='atValue'>$1</span><span class='punc'>\"</span></span>");
			caption=caption.replace(/\@([^ =]+)=""/g, "<span class='techno'><span class='atName'>$1</span><span class='punc'>=\"</span><span class='punc'>\"</span></span>");
			caption=caption.replace(/\@([^ =]+)="([^\"]+)"/g, "<span class='techno'><span class='atName'>$1</span><span class='punc'>=\"</span><span class='atValue'>$2</span><span class='punc'>\"</span></span>");
			caption=caption.replace(/\@([^ =]+)/g, "<span class='techno'><span class='atName'>$1</span></span>");
			return caption;
		},
		deleteAttribute: function(htmlID, parameter) {
			XEdit.clickoff();
			var obj=document.getElementById(htmlID);
			obj.parentNode.removeChild(obj);
			XEdit.refresh();
		},
		deleteElement: function(htmlID, parameter) {
			XEdit.clickoff();
			var obj=document.getElementById(htmlID);
			$(obj).slideUp(function(){
				obj.parentNode.removeChild(obj);
				XEdit.refresh();
			});
		},
		newAttribute: function(htmlID, parameter) {
			XEdit.clickoff();
			var $element=$("#"+htmlID);
			var html=XEdit.renderAttribute({type: "attribute", name: parameter.name, value: parameter.value}, $element.data("name"));
			$("#"+htmlID+" > .tag.opening > .attributes").append(html);
			XEdit.refresh();
		},
		newElementChild: function(htmlID, parameter) {
			XEdit.clickoff();
			var html=XEdit.renderElement(XEdit.xml2js(parameter));
			var $html=$(html).hide();
			$("#"+htmlID+" > .children").append($html);
			XEdit.plusminus(htmlID, true);
			XEdit.refresh();
			$html.slideDown();
		},
		newElementBefore: function(htmlID, parameter) {
			XEdit.clickoff();
			var html=XEdit.renderElement(XEdit.xml2js(parameter));
			var $html=$(html).hide();
			$("#"+htmlID).before($html);
			XEdit.refresh();
			$html.slideDown();
		},
		newElementAfter: function(htmlID, parameter) {
			XEdit.clickoff();
			var html=XEdit.renderElement(XEdit.xml2js(parameter));
			var $html=$(html).hide();
			$("#"+htmlID).after($html);
			XEdit.refresh();
			$html.slideDown();
		},
		replace: function(htmlID, jsNode) {
			XEdit.clickoff();
			var html="";
			if(jsNode.type=="element") html=XEdit.renderElement(jsNode);
			if(jsNode.type=="attribute") html=XEdit.renderAttribute(jsNode);
			if(jsNode.type=="text") html=XEdit.renderText(jsNode);
			$("#"+htmlID).replaceWith(html);
			XEdit.refresh();
		},
		draggingID: null, //what are we dragging?
		drag: function(ev) { //called when dragging starts
			XEdit.clickoff();
			var htmlID=ev.target.parentNode.parentNode.id;
			var $element=$("#"+htmlID);
			var elementName=$element.attr("data-name");
			var elSpec=XEdit.docSpec.elements[elementName];
			$element.addClass("dragging");
			$(".xedit .children").append("<div class='elementDropper' ondragover='XEdit.dragOver(event)' ondragleave='XEdit.dragOut(event)' ondrop='XEdit.drop(event)'><div class='inside'></div></div>")
			$(".xedit .children .element").before("<div class='elementDropper' ondragover='XEdit.dragOver(event)' ondragleave='XEdit.dragOut(event)' ondrop='XEdit.drop(event)'><div class='inside'></div></div>")
			$(".xedit .children .text").before("<div class='elementDropper' ondragover='XEdit.dragOver(event)' ondragleave='XEdit.dragOut(event)' ondrop='XEdit.drop(event)'><div class='inside'></div></div>")
			$(".xedit .dragging .elementDropper").remove(); //remove drop targets inside the element being dragged
			$(".xedit .dragging").prev(".elementDropper").remove(); //remove drop targets from immediately before the element being dragged
			$(".xedit .dragging").next(".elementDropper").remove(); //remove drop targets from immediately after the element being dragged
			if(elSpec.canDropTo) { //remove the drop target from elements it cannot be dropped into
				var droppers=$(".xedit .elementDropper").toArray();
				for(var i=0; i<droppers.length; i++) {
					var dropper=droppers[i];
					var parentElementName=$(dropper.parentNode.parentNode).toArray()[0].getAttribute("data-name");
					if($.inArray(parentElementName, elSpec.canDropTo)<0) {
						dropper.parentNode.removeChild(dropper);
					}
				}
			}
			if(elSpec.mustBeBefore) { //remove the drop target from after elements it cannot be after
				var droppers=$(".xedit .elementDropper").toArray();
				for(var i=0; i<droppers.length; i++) {
					var dropper=droppers[i];
					for(var ii=0; ii<elSpec.mustBeBefore.length; ii++) {
						if( $(dropper).prevAll("*[data-name='"+elSpec.mustBeBefore[ii]+"']").toArray().length>0 ) {
							dropper.parentNode.removeChild(dropper);
						}
					}
				}
			}
			if(elSpec.mustBeAfter) { //remove the drop target from before elements it cannot be before
				var droppers=$(".xedit .elementDropper").toArray();
				for(var i=0; i<droppers.length; i++) {
					var dropper=droppers[i];
					for(var ii=0; ii<elSpec.mustBeAfter.length; ii++) {
						if( $(dropper).nextAll("*[data-name='"+elSpec.mustBeAfter[ii]+"']").toArray().length>0 ) {
							dropper.parentNode.removeChild(dropper);
						}
					}
				}
			}
			XEdit.draggingID=htmlID;
			ev.dataTransfer.setData("text", htmlID);
			XEdit.refresh();
		},
		dragOver: function(ev) {
			ev.preventDefault();
			$(ev.target.parentNode).addClass("activeDropper");
		},
		dragOut: function(ev) {
			ev.preventDefault();
			$(".xedit .activeDropper").removeClass("activeDropper");
		},
		drop: function(ev) {
			ev.preventDefault();
			var node=document.getElementById(XEdit.draggingID); //the thing we are moving
			$(ev.target.parentNode).replaceWith(node);
			XEdit.changed();
		},
		dragend: function(ev) {
			$(".xedit .attributeDropper").remove();
			$(".xedit .elementDropper").remove();
			$(".xedit .dragging").removeClass("dragging");
			XEdit.refresh();
		},
		changed: function(jsElement) { //called when the document changes
			XEdit.validate();
			XEdit.docSpec.onchange(jsElement); //report that the document has changed
		},
		validate: function() {
			var js=XEdit.harvestElement($(".xedit .element").toArray()[0], null);
			$(".xedit .invalid").removeClass("invalid");
			XEdit.warnings=[];
			XEdit.docSpec.validate(js); //validate the document
			for(var iWarning=0; iWarning<XEdit.warnings.length; iWarning++) {
				var warning=XEdit.warnings[iWarning];
				$("#"+warning.htmlID).addClass("invalid");
			}
		},
		warnings: [], 
		textByLang: function(str) {
			var ret=str;
			var segs=str.split("|");
			for(var i=0; i<segs.length; i++) {
				var seg=$.trim(segs[i]);
				if(seg.indexOf(XEdit.lang+":")==0) {
					ret=seg.substring((XEdit.lang+":").length, ret.length);
				}
			}
			ret=$.trim(ret);
			return ret;
		}
	});
	
	return XEdit;
})(jQuery);