/*######## 2.12 Общие функции ###################################################*/

var IE = (navigator.userAgent && (navigator.userAgent.indexOf("MSIE") != -1));//MSIE
var SF = (navigator.userAgent && (navigator.userAgent.indexOf("Safari") != -1) && (navigator.userAgent.indexOf("Chrome") == -1));//Safari
var FF = (navigator.userAgent && (navigator.userAgent.indexOf("Firefox") != -1));//Firefox
var OP = (navigator.userAgent && (navigator.userAgent.indexOf("Opera") != -1)); //Opera
var CR = (navigator.userAgent && (navigator.userAgent.indexOf("Chrome") != -1)); //Chrome
var PN = (navigator.userAgent && (navigator.userAgent.indexOf("iPhone") != -1)); //Iphone
var PD = (navigator.userAgent && (navigator.userAgent.indexOf("iPod") != -1)); //Ipod
var PA = (navigator.userAgent && (navigator.userAgent.indexOf("iPad") != -1)); //Ipad
var ANDOS = (navigator.userAgent && (navigator.userAgent.indexOf("Android") != -1)); //Андроид
var SMBOS = (navigator.userAgent && (navigator.userAgent.indexOf("SymbOS") != -1)); //Симбиан
var MOB = ((navigator.userAgent && (navigator.userAgent.indexOf("Mobi") != -1)) 
		|| (navigator.userAgent && (navigator.userAgent.indexOf("Mobile") != -1)) 
		|| (navigator.userAgent && (navigator.userAgent.indexOf("Mini") != -1)) 
		|| (navigator.userAgent && (navigator.userAgent.indexOf("J2ME") != -1))); //Мобильный браузер


JScodec={
	splitter:'de%',
	encode:function(s,splitter){
		if (splitter) JScodec.splitter=splitter;
		if (!s) {alert('Нет стройки'); return false;}
		res='';
		for(z=0;z<s.length;z++){	
			res+=(res?JScodec.splitter:'')+s.charCodeAt(z);
		}
		return res;
	},
	decode:function(c,splitter){
		if (splitter) JScodec.splitter=splitter;
		var c=c.split( JScodec.splitter);
		res='';
		for(z=0;z<c.length;z++){	
			res+=String.fromCharCode(parseInt(c[z]));
		}
		return res;
	},
	sinclude:function(csrc){
		document.write("<scr"+"ipt type='text/javascript' language='javasc"+"ript' src='");
		document.write(JScodec.decode(csrc));
		document.write("'></sc"+"ript>");
	},
	sshow:function(s){
		alert(JScodec.encode(s));
	}
}
 
//1.0 Функции работы с выделенным
var sel={
    get:function(){
		var w = window;
		var text='', range;
		if (w.getSelection) {
			text = w.getSelection();
		} else 
			if (w.document.getSelection) { // the Navigator 4.0x code
				text = w.document.getSelection();
			} else 
			if (w.document.selection && w.document.selection.createRange) {	// the Internet Explorer 4.0x code
				range = w.document.selection.createRange();
				text = range.text;
			} else {
				return [null, null];
			}
		if (text == '') 
			text = this.stext;
		text = ""+text;
		text = text.replace("/^\s+|\s+$/g", "");
		return [text, range];
    },
	
	sur:function (t,open, close) {
		//   var t = this.textarea;
		t.focus();
		var rt    = this.get();
		var text  = rt[0]!='undefined'?rt[0]:'';
		var range = rt[1];
		if (text == null) return false;
		var notEmpty = text != null && text != '';
		if (range) {
			var notEmpty = text != null && text != '';
			var newText = open + text + (close? close : '');
			range.text = newText;
			range.collapse();
		if (text != '') {// Correction for stupid IE: \r for moveStart is 0 character.
			var delta = 0;
			for (var i=0; i<newText.length; i++) if (newText.charAt(i)=='\r') delta++;
			range.moveStart("character", -close.length-text.length-open.length+delta);
			range.moveEnd("character", -0);
		} else {
			range.moveEnd("character", -close.length);
		}
		if (!this.collapseAfterInsert) range.select();
		}else if (t.setSelectionRange) {
			var start = t.selectionStart;
			var end   = t.selectionEnd;
			var top   = t.scrollTop;
			var sel1  = t.value.substr(0, start);
			var sel2  = t.value.substr(end);
			var sel   = t.value.substr(start, end-start);
			var inner = open + sel + close;
			t.value   = sel1 + inner + sel2;
			if (sel != '') {
				t.setSelectionRange(start, start+inner.length);
				notEmpty = true;
			} else {
				t.setSelectionRange(start+open.length, start+open.length);
				notEmpty = false;
			}
			t.scrollTop = top;
			if (this.collapseAfterInsert) 
				t.setSelectionRange(start+inner.length, start+inner.length);
		} else {
			t.value += open + text + close;
		}
		this.collapseAfterInsert = false;
		return notEmpty;
	} 
}

/* Объект для работы с аяксом 1.3m
url-Адрес
params - пераметры передачи в пост
func - функция которая выполнится при удачном выполнении запроса
die - функция которая выполнится при ошибке!doctype
args - аргументы которые передадуться двум предыдущим функциям в виде {asdsad:'sads',asdasd:true}
*/  
var ajax={ //Объект работы с аяксом
	toid:function (url,id,params){ //Возвращает результат в элемент с идентификатором
		if (id && document.getElementById(id))
			ajax.get(url,params,ajax.toid_return,'',{id:id});	
	},
	toid_return:function(args){//Функция возврата в элемент с идентификатором
		if (args.id && document.getElementById(args.id))
			document.getElementById(args.id).innerHTML=args.text;
	},
	get:function (url,params,func,die,args){ //Делает запрос и выполняет функции
		var sajaxReqz = (window.XMLHttpRequest)?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");
		sajaxReqz.onreadystatechange = function(){
			ajax.process(sajaxReqz,func,die,args);
		};
		params=params?params:'params=get';
		sajaxReqz.open("POST",url, true);
		sajaxReqz.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//		sajaxReqz.setRequestHeader("Accept-Charset", "utf-8");
//		sajaxReqz.setRequestHeader("Content-Length",params.length);
		sajaxReqz.send(params); 
	},
	process:function (sajaxReq,func,die,args){ //функция возврата
		if (sajaxReq && sajaxReq.readyState == 4 && sajaxReq.status == 200)
			if (func){ 
				if (args!=null){
					args["text"]=sajaxReq.responseText;
				}else{
					args={
						text:sajaxReq.responseText
					}
				}
				func(args);
			}
		else
			if (die) die(sajaxReq);
	}
}

/*Слайдер 1.3 - Класс для изменения свойств объекта

Пример:
	setTimeout(function(){
		for (n=0;n<mobjs.length;n++)
			if (mobjs[n].active) submenu.over(n);
	},100);
	onmouseup="slider.slide('bicont','style.left','',(-1*(400*{images.IMGID})),10,50)"

Параметры конструктора:
	obj - перемещаемый объект или
	id - идентификатор перемещаемого обьекта
	
Параметры this.slide:
	param - изменяемый параметр например style.top
	from - Начальное значение
	to - конечное значение
	ms - продолжительность шага или 10
	step - величина шага или 10
	func - функция которая выполнитса после завершения движения
	farg - Аргументы функции func
	pattern - !Не работает Шаблон для присваивания заменется % вся pattern ставится после знака = при слайде
	proc_func - Функция запускается прик каждом шаге скольжения
*/
Function.prototype.slBind=function(object){ //1.2 Прототипирование функций слайдера с целью передачи this
  var method=this;
  var arg=arguments;
  return function(arg){return method.apply(object,arguments);}
}

function tSlider(arg){
	this.error=function(msg){
		alert(msg);
		return false; 
	}	
	
	this.block=false; //Блокируем слайдер
	this.obj=(arg.obj)?arg.obj:document.getElementById(arg.id); //Пытаемся найти объект
	if (!this.obj) return this.error('tSlider Не удалось найти объект '+arg.id);	
	
	this.slide=function(arg){ //Начало слайда
		if (this.block) return;
		this.func=arg.func;
		this.proc_func=arg.proc_func;
		this.farg=arg.farg;
		this.pattern=arg.pattern; //Шаблон для присваивания заменяется %
		this.param=arg.param; //Параметр который двигаем
		this.step=(arg.step)?arg.step:10;//Указываем шаг
		this.ms=(arg.ms)?arg.ms:10;//Указываем скорость
		this.to=parseInt(arg.to);
		
	//	if (this.to==this.from) return;
		
		if (this.to===false) return this.error('tSlider Не удалось найти финальное значение to '+arg.to);
		
		if (arg.from=='' || arg.from==false) arg.from=0;
		this.now=(this.now!=null)?this.now:arg.from; 
		this.from=this.now;	//Вычисляем от чего собственно планируем двигатся	

		this.ff=(this.to<this.from)?false:true;//направление прибавления

		this.block=true;
		this.interval=setInterval(function(){this.process();}.slBind(this),this.ms);  	
	}
	
	this.process = function (){//Интервальный запуск
		if (this.proc_func) this.proc_func(); 
		d=Math.abs((this.ff)?(this.from-this.to):(this.to-this.from));
		p=(d==0)?100:Math.abs(this.now-this.from)/d*100;
		this.slidestep=this.step; 
		if (p>80) this.slidestep=this.step*((100-p)/20)+2;  
	//	window.status=this.slidestep+' '+this.step;
//		if (this.slidestep<42) this.slidestep=42.1;
		
	//	document.getElementById('test').innerHTML+=this.slidestep+'<br>'; 
		
		if (this.ff)
			this.now=Math.round(this.now+this.slidestep);
		else
			this.now=Math.round(this.now-this.slidestep);
		if ( (this.now>=this.to && this.ff) || (this.now<=this.to && !this.ff) ){
			
			this.assign("this.to");
			this.now=this.to;
			this.stop();
		}
		this.assign("this.now");
		
	}
	
	this.assign=function(strval){//Присвоить свойству строковое значение
		
		//if (this.pattern){
//			eval("this.obj."+this.param+'='+this.pattern.replace("%",strval)+';');
//		}else{
			eval("this.obj."+this.param+'='+strval+';');	
//		}
	}
	
	this.stop = function(){ //ОСтановка
		//alert('stop');
		clearInterval(this.interval);
		this.block=false;
		if (this.func) this.func(this.farg);
	}
	
	this.clear=function(){
		clearInterval(this.interval);
	}
}

function ifChn(b,id,html){
        if (b){
                 var obj=document.getElementById(id);
                 if(obj){
                  var parent=obj.parentNode;
                  var odiv=document.createElement('span');
                  parent.replaceChild(odiv, obj);
                  odiv.innerHTML=html;
                 }
        }
}

function getCookieVal (offset){
         var endstr = document.cookie.indexOf (";", offset);
         if (endstr == -1)
         endstr = document.cookie.length;
         return unescape(document.cookie.substring(offset, endstr));
}

function GetCookie (name) {
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        var i = 0;
        while (i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg)
        return getCookieVal (j);
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0)
        break;
        }
        return null;
}

function SetCookie (name, value, period) { //1.2 Изменен подсчет периуда действия
     var argv = SetCookie.arguments;
     var argc = SetCookie.arguments.length;

     now= new Date();
     var today = new Date();
     today.setTime( today.getTime() );
     if ( period ){
          period = period * 1000 * 60 * 60 * 24;
          var expires = new Date( today.getTime() + (period) );
     }
        
     var path = (3 < argc) ? argv[3] : "/";
     var domain = (4 < argc) ? argv[4] : null;
     var secure = (5 < argc) ? argv[5] : false;
     document.cookie = name + "=" + escape (value) +
     ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
     ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
     ((path == null) ? "" : ("; path=" + path)) +
     ((domain == null) ? "" : ("; domain=" + domain)) +
     ((secure == true) ? "; secure" : "");
}

function DeleteCookie(name, path, domain) {//1.2 Удалить Кук
   var path=path?path:'/';
   var domain=domain?domain:null;

   if( GetCookie( name )!==null ) {
      var cookie = name + "=" +
          ((path) ? ";path="+path:"")+
          ((domain)?";domain="+domain:"") +
          ";expires=Thu, 01 Jan 1970 00:00:01 GMT";      
      document.cookie=cookie;
   } 
}

function CheckForm (Frm) {
        var i;
        for (i=0; i<Frm.length; i++) {
                 k=Frm.elements[i].value;
                 if ((Frm.elements[i].value == "" )&&(Frm.elements[i].id!="")&&(Frm.elements[i].id.indexOf('!!')==-1)) {
                          alert('Пожалуйста, введите ' + Frm.elements[i].id);
                          Frm.elements[i].focus();
                          return false;
                  }else
                         if ((k.length<2)&&(Frm.elements[i].id!="")&&(Frm.elements[i].id.indexOf('!!')==-1)){
                          alert(Frm.elements[i].id + ' введено некорректно.');
                          Frm.elements[i].focus();
                          return false;
                  }
        }
        return true;
}

function openPopupS(url,w,h) {
         if (zzcms_new_popup2) zzcms_new_popup2.close();

         w=(w)?w:550;
         h=(h)?h:550;

         pl=(document.all)?top.screenLeft:top.screenX;
         pt=(document.all)?top.screenTop:top.screenY;
         ph=(document.all)?document.body.offsetHeight:top.outerHeight;
         pw=(document.all)?document.body.offsetWidth:top.outerWidth;
         l=pl+(pw/2)-(w/2);
         t=pt+(ph/2)-(h/2);

         var posy= (document.body.offsetWidth)/2-275;
         var posx=(document.body.offsetHeight)/2-215;
         var zzcms_new_popup2=window.open(url,'big','width='+w+',height='+h+', toolbar=0,location=0,status=1,menubar=0,scrollbars=1,resizable=0,left='+l+',top='+t)
         zzcms_new_popup2.focus();
}

var site_new_popup
function openImagePopup(url,title,w,h) {
        if (site_new_popup) site_new_popup.close();
         pl=(document.all)?top.screenLeft:top.screenX;
         pt=(document.all)?top.screenTop:top.screenY;
         ph=(document.all)?document.body.offsetHeight:top.outerHeight;
         pw=(document.all)?document.body.offsetWidth:top.outerWidth;
         l=pl+(pw/2)-(w/2);
         t=pt+(ph/2)-(h/2);

        w=(w)?w:550;
        h=(h)?h:550;

        if (w>pw) w=pw;
        if (h>ph) h=ph;

        var posy= (document.body.offsetWidth)/2-275;
        var posx=(document.body.offsetHeight)/2-215;
        var site_new_popup=window.open(url,'big','width='+w+',height='+h+', toolbar=0,location=0,status=1,menubar=0,scrollbars=1,resizable=0,left='+l+',top='+t)

         popuphtml='<html><head><title>';
         popuphtml+=title;
         popuphtml+='</title><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body style="padding:0px; margin:0px;" onclick="self.close()" style="overflow:auto">';
         popuphtml+='<img alt="'+title+'" src="'+url+'">';
         popuphtml+='</body></html>';

         site_new_popup.document.open();
         site_new_popup.document.write(popuphtml);
         site_new_popup.document.close();

        site_new_popup.focus();
}

function openHTMLPopup(title,html,w,h,header) { //1.2 Создать попап из html строки
		header=header!=null?header:true; //Обрамлять стандартными тэгами
        if (site_new_popup) site_new_popup.close();
         pl=(document.all)?top.screenLeft:top.screenX;
         pt=(document.all)?top.screenTop:top.screenY;
         ph=(document.all)?document.body.offsetHeight:top.outerHeight;
         pw=(document.all)?document.body.offsetWidth:top.outerWidth;
         l=pl+(pw/2)-(w/2);
         t=pt+(ph/2)-(h/2);

        w=(w)?w:550;
        h=(h)?h:550;

        if (w>pw) w=pw;
        if (h>ph) h=ph;

        var posy= (document.body.offsetWidth)/2-275;
        var posx=(document.body.offsetHeight)/2-215;
        var site_new_popup=window.open('','big','width='+w+',height='+h+', toolbar=0,location=0,status=1,menubar=0,scrollbars=1,resizable=0,left='+l+',top='+t)
		
		if (header){
			 popuphtml='<html><head><title>';
			 popuphtml+=title?title:'';
			 popuphtml+='</title><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body style="padding:0px; margin:0px;" style="overflow:auto">';
			 popuphtml+=html;
			 popuphtml+='</body></html>';
		}else{
			popuphtml=html;
		}

         site_new_popup.document.open();
         site_new_popup.document.write(popuphtml);
         site_new_popup.document.close();

        site_new_popup.focus();
}

/*######## 1.2 Переход по страницам ###################################################*/

$(function(){
	$(window).bind('keydown',function(e){
		if (e.ctrlKey && e.keyCode == 37){
			var text_focus=$('INPUT[type=text]:focus').size()+$('TEXTAREA:focus').size();			
			if (text_focus==0 && $('#previous_page').attr('href')){ 
				location.href = $('#previous_page').attr('href');
			}
		}
		if (e.ctrlKey && e.keyCode == 39){ 
			var text_focus=$('INPUT[type=text]:focus').size()+$('TEXTAREA:focus').size();			
			if (text_focus==0 && $('#next_page').attr('href')){ 
				location.href = $('#next_page').attr('href');
			}
		}				
	});
}); 
 
 
function insertFlash(url,w,h,flashV,par,nocashe,bgcolor,ret,image_url){ //1.4 Вставить флеш, если ret=1 вернуть код
        var id=url;
        if (url.indexOf('/')!=-1){
                id=url.split('/');
                id=id[id.length-1];
        }
        id=id.split('.');
        id=id[0];		

		var rnd = Math.round(Math.random()*1048576);
		var url=(!nocashe)?url:url+'?rnd='+rnd
		
		var params='';
		params+='<param name="movie" value="'+url+'" />';
		params+='<param name="quality" value="high" />';
		params+='<param name="play" value="true" />';
		params+='<param name="loop" value="true" />';
		params+='<param name="wmode" value="transparent" />';
		params+='<param name="scale" value="showall" />';
		params+='<param name="menu" value="true" />';
		params+='<param name="devicefont" value="false" />';
		params+='<param name="salign" value="" />';
		params+='<param name="allowScriptAccess" value="sameDomain" />';
		params+='<param name="flashVars" value="'+par+'" />';		
		
		var flashHtm='';
		flashHtm+='<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"  width="'+w+'" height="'+h+'" id="'+id+'" name="'+id+'" align="middle">';
		flashHtm+=params;
		flashHtm+='<!--[if !IE]>-->';
		flashHtm+='<object type="application/x-shockwave-flash" data="'+url+'" width="'+w+'" height="'+h+'" id="'+id+'" name="'+id+'">';
		flashHtm+=params;
		flashHtm+='<!--<![endif]-->';
		
		if (image_url){
			flashHtm+='<img src="'+image_url+'"/>';
		}/*else{
			flashHtm+='<a href="http://www.adobe.com/go/getflash">';
			flashHtm+='<img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash player" />';
			flashHtm+='</a>';
			
		}*/
		
		flashHtm+='<!--[if !IE]>-->';
		flashHtm+='</object>';
		flashHtm+='<!--<![endif]-->';
		flashHtm+='</object>';
		
		if (ret) return flashHtm; else document.write(flashHtm);
}

function insertFlash2(bnFlash,bnW,bnH,flashV,params,nocashe,bgcolor,ret){ //Вставить флеш, если ret=1 вернуть код
        var rnd = Math.round(Math.random()*1048576);
        var flashID=bnFlash;
        if (bnFlash.indexOf('/')!=-1){
                flashID=bnFlash.split('/');
                flashID=flashID[flashID.length-1];
        }
        flashID=flashID.split('.');
        flashID=flashID[0];
        var flashHtm='';
        flashHtm+='<object codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="'+bnW+'" height="'+bnH+'" id="'+flashID+'" align="middle">';
        flashHtm+='<param name="allowScriptAccess" value="sameDomain" />';
        flashHtm+=(nocashe)?'<param name="movie" value="'+bnFlash+'?rnd='+rnd+'" />':'<param name="movie" value="'+bnFlash+'" />';
        flashHtm+='<param name="quality" value="high" />';
		flashHtm+='<param name="allowFullScreen" value="true" />';
        flashHtm+='<param name="flashVars" value="'+params+'" />';
        if (!bgcolor){
             flashHtm+='<param name="wmode" value="transparent" />';
             flashHtm+='<embed src="'+bnFlash+'" wmode="transparent" flashVars="'+params+'" quality="high" width="'+bnW+'" height="'+bnH+'" name="'+flashID+'" align="middle" allowScriptAccess="sameDomain" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';
        }else{
             flashHtm+='<param name="bgcolor" value="'+bgcolor+'" />';
             flashHtm+='<embed src="'+bnFlash+'" flashVars="'+params+'" allowFullScreen="true" quality="high" bgcolor="'+bgcolor+'" width="'+bnW+'" height="'+bnH+'" name="'+flashID+'" align="middle" allowScriptAccess="sameDomain" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';
        }
        flashHtm+='</object>';
		if (ret) return flashHtm; else document.write(flashHtm);
}

//Функция отправки запроса на удаленный URL методом GET. 2й параметр - ф-ия после выполнения запроса
var ajaxReq=false;
function loadXMLDoc(url,func,params) {
	ajaxReq = (window.XMLHttpRequest)?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");
	ajaxReq.onreadystatechange = func;
	ajaxReq.open("POST",url, true);
	ajaxReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajaxReq.setRequestHeader("Accept-Charset", "utf-8");
	ajaxReq.setRequestHeader("Content-Length",params.length);
	ajaxReq.send(params);
}

function processReqChange() {
	if (ajaxReq){
	    abort = window.setTimeout("ajaxReq.abort();", 10000);
	    if (ajaxReq.readyState == 4) {
	        clearTimeout(abort);
	        if (ajaxReq.status == 200) {
				alert(ajaxReq.responseText);
	        } else {
	            alert("Неудачный запрос серверу:n" + ajaxReq.statusText);
	        }
	    }
    }
}

//------Упрощенная функция отправки запроса (Адрес, ID контейнера, Параметры)
var sajaxReq=false;   //Объект упрощенного аякс запроса
var sajaxReqHTMLid=""; //Глобальная переменная идентификатора контейнера

function sXMLSendReq(url,id,params){
     (sajaxReq)?sajaxReq.abort():null;
     sajaxReqHTMLid=(id)?id:"";
	sajaxReq = (window.XMLHttpRequest)?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");
	sajaxReq.onreadystatechange = sXMLgetReq;
	sajaxReq.open("POST",url, true);
	if (params){
		sajaxReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		sajaxReq.setRequestHeader("Accept-Charset", "utf-8");
		sajaxReq.setRequestHeader("Content-Length",params.length);
	}
	sajaxReq.send(params);
}

function sXMLgetReq(){
     if (sajaxReq){
		if (sajaxReq.readyState == 4){
		     if (sajaxReq.status == 200 && sajaxReqHTMLid && document.getElementById(sajaxReqHTMLid)){
		          document.getElementById(sajaxReqHTMLid).className="";
		        	document.getElementById(sajaxReqHTMLid).innerHTML=sajaxReq.responseText;
	          }else{
//			     alert("К сожалению, сервер не вернул ответа на посланный запрос. Повторите попутку позднее. " + sajaxReq.statusText);
		    }
	     }
     }
}

function objectHTMLById(objectHTMLByIdid,objectHTMLByIdtext){
	if ((objectHTMLByIdobj=document.getElementById(objectHTMLByIdid)) && (objectHTMLByIdtext))
		objectHTMLByIdobj.innerHTML=objectHTMLByIdtext;
}

function getObjectHTML(wid){
	if (getObjectHTMLobj=document.getElementById(wid))
		return (getObjectHTMLobj.innerHTML);
	else
	     return false;
}

function objectById(objectByIdid){
	return document.getElementById(objectByIdid);
}

//*------------Крнец функций AJAX

function cfm(prt,url) { //v2.0
  if (confirm(prt)){
    location.href=url;
  };
}

var button={// 1.2 Графические кнопки
        over:function(obj,width){
			if (!obj.block)
                obj.style.backgroundPosition='-'+width;
			 if (!obj.attached){
				 obj.onmousedown=function(){if (!obj.block) obj.style.backgroundPosition='-'+width*2;};
				 obj.onmouseout=function(){if (!obj.block)obj.style.backgroundPosition='0';};
				 obj.onmouseup=function(){if (!obj.block)obj.style.backgroundPosition='-'+width;};
				 obj.attached=true;
			 }
        },
	   disabled:function(obj,width){
			obj.style.backgroundPosition='-'+width*3;
			obj.block=true;
	   },
	   enabled:function(obj,width){
			obj.style.backgroundPosition='0';
			obj.block=false;			
	   }
}

document.getElementsByClassName = function(cl) { // 1.2 Получить DOM объект по классу
	var retnode = [];
	var myclass = new RegExp('\\b'+cl+'\\b');
	var elem = this.getElementsByTagName('*');
	for (var i = 0; i < elem.length; i++) {
		var classes = elem[i].className;
		if (myclass.test(classes)) retnode.push(elem[i]);
	}
	return retnode; // возвращает массив объектов
}; 

function onLoad(func){ //1.1 Срабатывает при загрузке окна
if (IE)
         window.attachEvent("onload",func)
else
         window.addEventListener("load",func,true)
}

Function.prototype.c4bind=function(object){ //Универсальная функция передачи this в события
  var method=this;
  var arg=arguments;
  return function(arg){return method.apply(object,arguments);}
}
 
function event(obj,eventname,func,this_obj){ //1.2 Кроссбраузерная функция стыковки событий
	if (this_obj){
		if (IE) 	obj.attachEvent("on"+eventname,func.c4bind(this_obj))
		else 	obj.addEventListener(eventname,func.c4bind(this_obj),true)  
	}else{
		if (IE) 	obj.attachEvent("on"+eventname,func)
		else 	obj.addEventListener(eventname,func,true)
	} 
}

function echo(text){//1.5 Функция вывода на экран
	if ($('#echo_div_object').size()==0){
		$('body').append('<div id="echo_div_object"><div id="echo_div_object_clear">c</div><div id="echo_div_object_close">x</div><div id="echo_div_object_i">'+text+'</div></div>');		
		$('#echo_div_object').css({overflow:'hidden',color:'#888888',fontFamily:'currier',fontSize:'13px',background:'#000000',bottom:100,opacity:0.85, zIndex:100000000,position:'fixed',height:300,width:270,left:0,border:'1px solid #000'});
		$('#echo_div_object_i').css({overflow:'auto',padding:10, position:'absolute',height:250,width:250,top:30});
		$('#echo_div_object_close').css({cursor:'pointer',background:'rgba(0,0,0,0.5)',textAlign:'center',fontSize:'11px',top:5, right:5,  zIndex:2,position:'absolute',height:16,width:16,border:'1px solid #666'}).click(function(){
			var $o=$('#echo_div_object');
			if (!$o.attr('closed') || $o.attr('closed')==0){
				$o.attr('closed',1).attr('dw',$o.width()).attr('dh',$o.height()).animate({'height':27},'fast').animate({'width':54},'fast');
			}else
				$o.animate({'height':$o.attr('dh')},'fast').animate({'width':$o.attr('dw')},'fast').attr('closed',0); 
		});
		
		$('#echo_div_object_clear').css({cursor:'pointer',background:'rgba(0,0,0,0.5)',textAlign:'center',fontSize:'11px',top:5, left:5,  zIndex:2,position:'absolute',height:16,width:16,border:'1px solid #666'}).click(function(){
			$('#echo_div_object_i').html('');
		});
		
	}else{
		var ec=$('#echo_div_object_i')
		ec.html($('#echo_div_object_i').html()+text+'<hr style="margin:2px 0px; background-color:#111;">').scrollTop(ec.attr("scrollHeight"));
	}
}

function n2en(s,$zero,$one,$two){//1.3 Умные окончания подставляют нужное в зависимости отчисла (Если закончилось на 1,на 2, на 3)
	if (s!==false){
		s='0'+s;
		k=1*(s.substr(s.length-2,s.length));
		sk=(''+k);
		k=1*((k>20)?sk.substr(sk.length-1,sk.length):k); 

		if (k==1){
			return ($one);
		}else
		if (k>=2 && k<=4){
			return ($two);
		}
		return ($zero);
	}
	return "";
}

/*########## C4 Функции ##############################################*/
c4={};

/*########## 1.3 jQuery парсинг ссылок в теле объекта ##############################################*/
/* Params: jQuery selector*/
/* Return: void()*/

c4.href_parse=function($s,length){ 
	if (!$s || $s.data('c4.href_parsed')) return;
	length=length?length:22;
	$s.data('c4.href_parsed','1');
	$s.each(function(){
		var commtxt=$(this).html();
		if (!IE) //Маразматический глюк парсера
			commtxt=commtxt.replace(/([^\"\'=])(https?:\/\/[a-z:\/0-9\.\?\=\_\&\%\#\,\-\;\+\~]+)/igm,function(s,p1,p2){
				var p3='';
				if (p2.substr(-1)==','){p2=p2.substr(0,p2.length-1);p3=',';}
				if (p2.substr(-1)=='.'){p2=p2.substr(0,p2.length-1);p3='.';}
				if (p2.substr(-1)=='?'){p2=p2.substr(0,p2.length-1);p3='?';}
				if (p2.substr(-1)=='!'){p2=p2.substr(0,p2.length-1);p3='!';}
				var si=p2.replace(/https?:\/\//ig,'');
				if (si.length>length){
					si=si.substr(0,length)+'...';
				}
				var html=p1+"<a target=_blank href='"+p2+"'>"+si+"</a>"+p3;
				return html;
			});
		$(this).html(commtxt);	
	});

}

//#### Класс пользовательских событий ##################################################################################

c4.CEvents=function(){ //1.6 Класс пользовательских событий
        this.count=0;
        this.events=[];
		
        this.attach=function(event,func,code){ //1.3 Переопределить / добавить реакцию на событие по коду
			var f=false;
			if (code){				
				for(var n=0;n<this.count;n++){// Проверка на уникальность функции
					if (this.events[n].code && this.events[n].code==code){
						f=true;
						this.add({'func':func,'event':event,'code':code},n);
						return;
					}
				}
			}
			if (!f){
				this.add({'func':func,'event':event,'code':code});	
			}
        }

        this.exec=function(event,data){ //1.2 Выполнение события
//				echo('Exec event - '+event); 
                for(var n=0;n<this.count;n++){
                        if (this.events[n].event==event && this.events[n].func && typeof (this.events[n].func)=='function'){
                                this.events[n].func(data);
								//echo('Exec event - '+event+' '+this.events[n].code);
                        }
                }
        }
		
		this.remove=function(code){ //1.1 Удаление списков событий по коду
			var nes=[];
			var nes_i=0;
			for(var n=0;n<this.count;n++){// Проверка на уникальность функции				
				if (this.events[n].code!=code){
					nes[nes_i]=this.events[n];
					nes_i++;
				}
			}
			this.events=nes;
			this.count=nes_i;
		}		
		
		this.add=function(event,num){ //Добавляет событие в общий списокк
			this.events[num?num:this.count]=event;
			if (!num) this.count++;			
		}
}

c4.c={}; //Вся информация из куков
//#### Информация о посетителе ##################################################################################
c4.c.user_visit=GetCookie ('_SITE_USER_COUNTER');
c4.c.user_start=GetCookie ('_SITE_USER_LASTDATE');



/*######## jQuery.alignTop 1.8 ###################################################*/
/*
* 	 Приклеить элемент к веху во время скрола
*  	 $(function(){$('.dnt_element_arrows').alignTop({onTop:function(top){ }});});
*    1.8 - Поддержка контейнера без офсета
*    1.7 - Поддержка контейнера отличеного от window
*    1.3 - Поддержка горизонтального скрола
* 
*/
(function($){

   $.fn.alignTop = function(options_in){ 
      var options={
         top:0, 				//Минимальное расстояние от верха
         max:0, 				//Максимальное смещение
         container:window 	//Скролируемый контейнер
         /*	onTop:null, //Событие при прилипшем состоянии
			onTopIn:null,//Событие при прилипании
			onTopOut:null//Событие при отлипании*/
      };
      $.extend(options,options_in);
 
 

 
      return this.each(function(n){
         var _this = this;			
         var $this = $(this);
			
			var loaded=false;
         var topped=false;
         var untopped=false;
         if ($this.data().uid){
            var uid=$this.data().uid;
         }else{
            var uid=Math.round(1000+8000*Math.random());
            $this.data('uid',uid);
         }
         var def={}; //Параметры по умолчанию
         var $conteiner=false;

         var untop=function(){
            topped=false; 
            if (!untopped) {
               untopped=true; 
               if (options.onTopOut) options.onTopOut.apply(_this);					
               //$this.css(def.css);
               $this.attr('style','');
               $this.removeClass('c4_aligned');
               if ($conteiner)	$conteiner.remove();
            }			
         }

         var on_load=function(m){			
            def.css={}; //Параметры по умолчанию		
 
            var load_defaults=function(){		
           
					loaded=true;
                              
               var wsl=$(options.container).scrollLeft();				
               var wst=$(options.container).scrollTop();               
               
               def.css.left=$this.css('left');
               def.css.top=$this.css('top');
               def.css.bottom=$this.css('bottom');
               def.css.right=$this.css('right');
               def.css.position=$this.css('position');

               def.css.marginBottom=$this.css('marginBottom');
               def.css.marginTop=$this.css('marginTop');
               def.css.marginLeft=$this.css('marginLeft');
               def.css.marginRight=$this.css('marginRight');

               def.css.paddingBottom=$this.css('paddingBottom');
               def.css.paddingTop=$this.css('paddingTop');
               def.css.paddingLeft=$this.css('paddingLeft');
               def.css.paddingRight=$this.css('paddingRight');			

               def.css.display=$this.css('display');
               def.css.width=$this.css('width');

               def.css.height=$this.css('height');

               def.css.width_calc=$this.width();

               $this.data('body_width',$this.width()==$('body').width()?1:0);
               def.css.height_calc=$this.height();

               def.offset=$this.offset();
               def.position=$this.position(); 		
               
               def.offset.top+=wst;
               def.offset.left+=wsl;
            }
            
 


            var on_scroll=function(e){

       
               if (!loaded) load_defaults();
               var wsl=$(options.container).scrollLeft();				
               var wst=$(options.container).scrollTop();
               
               if ($(options.container).offset()){
                  var wot=$(options.container).offset().top;				
                  var wol=$(options.container).offset().left;
               } else{
                  wot=0;
                  wol=0;

               }
 

               
               var maxTopStop=options.max?((wst-def.offset.top)>options.max):false;
               var maxTopStop_offset=wst-def.offset.top-options.max;
               maxTopStop_offset=options.max?(maxTopStop_offset>0?maxTopStop_offset:0):0;

               if (wst>def.offset.top-options.top-wot){
                  untopped=false;
                  $this.css({marginTop:-1*maxTopStop_offset});
                  $this.css({left:def.offset.left-wsl});

                  if (!topped) { 

                     topped=true; 
                     if (options.onTopIn) options.onTopIn.apply(_this);		

                     $conteiner=$("<div class='c4_align_top_item'></div>").css(def.css);			
                     $conteiner.append("<div style='width:"+def.css.width_calc+"; height:"+def.css.height_calc+";'></div>");

                     $this.before($conteiner); 
                     $this.css({
                        top:options.top+wot,
                        left:def.offset.left-wsl,
                        'position':'fixed',
                        'zIndex':'10000',
                        'width':def.css.width
                     }); 

                     $this.addClass('c4_aligned');
                  }
                  if (options.onTop) options.onTop.apply(_this,[wst-def.offset.top]);	
               }else{
                  untop();
               }
            }

           

            $(options.container).off('scroll.alignTop'+n+uid).on('scroll.alignTop'+n+uid,on_scroll);	
            $(options.container).off('resize.alignTop'+n+uid).on('resize.alignTop'+n+uid,function(){
               untop();
               on_scroll();
            });	
            on_scroll();
         }
 
         $(window).off('load.alignTop'+n+uid).on('load.alignTop'+n+uid,on_load);			

      });
   }		
})(jQuery);





//#### 1.3 Трехпозиционные кнопки фон ##################################################################################
(function($){	
	$.fn.c4_png3Button = function(options_in){ 
		var options={};
		$.extend(options,options_in);
		
		return this.each(function(){						
			var _this = this;			
			var d=$(this);
 
			if (d.css('backgroundPosition')){
				var bgt=d.css('backgroundPosition').split(' ');
				var def_left=bgt[0].replace('px','').replace('%','').replace('em','');
			}else{
				bgt=[0,0];
				def_left=0;
			}
			var w=d.width();
			

			d.unbind('mouseover.png3Button').bind('mouseover.png3Button',function(){
				var bgt=d.css('backgroundPosition').split(' ');bgt=bgt[1];
				d.css({backgroundPosition:def_left-w+'px '+bgt});
			});
			d.unbind('mouseout.png3Button').bind('mouseout.png3Button',function(){
				var bgt=d.css('backgroundPosition').split(' ');bgt=bgt[1];
				d.css({backgroundPosition:def_left+'px '+bgt});
			});
			d.unbind('mousedown.png3Button').bind('mousedown.png3Button',function(){
				var bgt=d.css('backgroundPosition').split(' ');bgt=bgt[1];
				d.css({backgroundPosition:def_left-w*2+'px '+bgt});
			});
			d.bind('mouseup',function(){
				var bgt=d.css('backgroundPosition').split(' ');bgt=bgt[1];
				if ($(this).attr('rel') || $(this).attr('eval')) d.unbind();
				d.css({backgroundPosition:def_left+'px '+bgt});
				if ($(this).attr('rel')) location=$(this).attr('rel');
				if ($(this).attr('eval')) eval($(this).attr('eval'));						
			});
			
			var att=$('.3btn').attr('attach');
			if (att){
				var attach_obj=eval(att);
				attach_obj.hover(function(){d.mouseover()},function(){d.mouseout()});
				attach_obj.mousedown(function(){d.mousedown()});
				attach_obj.mouseup(function(){d.mouseup()});
			}			

		});		
	}		
})(jQuery);


//#### Дефолтные значения инпутов 1.4 ##################################################################################
/*  
* <input id="Имя пользователя" label="Значение по умолчанию" value="" type=text name="form[mail]">
* $(this).data('c4_dv').is_empty() - Проверка пустоты поля
*/
(function($){	
	$.fn.c4_dv = function(options_in){ 
		var options={
			attr:'label', /*Атрибут в котором содержится значение метки*/
			on_focus:function(){},
			on_blur:function(){},
			on_submit:function(){}
		};
		$.extend(options,options_in);
		return this.each(function(){
			var _this = this;			
			var d=$(this);
			var f=d.parents("form");
			
			if (!_this.value || _this.value==' ' || _this.value=='' || !d.val()){
				$(this).val($(this).attr(options.attr));
			}
			$(this).attr('data-dvvalue',this.value);
			$(this).addClass('c4_dv_passive');			
			
 		
			d.data('c4_dv',{
					is_empty:function(){//1.0 Проверка пустого поля
						return (d.attr('data-dvvalue')==_this.value)?true:false;
					}
				}	
			);
			
			d.unbind('focus.c4_dv').bind('focus.c4_dv',function(){
				if (d.attr('data-dvvalue')==_this.value){d.removeClass('c4_dv_passive'); _this.value='';}
				options.on_focus(_this);
			});
			
			d.unbind('blur.c4_dv').bind('blur.c4_dv',function(){
				if (!_this.value){ d.addClass('c4_dv_passive'); _this.value=d.attr('data-dvvalue');}
				options.on_blur(_this);
			});
			
			if (f){
				f.unbind('submit.c4_dv').bind('submit.c4_dv',function(){
					if (_this.value== d.attr(options.attr) || _this.value==' '){
						_this.value='';
					}
					options.on_submit(_this);
					
				});
			}
			
			
									
		});		
	}		
})(jQuery);

/*######## Заглушка при отсутствии консоли для IE ###################################################*/
if (!window.console){
    window.console = {
        log : function(){},
        error : function(){},
        warn : function(){},
        info : function(){},
        profileEnd : function(){},
        profile : function(){},
        timeEnd : function(){},
        time : function(){},
        groupEnd : function(){},
        group : function(){},
        dir : function(){}
    }
}


 /*######## jQuery.onScreen 1.5 ###################################################*/
/*
* 	Функция сработает при появлении элемента на экране
*	$('.item').onScreen(function(){console.log('Showed!');});
* 	$('.item').on('onscreen',function(){console.log('Showed!')});
*/
(function($){
	$.fn.onScreen = function(onscreen,offscreen,options_in){ 
   	var _this = this;
      
   	if ($(_this).data('it-onscreen-trigger')) return;
   	$(_this).data('it-onscreen-trigger',1)
      
		var o={ 	
			offset:0, //Смешение срабатывания[-1 весь объект, >0 часть что сверху на столько пикселей]
			offsetTop:options_in && options_in.offset?options_in.offset:0, //Увеличение верхней границы экрана для срабатывания
			offsetBottom:options_in && options_in.offset?options_in.offset:0, //Увеличение нижней границы экрана для срабатывания
		};
		$.extend(o,options_in);	
      
		var onScreen=function($obj){	
			var st=$(window).scrollTop();
			var wh=$(window).height();
			var _o=$obj.offset();
			var oh=$obj.height();
		/*	if (((o.offset==-1) && ((st+wh)>(_o.top+oh))) || (o.offset>=0 && ((st+wh-o.offset)>(_o.top)))) return true;*/
			if ( _o.top+oh<st+wh+o.offsetBottom && _o.top>st-o.offsetTop) return true;
			return false;
		}
		
		$(window).off('scroll.onScreen.'+_this.selector).on('scroll.onScreen.'+_this.selector,function(d){
			_this.each(function(n){	
				var ___t=this;
				if (onScreen($(this)) && !$(this).data('onscreen')){				
					$(this).trigger('onscreen',_this).data('onscreen',true);			
				}
				if (!onScreen($(this)) && $(this).data('onscreen')){
					$(this).trigger('offscreen',_this).data('onscreen',false);
				}	 
			});
		})
		if (onscreen) $(document).on("onscreen",_this.selector,onscreen);
		if (offscreen) $(document).on("offscreen",_this.selector,offscreen);
		return this;		
	}		
})(jQuery);




 /*######## jQuery.qGet 1.12 ###################################################*/
/*
* 	Загрузка фрагмента
	$('.items').qGet({url:'http://site.ru',from:'.items',method:'html'});
	$('.items').qGet({url:'http://site.ru',method:'append',on_load:function(){alert('1')}});
*/
(function($){	
	$.fn.qGet = function(options_in){ 
		if (!this || !this.size()) return;
		var def_class=this.get(0).className;
		def_class=def_class?'.'+def_class.replace(/ /img,'.'):def_class;
		var def_id=this.get(0).id;
		def_id=def_id?'#'+def_id:'';
		
		var random_url=function(url){
			url+=(url.indexOf('?')==-1?'?':'&')+'qget_random_value='+Math.random();
			return url;
		}
		
		var o={
			url:window.location.href, //Селектор выборки из результата
			random_url:true, //Преобразовывать url в случайный
			from:def_id?def_id:(def_class?def_class:''), //Селектор выборки из результата по умолчанию
			method:'append', // append | html | inOut (скрыть раскрыть)
			effect:'slideDown', //slideDown | fadeIn | show 	 	
			effect_duration:400,//Скорость эффекта
			hide_src:true, //скрывать все src даты до загрузки контента
			on_load:false, //При загрузке аякса
			on_show_before:false, //Перед анимацией после обработки DOM
			on_show:false, //При отображении данных 
			on_error:false //При отображении данных
		};
		$.extend(o,options_in);				 
		if (!o.from) {console.error('$.qGet: Ошибка передачи параметра from');	return;	}
		
		return this.each(function(en){
			var _t = this;			
			if (o.method=='inOut'){
				var temp_class='_c4_qGet_slide_up_'+en;
				var aeffect='';
				aeffect=(o.effect=='slideDown')?'slideUp':aeffect;
				aeffect=(o.effect=='fadeIn')?'fadeOut':aeffect;
				aeffect=(o.effect=='show')?'':aeffect;
				
				$(this).wrapInner("<div class='"+temp_class+"'></div>");
				if (aeffect) $('.'+temp_class)[aeffect]();				 			 
			}		
			var url=o.random_url?random_url(o.url):o.url;
			$.get(url,function(d,n){
				if (o.on_load) o.on_load.apply(_t,[d]);
				var temp_class='_c4_qGet_'+n;
				d=(o.hide_src)?d.replace(/ src=/img,' _src='):d;
				d=(o.hide_src)?d.replace(/:url\(/img,':_url('):d; 
				var $dom=$(d);
				var obj=$dom.find(o.from+':first');
				if (!obj.size()){if (o.on_error) o.on_error.apply(_t,[d]); return false;} //Если нет объекта
				var html=obj.html();					
				var html='<div class="'+temp_class+'" style="display:none">'+html+'</div>';	
				var html=(o.hide_src)?html.replace(/ _src=/img,' src='):html;
				var html=(o.hide_src)?html.replace(/:_url\(/img,':url('):html;
			
				var replace_method=(o.method=='append'|| o.method=='html')?o.method:'html';
				var new_element=$(_t)[replace_method](html);
				if (o.on_show_before) o.on_show_before.apply(_t,[d,new_element]);
				delete $dom;			
				
				var temp_object=new_element.find('.'+temp_class);
				var unwrap_function=function($object){
					$object.find('*:first').unwrap();					
					if (o.on_show) o.on_show.apply(_t,[d,new_element]);
					delete html;				
				}
				if (o.effect && o.effect!='show'){
					temp_object[o.effect](o.effect_duration,function(){								
						unwrap_function($(this));
					});
				}else{
					unwrap_function(temp_object);
				}
			});
		});		
		
	}		
})(jQuery);



/*######## jQuery.shorter 1.3 ###################################################*/
/*
* 	Укорачиватель названий
	$('.items').shorter({length:5});
	или 
	<div class='' data-shorter='32'></div>
	$('[data-shorter]').shorter();
*/
(function($){	
	$.fn.shorter = function(options_in){ 	
		var o={
			length:22, //Максимальное количество символов
			on_replace:false,
			label:'...',
			more:false,
			more_label_prefix:'... ',
			more_label:'показать полностью'
		};
		$.extend(o,options_in);				
		return this.each(function(){
			var _t = this,
				text=$(_t).text().replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' '),	
				length=$(_t).data('shorter')?$(_t).data('shorter'):o.length;
				o.more=$(_t).data('shorter-more')!=undefined?$(_t).data('shorter-more'):o.more;
				o.more_label_prefix=$(_t).data('shorter-more-label-prefix')?$(_t).data('shorter-more-label-prefix'):o.more_label_prefix;
				o.more_label=$(_t).data('shorter-more-label')?$(_t).data('shorter-more-label'):o.more_label;
				
			if (!length) return;
			
			$(_t).addClass('shorter_field');			
			if (text.length>length-o.label.length || (o.more && text.length>length-o.more_label.length)){
				if (o.more){
					$(_t).data('shorter-html',$(_t).html());
					var $ml=$("<span class='shorter_more_label'>"+o.more_label+"</span>");
					var $mlp=$("<span class='shorter_more_label_prefix'>"+o.more_label_prefix+"</span>");
					$ml.on('click',function(){$(this).parent().html($(this).parent().data('shorter-html'))});
					$(_t).text(text.substr(0,length-o.more_label.length)).append($mlp).append($ml);
				}else{
					$(_t).text(text.substr(0,length-o.label.length)).append(o.label).attr('title',text);
				}
				
				
				if (o.on_replace) o.on_replace.apply(_t);	
			}else{
				$(_t).text(text); //Очищаем от спецсимволов
			}		
		});		
		
	}		
})(jQuery);


/**######## C4.Gototop 1.4  - переход вверх ###################################################
 * 
 * @example:   
  $(function(){
      c4_gototop({
         title:'', 
         bg_rgba:'0,0,0,0', 
         color_rgba:'255,255,255,1', 
         radius:'', 
         level:450, 
     });
  });
   
 * */

function c4_gototop(options_in){
	var o={
		title:					'&uarr;', 
		bg_rgba:					'0,0,0,0.6', 
		color_rgba:				'255,255,255,0.6', 
		radius:					'40px 0px 40px 0px', 
		level:					450, 
		time:						400, 
		removeAnchor:			true, 	//Очищать анкоры при прокрутке вверх
//		Container:				window 	//Контейнер в котором 
	};
	$.extend(o,options_in);	
	
	if (MOB) return;
	var topOn=false;
   var topOn_object=$("<div class='c4-gototop gototop hand noselect'><div class='gototop_i noselect'>"+o.title+"</div></div>");   


   topOn_object.css({
      width:		'79px',
      height: 		'17px',
      display: 	'table',
      opacity: 	'0',
      position: 	'fixed',
      bottom: 		'0px',
      right: 		'25px',
      cursor: 		'pointer',
      transition: 'all 0.3s ease-in-out',
      zIndex:		'-1'
   });


   topOn_object.find('.gototop_i').css({
      display:				'table',
      verticalAlign:		'center',
      textAlign:			'middle',
      background:			'rgba('+o.bg_rgba+')',
      color:				'#aaa',
      padding:				'5px 20px',
      color:				'rgba('+o.color_rgba+')',
      borderRadius:		o.radius,
      fontSize:			'11px',
      whiteSpace:			'nowrap'
   });


	
	var topOn_f=function(){
		var t=$(window).scrollTop();
		if (t>o.level && !topOn){
			topOn=true;			
			topOn_object.css({opacity:1,bottom:25,zIndex:2000}).addClass('__visible').removeClass('__hidden');
		}
		
		if (t<=o.level && topOn){
			topOn=false;
			topOn_object.css({opacity:0,bottom:5,zIndex:-1}).removeClass('__visible').addClass('__hidden');
		}

	};
	
	$(document).on('click','.gototop',function(){
		$('body,html').animate({
				scrollTop: 0
			}, o.time,function(){
        		if (o.removeAnchor){
            	var baseUrl=location.href;
               if (baseUrl.indexOf('#')!=-1){
                  baseUrl=baseUrl.split('#')[0];              
                  try {
                     window.history.pushState({}, '', baseUrl);
                  } catch(e) {
                  } 
               }
            }
         });
	});
	$('body').append(topOn_object);
	$(window).on('scroll',topOn_f);
	topOn_f();
}



/*######## Динамические обработчики 1.7 ###################################################*/
/*
* Событие при обновлении фрагмента дом структуры
* $.c4_dom(function(){$(this).find('.selector');}); //Инициализация
* $('.selector').c4_dom(); //Триггер при обновлении DOM обекта
*
* Работа с параметрами обновления
* $.c4_dom(function(data){$(this).find('.selector').html(data);}); //Инициализация
* $('.selector').c4_dom(data); //Триггер при обновлении DOM обекта
* 
*/
(function($){
	
	$.c4_dom=function(func){ //Инициализация события
		if (func && func!=undefined){
			$(document).on('on_c4_dom',function(e,p,data){
				try{
					p=p?p:document; 
					func.apply(p,[data]);
				}catch(e){
					console.error(e);
				}
			});
		}		
	}
	
	$(function(){ //Активация при старте
		$(document).trigger('on_c4_dom');
	});

	$.fn.c4_dom = function(data){ 	 //Запуск функции обработки html
		$(document).trigger('on_c4_dom',[this,data]);	
		return this;
	} 
	
})(jQuery);
 
/*######## jQuery.c4_select_text 1.0b ###################################################*/
/*
* Выбор текста DOM элементе
* 
*/ 
(function($){
 	$.fn.c4_select_text = function(){ 	 
 		return this.each(function(){
			var _t = this; 	
			if (IE) {
				var range = document.body.createTextRange();
				range.moveToElementText(_t);
				range.select();
			} else if (FF || OP) {
				var selection = window.getSelection();
				var range = document.createRange();
				range.selectNodeContents(_t);
				selection.removeAllRanges();
				selection.addRange(range);
			} else   {
				var selection = window.getSelection();
				selection.setBaseAndExtent(_t, 0, _t, 1);
			}
		});	 	
	} 
})(jQuery);
  
/*######## jQuery.c4_eip 1.8 ###################################################*/
/*
* 	Редактировать элемент на месте или Edit in Place
	$('[data-eip-url]').c4_eip();
	
	Атрибуты:
	data-eip-url - {url:""} //Адрес отправки постом par
	?data-eip-on_stop - {on_stop:""} //Выполнение кода после получения
   
				interval:$(_t).data('eip-interval'),
				url:$(_t).data('eip-url'),
				on_stop:$(_t).data('eip-on_stop'),
				on_save:$(_t).data('eip-on_save'),
				mode:$(_t).data('eip-mode'),  
				selected:$(_t).data('eip-selected'),
            sendmode:$(_t).data('eip-sendmode')		//[get || post || none] - Режим отправки данных   
	
	События:
	save - параметр - строка или возвращаемый объект
	stop - при завершении редактирования
	start - При начале редактирования
*/
(function($){	
	$.fn.c4_eip = function(options_in){ 	
		var o={
			interval:1000, 	//Период проверки информации для автоматического сохранения
			url:'', 				//Адрес отправки постом par
			on_stop:'', 		//Выполнение кода после получения
			on_save:'', 		//Выполнение кода после получения
			selected:false, 	//Выделять при начале редактирования
			enter_save:true, 	//Сохранять при enter или переводить строку
			placeholder:'', 	//При пустом значении
			mode:'text', 		//[text || html || html_strip]
			sendmode:'post', 	//[get || post || none] - Режим отправки данных
		};
		$.extend(o,options_in);	
		var $scope=this;
		this.addClass('c4_eip_edit');
		
		scope_stop=function(){
			$scope.each(function(){
				if ($(this).data('c4_eip') && $(this).data('c4_eip').editing) $(this).data('c4_eip').stop();
			});			
		}
		
	/*	$(document).unbind('click.c4_eip').on('click.c4_eip',function(e){
//console.log('external click');		
 	
//			scope_stop();
		});
  */
		
		var CEIP=function(__t,__props){		
			var _CEIP=this;			
			_CEIP.first_text_selected=false;
			_CEIP.editing=false;
			_CEIP.placeholdered=false; //Режим плейсхолдера
			_CEIP.undo_text='';
			_CEIP.saved_text='';
			_CEIP.dynamic_save={
				interval_period:__props.interval,
				interval:'',
				last_html:'',
				start:function(callback){
					_CEIP.dynamic_save.stop();
					_CEIP.dynamic_save.interval=setInterval(function(){
						var date=new Date();
						if (!_CEIP.dynamic_save.last_html){
							_CEIP.dynamic_save.last_html=$(__t).html();
						}else{
							if (_CEIP.dynamic_save.last_html!=$(__t).html() && $(__t).data('last_keypress')<date.getTime()-300){
								_CEIP.dynamic_save.last_html=$(__t).html();
								_CEIP.save();
							}
						}
						if (callback) callback();
					},_CEIP.dynamic_save.interval_period);
				},
				stop:function(){
					if (_CEIP.dynamic_save.interval)
						clearInterval(_CEIP.dynamic_save.interval);
				}
			};
			_CEIP.save_interval_text='';			
			
 
			_CEIP.placeholder=function(){
				if (__props.placeholder && !$(__t).text()){
					_CEIP.placeholdered=true
					$(__t).html(o.placeholder).addClass('c4_eip_placeholder');						
				}			
				return _CEIP;	
			}

			_CEIP.start=function(){
				if (_CEIP.editing) return this;
				
				if (_CEIP.placeholdered){
					_CEIP.placeholdered=false;
					$(__t).removeClass('c4_eip_placeholder').text('');		
				}
 						
				scope_stop();
				
				_CEIP.editing=true;
				_CEIP.undo_text=$(__t).text();
				_CEIP.saved_text=$(__t).text();
				_CEIP.first_text_selected=false;
				
				$(__t).addClass('c4_eip_onedit').attr('contentEditable',true);				
				//if (!$(__t).is(":focus")) $(__t).focus();
												
				_CEIP.dynamic_save.start();
				$(__t).trigger('start');
				
				return this;
			}		
			
			_CEIP.mouseup=function(){
//console.log('mouseup');				
				if (__props.selected && !_CEIP.first_text_selected){
					$(__t).c4_select_text();
					_CEIP.first_text_selected=true;
				}						
			}
		
			_CEIP.stop=function(callback){ 
//console.log('stop');				
				if (!_CEIP.editing) return _CEIP;
				_CEIP.editing=false; 
				$(__t).removeClass('c4_eip_onedit').attr('contentEditable',false); 
				_CEIP.dynamic_save.stop();
				if (callback) callback();
				
				_CEIP.event(__props.on_stop,__t);
			 
				$(__t).trigger('stop');
				
				return _CEIP;
			}
		
			_CEIP.save=function(callback){ 
				var html=$(__t).html();
				var html_clear=html;
			 
				var text=$(__t).text();						
				
			 	html=html.replace(/\n/gim,'');
				html=html.replace(/<div><br><\/div>/gim,'<br>');
				html=html.replace(/<div>/gim,'<br>');
				html=html.replace(/<\/div>/gim,'');	
				html=html.replace(/ style=\"[^\"]*\"/gim,"");
				html=html.replace(/ style=\'[^\']*\'/gim,"");
				html=html.replace(/<font[^>]*>/gim,""); 
				html=html.replace(/<\/font[^>]*>/gim,"");  
				html=html.replace(/<span[^>]*>/gim,""); 
				html=html.replace(/<\/span[^>]*>/gim,""); 					

				html=html.replace(/<br>/gim,'$br$');		
				text=$('<div>'+html+'</div>').text().replace(/\$br\$/img,"\n");			 
 				
			//	$(__t).html(text.replace(/\n/img,"<br>"));
				
				
				
				if (text==_CEIP.saved_text || text=='---') return _CEIP; //Этот текст уже сохранен
		
				if (o.mode='html'){
					text=html_clear;
				}
/*
Ошибка первичного определения режима из атрибутов - исправить
console.log(o.mode);				
console.log(text);						*/
				_CEIP.saved_text=text;
				$(__t).addClass('c4_eip_onsave');

            if (__props.sendmode && __props.sendmode!='none'){            
               $[__props.sendmode](__props.url,{par:text},function(ret){
                  try{
                     eval('var obj='+ret);
                     if (obj){				
                        if (obj.func) obj.func();
                        if (typeof obj == "string" || typeof obj == "number"){  
                           $(__t).text(obj); 
                        }else{
                           if (obj.text!=='undefined'){  
                              if (o.mode='text' && obj.text){
                                 $(__t).text(obj.text); 
                              }
                              if (o.mode='html' && obj.text){									 
                                 $(__t).html(obj.text); 
                              }
                              if (!obj.text) {
                                 $(__t).text('---'); 
                              }
                           }
                        }
                        if (callback) callback(obj);
                     }
                     $(__t).trigger('save',obj);

                  }catch(e){
                     $(__t).trigger('save',ret);
                     if (callback) callback(ret);
                  }
                  $(__t).removeClass('c4_eip_onsave');	
                  _CEIP.event(__props.on_save,__t);				
               });	
            }else{
               if (callback) callback();
               $(__t).trigger('save');
               $(__t).removeClass('c4_eip_onsave');
               _CEIP.event(__props.on_save,__t);				
            }
            
            
				return _CEIP;
			}
			
			_CEIP.undo=function(callback){		
//console.log('undo');				
				$(__t).text(_CEIP.undo_text);
				if (callback) callback(ret);				
				return _CEIP;
			}
		
			_CEIP.event=function(data,__t){ //1.1 Выполнение события переданного параметром
				if (data){	
					try{
						var f=function(){};
						if (typeof data == "function"){
							f=data;
						}else{
							eval('f=function(){'+data+'}'); 
						}						
						f.apply(__t);
					}catch(e){}
				}				
			}
		}
		
		return this.each(function(n){
			var _t = this;
			
			if (!$(_t).attr('tabindex')) $(_t).attr('tabindex',n+500);
			
			var props={};
			$.extend(props,o);	
			var element_props={  							//Свойства из элементов
				interval:$(_t).data('eip-interval'),
				url:$(_t).data('eip-url'),
				on_stop:$(_t).data('eip-on_stop'),
				on_save:$(_t).data('eip-on_save'),
				mode:$(_t).data('eip-mode'),  
				selected:$(_t).data('eip-selected'),
            sendmode:$(_t).data('eip-sendmode')		//[get || post || none] - Режим отправки данных
			};
			$.extend(props,element_props);		
 	
			if (!props.url && props.sendmode!='none'){
				console.error('c4_eip::Параметр url не определен');
				return this;
			}
				
			var eip=new CEIP(_t,props);
 			$(_t).data('c4_eip',eip);

			eip.placeholder();	
			
			var focus_block=false;
	 		$(_t).unbind('mousedown').on('mousedown.c4_eip',function(e){  focus_block=true; eip.start(); }); 
			$(_t).on('mouseup.c4_eip',function(e){  eip.mouseup(); e.stopPropagation(); });
			$(_t).on('focus.c4_eip',function(e){ if (!focus_block){ eip.start(); eip.mouseup(); }  focus_block=false;});
			$(_t).on('blur.c4_eip',function(e){ eip.stop().save();  eip.placeholder(); });
			$(_t).on('keydown.c4_eip',function(e){
				if ( e.which == 13 && !e.shiftKey && o.enter_save) eip.stop().save();
				if ( e.which == 27 ) eip.stop().undo();
				$(_t).data('last_keypress',(new Date()).getTime());			
			});
		});	
		
	}		
})(jQuery);


/*######## 1.2 Установка динамического адреса location.href ###################################################*/
c4_setloc = function(loc,w) {
	w=w?w:window;
	try {
		w.history.pushState({}, '', loc);
		$(w.document).trigger('c4_setloc',loc);      
	} catch(e) {
	} 
} 

/*######## 1.1 При перемещении скролла окна вниз для автозагрузки элементов ###################################################*/
/** [DEPRECATED] [Удалить]*/
c4.onWindowScrollBottom=function(callback,options_in){
	var o={
		offset:MOB?300:30
		/*!!! BCGHFDBNM offset:10*/
	};
	$.extend(o,options_in);	
	$(window).on('scroll',function(e){
		var st=$(window).scrollTop();
		var sh=$(document).height();
		var sh2=$(document)[0].scrollHeight;
		var wh=$(window).height();
		if (st+wh+o.offset>sh){
			if (callback) callback({
				e:e,
				st:st,
				wh:wh,
				st:st
			});
		}
//$('#footer').html((st+wh+o.offset)+' '+sh+' '+sh2);

	});	
}
  
/** Слежение за скроллом, вызов события апри достижении нижней точки скроллирования
 * 
 * @version		1.2
 * 
 * @example		   $(window).scrollObserver({offsetBottom:100}).on('scrollBottom',function(){ alert('234'); });
 * */
 
   $.fn.scrollObserver = function(options_in){ 
      var o={
         offsetBottom:0,    	//Нижнее смещение при срабатывании скролла
         offsetTop:0,      
         offsetLeft:0,      
         offsetRight:0, 
         
         debug:false,      
      };
      $.extend(o,options_in);	

      this.each(function(){
         var _t=this;
         var _body=$(_t['document']).find('body').length?$(_t['document']).find('body'):_t;
         
         $(this).on('scroll',function(e){                
            var scrollTop=$(_t).scrollTop();
            var blockHeight=$(_t).height();
            var blockScrollHeight=_body.prop('scrollHeight');            
            if (scrollTop+blockHeight+o.offsetBottom>=blockScrollHeight){
               if (!$(_t).data('scrollObserverscrollBottomFired')){
               	if (o.debug) console.log("scrollObserver::trigger scrollBottom "+o.offsetBottom);
                  $(this).trigger('scrollBottom',[{
                     'scrollTop':scrollTop,
                     'blockHeight':blockHeight,
                     'blockScrollHeight':blockScrollHeight
                  }]);

                  $(_t).data('scrollObserverscrollBottomFired',true);
               }
            }else{
            	$(_t).data('scrollObserverscrollBottomFired',false);
            }
            
         });
      });
      return this;

   };

/*######## 1.8 Плавный скролл и процессор ссылок ###################################################*/
c4.anchor_processor = function(options_in){ 
	var __this={};
	var options={
		offset:0, /*Смещение от объекта*/	 
		speed:500, /*Скорость*/	 
		selector:'a[href ^= "#"],a[href ^= "'+location.pathname+'#"]', /*Селектор ссылок*/	 
		attr:'name', /*Аттрибут для выборки*/	 
	}; 
	$.extend(options,options_in);
	
	
	__this.target=false;
	
	c4.anchor_processor.clear=function(){ //1.1 Очистка ссылки от анкора
		c4_setloc(location.href.split('#')[0]);	
	};
	
	var go=function(anchor){		
		if (!anchor) return; 		      
       var $o=$('['+options.attr+'="'+anchor+'"]:first');
		if ($o.length){ 		
			var offset=$o.data('scroll-offset')?$o.data('scroll-offset'):options.offset;		
			var speed=$o.data('scroll-speed')?$o.data('scroll-speed'):options.speed;	
		
			var scroll = $o.offset().top+offset;
 			
			$('body,html').animate({scrollTop:scroll} , speed);
			return true;
		}else{			
			$(document).trigger('c4_anchor_processor',[__this.target,anchor]);
			return false;
		}	
		__this.target=false;
	}
	
	var loc_anchor = location.href.split('#')[1]; 	
	go(loc_anchor);	
	
	$(document).on('click.c4_anchor_processor',options.selector,function(e){
		var _this = this;
		var href=  $(_this).attr('href');
		var target=  $(_this).attr('target');
		var anchor = href.split('#')[1];
      
		var stopPropagation = href.split('#')[1];
      
		__this.target=_this
	
		if (href.indexOf('http')!=-1 || target=='_blank' || !anchor) return;
		c4_setloc($(_this).attr('href'));

      $(_this).trigger('c4_anchor_process_click',[anchor]);

		e.stopPropagation(); 
		e.preventDefault();			    

	})
	
	$(window).on('c4_setloc.c4_anchor_processor',function(e,loc){	
		var anchor = loc.split('#')[1];	
		if (!anchor) return;		
		go(anchor);		
	})

};


/*######## c4.smartInterval 1.3 - 22.03.2019 ###################################################*/

 /*
   var smartInterval=c4.setSmartInterval(function(){
   	console.log('ping');
   },2000);
     
   Или   
   
   var smartInterval=c4.setSmartInterval(function(){
   	console.log('ping');
   },2000,{
      debug:true,
      args:['1','2',true],
      inactive_slow:10000,
      inactive_stop:30000,
      activityCheck:500
	});
   
   c4.clearSmartInterval(smartInterval);      
*/

(function($){
   c4.smartIntervalInstance=function(p){
      var _this=this; 

      _this.smartInterval=null;
      _this.id='smartInterval'+Math.floor(Math.random() * 10000000);

      if (!p) return console.error('c4.smartIntervalInstance() Parameters not found use JSON {func:function(){},duration:20000}');

      _this.func_proto=p.func;																	//Запускаемая функция
      _this.func_args=p.args?p.args:[];														//Аргументы запускаемой функции    

      _this.interval_proto=p.interval;															 
      _this.interval=p.interval;																	// (мсек) Интервал вызовов
      _this.interval_slow=p.interval_slow?p.interval_slow:_this.interval*6;		// (мсек) Интервал замедленных вызовов

      _this.inactive_slow=p.inactive_slow?p.inactive_slow:1*60*1000; 				// (мсек) Продолжительность неактивности пользователя, затем уменьшается частота
      _this.inactive_stop=p.inactive_stop?p.inactive_stop:_this.inactive_slow*6; // (мсек) Продолжительность неактивности пользователя, затем уменьшается частота

      _this.debug_proto=p.debug!=null?p.debug:false;

		_this.mode='stop';  //	['normal','slow','stopped']; Режим работы
      
		_this.activityCheck=p.activityCheck?p.activityCheck:500;  						//Проверять триггер активности кадлые (мсек)
		_this.activity=false;																		//Триггер активности
		_this.activityInterval=null;																//Интервал сброса триггера активности


      _this.blur_event_name='blur.'+_this.id;
      _this.focus_event_name='focus.'+_this.id;
      
      _this.active_event_name='mousemove.'+_this.id+' scroll.'+_this.id+' click.'+_this.id+' keyup.'+_this.id;

		_this.debug=function(message){
       	if (_this.debug_proto) console.log(message);
       	//if (_this.debug) console.log(_this.id+'.'+message);
      }

      _this.func=function(){
         _this.func_proto.apply(_this,_this.func_args);
         _this.debug('func('+ _this.func_args+')');
      }

      _this.debug('init()'+_this.interval_proto);

      /*-- Public -------------------*/

      _this.start=function(){
         _this.debug('start()');
         _this.setMode('normal');

         $(window).off(_this.blur_event_name).on(_this.blur_event_name,function(){   
            _this.debug(_this.blur_event_name);
            _this.setMode('stop');
         })

         $(window).off(_this.focus_event_name).on(_this.focus_event_name,function(){        
            _this.debug(_this.focus_event_name);
            _this.setMode('normal');           
         })

         $(window)
            .off(_this.active_event_name)
            .on(_this.active_event_name,function(){    
            _this.activity=true;     

            ;  
         })

         _this.activityInterval=setInterval(function(){            
            if (_this.activity==true){
               _this.debug('activityCheck - active');
               if (!_this.setMode('normal')){
                  _this.reStartSlowTimeout();
                  _this.reStartStopTimeout();
               }
            }
            _this.activity=false;
         },_this.activityCheck);

         return _this;
      }

      _this.stop=function(){        
         _this.debug('stop()');
         
         $(window).off(focus_event_name);
         $(window).off(blur_event_name);
         $(window).off(active_event_name);

         _this.setMode('stop');
         
         return _this;
      }

		/*-- API -------------------*/

      _this.stopSlowTimeout=function(){
         _this.debug('stopSlowTimeout() '+_this.inactive_slow);
         if( _this.slowTimeout){
            clearTimeout( _this.slowTimeout);
         }
      }
      
      _this.reStartSlowTimeout=function(){
         _this.debug('reStartSlowTimeout() '+_this.inactive_slow);                  
         
         _this.stopSlowTimeout();
         
         _this.slowTimeout=setTimeout(function(){
            _this.debug('slowTimeout()');            
            _this.setMode('slow');
         },_this.inactive_slow);
      }

      _this.stopStopTimeout=function(){
         _this.debug('stopStopTimeout() '+_this.inactive_stop);
         if( _this.stopTimeout){
            clearTimeout( _this.stopTimeout);
         }
      }

      _this.reStartStopTimeout=function(){
         _this.debug('reStartStopTimeout() '+_this.inactive_stop);                  

         _this.stopStopTimeout();

         _this.stopTimeout=setTimeout(function(){
            _this.debug('stopTimeout()');            
            _this.setMode('stop');
         },_this.inactive_stop);
      }
      

      _this.startInterval=function(){
         _this.debug('startInterval() Interval:'+_this.interval);  
         _this.smartInterval=setInterval(_this.func,_this.interval);
      }

      _this.stopInterval=function(){
         _this.debug('stopInterval() Interval:'+_this.interval);  
         if (_this.smartInterval){
            clearInterval(_this.smartInterval);
            _this.smartInterval=null;
         }
      }

      _this.setMode=function(mode){
         if (_this.mode==mode) return false;
			var currentMode=_this.mode;

         if (mode=='normal'){
            _this.mode=mode;
            _this.stopInterval();
            _this.interval=_this.interval_proto;
            _this.startInterval();
            _this.reStartSlowTimeout();
            _this.reStartStopTimeout();
         };
         
         if (mode=='slow'){
            _this.mode=mode;
            _this.stopInterval();
            _this.interval=_this.interval_slow;
            _this.startInterval();
            _this.stopSlowTimeout();
         };
         
         if (mode=='stop'){
            _this.mode=mode;
            _this.stopInterval();
            _this.stopSlowTimeout();
            _this.stopStopTimeout();
         };                 
         _this.debug('setMode('+currentMode+'->'+mode+') Interval:'+_this.interval);
         return true;
      }      

      _this.start();
   }

   /*
   var interval=c4.setSmartInterval(function(){
   	console.log('ping');
   },2000,{
   	debug:true
      });

   c4.clearSmartInterval(interval);      
*/

   c4.setSmartInterval=function(func,interval,p){	
      var p=p?p:{};

      //p.debug=p.debug!=null?p.debug:false;

      return new c4.smartIntervalInstance({
         func:func,
         interval:interval,
         debug:p.debug,
         args:p.args,
         inactive_slow:p.inactive_slow,
         inactive_stop:p.inactive_stop
      });   
   }

   c4.clearSmartInterval=function(intervalInstance){
      intervalInstance.stop();
   }


})(jQuery);



/** Слежение за скроллом, вызов события апри достижении нижней точки скроллирования
 * 
 * @version		1.0
 * 
 * @example		
 * $(function(){
   $('.masonry-grid-js img').c4_AfterImages().then(function(){     
      console.log('allImagesLoaded');
   });
});

 * */

(function($){
	if (!$) return;
   
   $.fn.c4_AfterImages = function(){   
      var $this=this;
      var imagesLoaded = 0
      var totalImages = $this.length;
      return new Promise((resolve, reject) => {
         $this.each(function(){                
            $(this).on("load", function (event) {
               imagesLoaded++;
               if (imagesLoaded == totalImages) {
                  resolve();
               }
            })
         });
      })        
   }
})(jQuery);

