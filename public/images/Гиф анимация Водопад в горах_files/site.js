var px99e=new c4.CEvents();



/*######## Горячие клавиши 1.2 ###################################################*/
/*data-hotkey="ctrl+37" */
/*data-hotkey="ctrl+39" */

$(window).on('keydown',function(e){
   if (
      document.activeElement.tagName!='INPUT' &&
      document.activeElement.tagName!='TEXTAREA'
   ){
      if(e.ctrlKey && !e.altKey && !e.shiftKey){
         var $a=$('[data-hotkey="ctrl+'+e.which+'"]:first');
         if ($a.size() && $a.attr('href'))
            location=$a.attr('href'); 
      } 
      else
         if(!e.ctrlKey && !e.altKey && !e.shiftKey){
            var $a=$('[data-hotkey="'+e.which+'"]:first');
            if ($a.size() && $a.attr('href'))
               location=$a.attr('href'); 
         } 
   }
});


//c4.anchor_processor();


/*######## Минимизатор сайдбара ###################################################*/


$(document).on('click','[role="sidebar-minimize"]',function(){ 
   var scl='';
   var $sbm=$('[role="sidebar-minimize"]');
   if ($('[role="sidebar"]').hasClass( "collapse" )){
      $('[role="sidebar"]').removeClass('collapse');
      $('[role="content-wrapper"]').removeClass('col-md-12').addClass('col-md-9');

      $sbm.css({left:scl,position:'fixed'});

   }else{
      $('[role="sidebar"]').addClass('collapse');
      $('[role="content-wrapper"]').removeClass('col-md-9').addClass('col-md-12');

      scl=$sbm.offset.left;
      $sbm.css({left:'15px',position:'fixed'});
   }
   $(window).trigger('photo2_list_items_refresh');
   /*collapse in
collapse
*/
});


/*######## Функции элементов ###################################################*/

$(document).on('click','[data-role="func_button"]',function(){
   var rest=$(this).closest('[data-ext-url]').data('ext-url');
   var $t=$(this);
   var data={};
   data.cmd=$(this).data('data');
   data.id=$(this).closest('[data-item-id]').data('item-id');
   data.url=$(this).closest('[data-item-url]').data('item-url');

   if (!data.id) console.error('Не указан идентификатор элемента для [data-role="func_button"] укажите [data-item-id] у родителя');
   if (!rest) console.error('Не указана ссылка элемента для [data-role="func_button"] укажите [data-ext-url] у родителя');

   $t.addClass('waiter');

   $.get(rest+'itemfunc/',data,function(d){
      $t.removeClass('waiter');
      var $i=$t.find('i');

      if (!d || d.code<0 && !d.message){
         c4.error_noty('Ошибка выполнения функции');
      }else{
         if (d.code<0 && d.message){
            c4.error_noty(d.message);
         }else if(d.message){
            c4.info_noty(d.message);
         }
      }

      if (d.value){
         $t.html('').append($i).append(' '+d.value)
      }

   });
   //	alert(data);
})

/*######## Тултипы  ###################################################*/

$(function(){
   $(document).on('mouseover','[data-toggle="tooltip"]',function(){$(this).tooltip('show');})
});

/*######## Защита от ифрейм ###################################################*/

(function(){
   if (top!=window){ 
      if (top.location.href.indexOf('yandex.net')!=-1) return; //Вебвизор
      var count=1*GetCookie ('JS_IFRAME_REDIR');
      if (count>1) return;
      var p=location.pathname?location.pathname:'/';
      var h=location.host?location.host:'.99px.ru';
      SetCookie ('JS_IFRAME_REDIR',count+1,1,p,h);
      top.location.href=window.location.href;
   }
})();


/*######## Менеджер тэгов ###################################################*/

$.c4_dom(function(){
   $(this).find('[data-tagmanager]').c4_jquery_tagmanager(); 
});


/*######## Мобильное меню ###################################################*/
$(function(){

   $('[role=menu-toggle]').on('click',function(event){
      $(this).next().toggle();
   });

   $('[data-parent-toggle-class]').on('click',function(event){
      var cls=$(this).data('parent-toggle-class');
      $(this).next().toggleClass('parent-toggle-class-expand');
      if (cls) $(this).parent().toggleClass(cls);
   });


   if (MOB){	
      $('.top_menu_item_label').on('click',function(event){
         event.stopPropagation();
         event.preventDefault();	
      });
   }
   //
});


/*######## Список фото универсальный  ###################################################*/

$(function(){
   var fpl=function(){
      $('[data-collage]').each(function(){

         var h=$(this).data('collage-height');

         $(this).removeWhitespace().collagePlus({		
            'targetHeight'    : h?h:150,
            'effect'          : 'default',
            'fadeSpeed'       : "fast",
            'allowPartialLastRow' : true
         });
      });
   }

   var resizeTimer = null;
   $(window).on('resize', function() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(fpl, 200);
   }); 
   setTimeout(fpl, 200);
   //	fpl();
});

/*######## Список Категорий ###################################################*/
$(function(){


   var fpcl=function(){	

      $('.photo2_catlist').each(function(){	  
         var h=$(this).parent().parent().data('photo2_catlist-height');
         if (!h){
            h=200;
         }else{
            h=1*h;
         }
         if ($(window).width()>0 && $(window).width()<=768){
            h=800;
         }


         $(this).find('._cats').removeWhitespace().collagePlus({		
            'targetHeight'    : h,
            'effect'          : 'default',
            'fadeSpeed'       : "fast",
            'direction'       : 'vertical',
            'allowPartialLastRow' : MOB?false:true
         });

      }); 
   }

   var resizeTimer = null;
   $(window).on('resize', function() {
      $(window).trigger('photo2_catlist_items_refresh');
   }); 

   $(window).on('photo2_catlist_items_refresh', function() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(fpcl, 200);		
   });

   fpcl();
});

/*######## Список фото ###################################################*/
$(function(){
   var fpl=function(){	
      $('.photo2_list_items').each(function(){	  
         if ($(this).parent().hasClass('photo2_list_modid_1')==true) return;
         var h=$(this).parent().parent().data('photo2_list-height');
         var h= h?1*h:320;

         $(this).removeWhitespace().collagePlus({		
            'targetHeight'    : h,
            'effect'          : 'default',
            'fadeSpeed'       : "fast",
            'direction'       : 'vertical',
            'allowPartialLastRow' : MOB?false:true
         });
      });
   }

   var resizeTimer = null;
   $(window).on('resize', function() {
      $(window).trigger('photo2_list_items_refresh');
   }); 

   $(window).on('photo2_list_items_refresh', function() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(fpl, 200);		
   });

   fpl();


   //------ Проигрывание --------------


   $(document).on('click', '.photo2_tmb_play', function() {
      var $tmb=$(this).parent();
      var $t=$(this);
      var $img=$tmb.find('.photo2_tmb_img');
      var imgbig=$t.data('imgbig');
      var $mask=$('<div class="photo2_tmb_mask t_all"><div class="photo2_tmb_spinner"></div></div>');
      $tmb.append($mask);
      $tmb.addClass('state_loading');
      $img.on('load.tmb_play',function(){ 	
         $tmb.removeClass('state_loading');
         $mask.fadeOut(function(){$(this).remove()});
         $t.fadeOut(function(){$(this).remove()});
         $img.off('load.tmb_play');
      }).attr('src',imgbig);
   });

   //------ Отложенная загрузка --------------

   lazyload(document.querySelectorAll(".photo2_list .photo2_tmb_img"));
   lazyload(document.querySelectorAll("[data-lazyload=true]"));
});

$(function(){
   $('.random_item h2').shorter({length:31});
   $('.code_site span').shorter({length:22});
   $('.code_vk span').shorter({length:22});  
});

/*######## Правая кнопка ###################################################*/

rb_block=function(message){
   function clickIE() {if (document.all) {(message);return false;}}
   function clickNS(e) {if
      (document.layers||(document.getElementById&&!document.all)) {
         if (e.which==2) {
            (message);
            return false;}}}
   if (document.layers) {
      document.captureEvents(Event.MOUSEDOWN);
      document.onmousedown=clickNS;
   }else{
      document.onmouseup=clickNS;
      document.oncontextmenu=clickIE;
   }
   document.oncontextmenu=new Function("return false")

}
$(function(){
   if ($('.photo_feed').size()){
      rb_block();
   }
});
/*######## Перекидка при гугле в картинках ###################################################*/
$(function(){
   if (location.href!=top.location.href){
      top.location.href=location.href;
   }
});

/*######## Скролл ###################################################*/
$(function(){
   if (MOB) return;
   var topOn=false;
   var topOn_object=$("<div class='gototop hand noselect t_all'><div class='gototop_i noselect t_all'>Вверх <b>&uarr;</b></div></div>");   
   var topOn_f=function(){
      var t=$(window).scrollTop();
      if (t>450 && !topOn){
         topOn=true;			
         topOn_object.css({opacity:1,bottom:25});
      }

      if (t<=450 && topOn){
         topOn=false;
         topOn_object.css({opacity:0,bottom:5});
      }

   };


   $('body').append(topOn_object);
   $(window).on('scroll',topOn_f);
   topOn_object.on('click',function(){

      //	$(window).scrollTop(0);
      //$(document).animate( {scrollTop : 0}, 'slow');  
      $('body,html').animate({
         scrollTop: 0
      }, 400);		
   });	
   topOn_f();

});

/*######## 1.2 Динамический поиск элементов пользователя ###################################################*/

$(function(){
   var get_results=function(o){
      var $t=$(o);		
      var filter=escape($(o).val());		
      var url=$(o).attr('url');				
      var $container=$($(o).attr("container"));		
      if (!url) return;
      $t.addClass('waiter');
      $.get(url+filter,function(d){
         $container.html(d);
         $t.removeClass('waiter');
         setTimeout(function(){$('.g_search input:first').focus()},500);	
      });
      return false;		
   };

   $('.g_search input').c4_dv();	
   $('.g_search input').on('keydown',function(e){		
      if (e.keyCode==13){
         return get_results(this);
      }
      if (e.keyCode==27){ 
         $(this).val('');
         return false;
      }	
   });
   $('.g_search_btn').on('click',function(){
      var si=$(this).prev().get(0);
      if ($(si).attr('label')!=$(si).attr('value'))
         return get_results(si);
   });
});

/*######## Событие дом элементов при появлении ###################################################*/

$(function(){
   $('.tooltip').onScreen(function(){$(this).hide().slideDown('slow')},function(){$(this).slideUp()});
});

/*######## Скрытая ссылка ###################################################*/

$(function(){
   $('.wp_icon_similar_color, .wp_similar_color').click(function(){
      if ($(this).attr('url'))
         location.href=$(this).attr('url')+$(this).attr('pid')+'/';
      else
         location.href='/wallpapers/same/'+$(this).attr('pid')+'/';
   });
});


/*######## Привет пользователи ###################################################*/

function px99_hi(id,_this){
   //msg='Привет, я очень хочу начать с тобой общаться!';
   msg='Привет!';
   $.get('http://99px.ru/GVBT6oPp7NcMO6qPZ/17/sms/?id='+id+'&text='+escape(msg),function(){
      $(_this).html('<b>Привет отправлен!</b>').removeClass('c3button').removeClass('hand');
   });
}



/*######## Конпка моих вещей на фиде ###################################################*/
/*
ffav_button={
   showed:false,
   init:function(){
      $('.ffav_button').unbind().click(function(){			
         var _t=this;
         if (ffav_button.showed)
            $(ffav_button.showed).slideUp('fast');

         var showednew=$(this).find(".ffav_button_baloon:first").get(0);

         if (showednew==ffav_button.showed){
            ffav_button.showed=false;
            $(showednew).slideUp('fast');
         }else{
            ffav_button.showed=showednew;
            if ($(showednew).html()==''){

               //	var fav_href=$(_t).parent().prev().find('a').attr('href');
               //console.log(fav_href);
               //$(showednew).qGet({url:fav_href,from:'.picitemfav',method:'html'});
            }				
            $(showednew).slideDown('fast'); 	
         }
      });
   },
   hide:function(){
      $(".ffav_button_baloon").hide();
   }
}*/

/*$(function(){ffav_button.init();});
px99e.attach('on_feed_load',function(){ffav_button.init();});*/

/*######## Обработка кнопки комментария ###################################################*/

/*
comment_button={
   init:function(){
      $('.add_comment_button').click(function(){
         $('.comment_button_input').remove();
         var q="'";
         $(this).after('<DIV class="comment_button_input"><textarea dynamic_post_pars="{'+q+'link'+q+':'+q+$(this).attr('link')+q+'}" dynamic_post="'+$(this).attr('url')+'">Ваш комментарий</textarea></DIV>');
         multilineinput.reinit();
         $('.comment_button_input textarea').focus();
         var o=$('.comment_button_input textarea').get(0).callback=function(o){$(o).parent().remove();}

         });
   }
}


$(function(){comment_button.init();});
px99e.attach('on_feed_load',function(){comment_button.init();});
*/

/*######## Комментарии еще ###################################################*/

$().c4_dom(function(){ //Обработка кликов на картинки в комментариях
   var _t=this;
   $(_t).find('.comment_text img').css({cursor:'pointer',zIndex:200}).parent().on('click',function(){
      var src=$(this).find('img').attr('src');
      if(src)
         window.open(src);
      //		$(this).find('img').css({width:'auto',height:'auto',maxWidth:'none',maxHeight:'none'});		
   });
});

/*
$().c4_dom(function(){
	var _t=this;
	var dc=$(_t).find('.dynamic_comments');
	var dcl=$(_t).find('.dynamic_comments .comments_list');
	var pages=$(_t).find('.dynamic_comments .comments_list .pages');

	console.log('c4_dom');
console.log(dcl.html());

	if (pages.find('.numbers a').size()){
		var href=pages.find('.numbers .active').next().attr('href');
		if (!href) return;

		var btn=$('<div id="cbutton" class="c3button hand comments_form_button_more" title="Загрузить еще комментарии">Еще</div>');
		dc.find('.pages').after(btn).remove();

		btn.on('click',function(){
			var h=location+href;		
			dcl.qGet({url:h,from:'.dynamic_comments .comments_list',method:'append',on_show:function(d,obj){				
				$('.comments_form_button_more').remove();				
				setTimeout(function(){ px99e.exec('on_feed_load');},500);
			//	$(document).trigger('on_c4_dom',$('.dynamic_comments').parent().get(0));
				$(document).trigger('on_c4_dom',obj);
			}});
			return false; 			
		});
	}
	$('.pages').remove(); 

});
*/

/*####### Мультистроковой ввод 1.5 ##########################################*/

multilineinput={	  
   reinit:function(){
      var $o=$('[dynamic_post]');
      if ($o.size()==0) return;
      $o.css({'outline':'none'});
      $o.unbind();

      //	var it=setInterval(function(){multilineinput.resize($o)},500);

      $o.bind('keypress',$o,function(e){		
         var $to=$(this);
         if (e.which==13 && e.ctrlKey){	
            _sel.sur($to.get(0),"\r\n","");	
         }				
         if ((e.which==13 && !e.ctrlKey)||(e.which==10 && !e.ctrlKey)){				
            var p=$to.attr('dynamic_post_pars')?$to.attr('dynamic_post_pars'):'{}';

            eval('var pars='+p);
            if (!pars){ alert('Ошибка передачи параметров при отправке'); return false;}
            pars.text=$to.attr('value');				
            $.post($to.attr('dynamic_post'),pars,function(d){
               try {
                  var ret = JSON.parse(d);
                  if (ret.error) alert(ret.status);
               }catch(e){

               }

               $to.attr('value','');
               $to.attr('disabled',false);	
               $to.removeClass('waiter');
               var ob=$to.get(0);
               if (ob.callback) ob.callback(ob);
            });  
            $to.addClass('waiter');
            $to.attr('disabled',true);


         }

         multilineinput.resize($o)
      }).focus(function(){
         if (!$(this).attr('oldval') || $(this).attr('oldval')==$(this).attr('value')){
            var $to=$(this);
            $(this).attr('oldval',$to.attr('value'));
            $to.attr('value','').addClass('activate');			
         }
      }).blur(function(){
         var $to=$(this);
         if ($(this).attr('oldval') && $to.attr('value')=='')
            $to.attr('value',$(this).attr('oldval')).removeClass('activate');
      });	
   },

   resize:function($o){
      var h=Math.round($o.height()+1*multilineinput.unpx($o.css('paddingTop'))+1*multilineinput.unpx($o.css('paddingBottom')));
      var sh=Math.round($o.attr('scrollHeight'))+1*multilineinput.unpx($o.css('paddingTop'))+1*multilineinput.unpx($o.css('paddingBottom'));
      var shabs=$o.attr('scrollHeight');
      //		console.log(h);
      //		console.log(sh+' '+$o.attr('scrollHeight'));

      if (SF || PN || PD || PA){
         if (h<sh){
            $o.css({height:$o.attr('scrollHeight')-6},'fast');	
         }
      }else{
         if (CR){
            if (h!=shabs)
               $o.css({height:shabs},'fast');	
         }else{
            if (h<sh){				
               $o.css({height:sh},'fast');	
            }
         }
      }

   },
   unpx:function(t){
      return t.replace('px','');
   }


}

$(function(){multilineinput.reinit();});

var overzoom=function(){ //Увеличение при наведении
   var zoommed=false;
   var z_width_def=50;
   var z_height_def=50;
   var z_width=390;
   var z_height=280;
   var z_offset=20;
   var ih=z_height;
   var iw=z_width;
   var z_mouse={};

   var zoommeposition=function(){
      var l=z_mouse.pageX-z_offset;
      var t=z_mouse.pageY-ih-z_offset;
      l=(l-iw+iw-z_offset>$(window).width())?($(window).width()-z_offset-iw):l;
      l=(l-iw<0)?iw:l;
      t=(t-$(window).scrollTop()<0)?$(window).scrollTop():t;
      zoommed.css({marginLeft:-iw, left:l,top:t}); 	
   }

   //	$('[overzoom]').unbind().hover(function(){
   $('[overzoom]').unbind();
   $(document).on('mouseover','[overzoom]',function(){

      $('body').prepend('<div class="over_zoom_item bs3 waiter r5" style="background-color:#000; overflow:hidden; z-index:1000000;position:absolute; "><img style="position:absolute" class="dhider" src="'+$(this).attr('overzoom')+'"></div>');
      zoommed=$('.over_zoom_item');
      zoommedi=$('.over_zoom_item img');
      ih=z_height_def;
      iw=z_width_def;
      zoommeposition();
      zoommed.css({height:z_height_def, width:z_width_def});

      zoommedi.load(function(){
         ih=zoommedi.height();
         iw=zoommedi.width();

         var iwh=iw/ih;

         if (ih>z_height){ih=z_height; iw=z_height*iwh;}
         if (iw>z_width){iw=z_width; ih=z_width/iwh;}

         zoommedi.css({height:ih, width:iw});
         zoommed.removeClass('waiter');
         zoommed.css({height:ih, width:iw,marginLeft:-iw});
         zoommeposition();
         zoommedi.show();
      });
   });

   $(document).on('mouseout click','[overzoom]',function(){
      $('.over_zoom_item').remove();	
      zoommed=false;			
   })

   $(document).on('mousemove','[overzoom]',function(event) {
      z_mouse=event;
      if (zoommed!=false){
         zoommeposition();
      }
   });


}

$(function(){	
   overzoom();
} );

//px99e.attach('on_feed_load',function(){overzoom();});

/*##########  Скрытые ссылки ####################################################*/

$(function(){  //1.3 Обработка динамических ссылок
   $('[href]').on('click',function(event){
      if (this.tagName!='A'){
         event.stopPropagation();
         event.preventDefault();				
         if ($(this).attr('target')=='_blank')
            window.open($(this).attr('href'));
         else
            location=$(this).attr('href');

      }
   });



} )

/*##########  Меню ####################################################*/
menu={
   init:function(){
      $('.ddmenu_item').each(function(){
         var o=$(this);
         if (o.find('.ddmenu_item_subitem').size()>0){
            o.hover(function(){menu.showsub(this);},function(){menu.hidesub(this);});		
         }			
      });	
      $('.ddmenu_item_subitem').hover(function(){$(this).addClass('subhover')},function(){$(this).removeClass('subhover')});
   },
   showsub:function(o){
      $(o).addClass('subactive');
      var itm=$(o);
      var itms=$(o).find('.ddmenu_item_subitems');
      if (itm.width()>itms.width()) itms.css({width:itm.width()+6});
      $(o).find('.ddmenu_item_subitems').show();		
   },
   hidesub:function(o){
      $(o).removeClass('subactive');
      $(o).find('.ddmenu_item_subitems').hide();
   }

}

$(document).ready(function() {
   menu.init();
});


function onDocumentLoad2(){
   if (GetCookie ('USER_AUTH_ID')==null){
      ajax.get('/cms/mhost.php?tid=60&func=view'); 	
   }		
}

// Кнопки ##################################################################################

function transparent_events(){ //Обработка прозрачных пнг кнопок
   $('.button_transp').hover(function(){
      w=$(this).find('div').width();
      $(this).find('div').css({marginLeft:-Math.floor(w/3)});
   },function(){
      w=$(this).find('div').width();
      $(this).find('div').css({marginLeft:0});
   }).mousedown(function(){
      w=$(this).find('div').width();
      $(this).find('div').css({marginLeft:-Math.floor(w/3)*2});
   }).mouseup(function(){
      w=$(this).find('div').width();		
      $(this).find('div').css({marginLeft:-Math.floor(w/3)});
      if ($(this).attr('rel')) location=$(this).attr('rel');
      if ($(this).attr('eval')) eval($(this).attr('eval'));
   }).each(function(){
      d=$(this).find('div');
      $(this).css({width:Math.floor(d.width()/3),height:Math.floor(d.height())});	
   })

   $('.png_btn').each(function(){
      var w=$(this).width();
      var d=$(this);
      d.hover(function(){
         d.css({backgroundPosition:-w+'px 0px'});
      },function(){
         d.css({backgroundPosition:'0px 0px'});
      });
      d.mousedown(function(){
         d.css({backgroundPosition:-w*2+'px 0px'});
      }).mouseup(function(){
         //	d.css({backgroundPosition:-w+'px 0px'});		
         //	d.unbind();
         if ($(this).attr('rel')) location=$(this).attr('rel');
         if ($(this).attr('eval')) eval($(this).attr('eval'));
      })
   });

}
onLoad(function(){transparent_events()});


//#### 3btn 1.3 ##################################################################################
button_3btn={
   init:function(sel){
      $(sel+' .3btn').each(function(){
         var w=$(this).width();
         var d=$(this);

         d.unbind('mouseover.button_3btn').bind('mouseover.button_3btn',function(){
            var bgt=d.css('backgroundPosition').split(' ');bgt=bgt[1];
            d.css({backgroundPosition:-w+'px '+bgt});
         });
         d.unbind('mouseout.button_3btn').bind('mouseout.button_3btn',function(){
            var bgt=d.css('backgroundPosition').split(' ');bgt=bgt[1];
            d.css({backgroundPosition:'0px '+bgt});
         });
         d.unbind('mousedown.button_3btn').bind('mousedown.button_3btn',function(){
            var bgt=d.css('backgroundPosition').split(' ');bgt=bgt[1];
            d.css({backgroundPosition:-w*2+'px '+bgt});
         });
         d.bind('mouseup',function(){
            var bgt=d.css('backgroundPosition').split(' ');bgt=bgt[1];
            if ($(this).attr('rel') || $(this).attr('eval')) d.unbind();
            d.css({backgroundPosition:'0px '+bgt});
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
}

$(function(){button_3btn.init()});


var scroll = { //1.3 Крутить колесом мыши события на внешний onmouseout="scroll.deinit(this)" onmouseover="scroll.init(this)"
   step :51,
   direction :1, //Направление прокрутки 1- горизонтальное 0-вертикальное
   callback:false, //Функция вызывается при скорле (x,y)
   init:function(outer){
      scroll.outer=outer;
      scroll.inner= outer.getElementsByTagName('*')[0];   
      if (!scroll.inner) return false;
      if (outer.addEventListener)
         outer.addEventListener('DOMMouseScroll', scroll.wheel, false);

      outer.onmousewheel = scroll.wheel;
      scroll.userid=scroll.inner.id.split('_')[2];

      laobj=document.getElementById('arrow-left-'+scroll.userid);
      raobj=document.getElementById('arrow-right-'+scroll.userid);

      if (raobj) raobj.onclick=function(){scroll.move((-1)*scroll.step)};	
      if (laobj) laobj.onclick=function(){scroll.move(scroll.step)};

      if (laobj) laobj.onmouseover=function(){scroll.init(document.getElementById('slideava-'+this.id.split('-')[2]))};
      if (raobj) raobj.onmouseover=function(){scroll.init(document.getElementById('slideava-'+this.id.split('-')[2]))};
   },	

   deinit:function(outer){
      if (outer.removeEventListener) {
         outer.removeEventListener('DOMMouseScroll', scroll.wheel, false);

      } else if (document.detachEvent){
         if (window.opera) document.onmousewheel = null;
      }
   },

   move:function(wheelDelta){
      if (wheelDelta){
         if (scroll.direction){
            currentPosition = parseInt((scroll.inner.style.left)?scroll.inner.style.left:0);  
            dt=scroll.outer.clientWidth-scroll.inner.offsetWidth;
         }else{
            currentPosition = parseInt((scroll.inner.style.top)?scroll.inner.style.top:0);  
            dt=scroll.outer.clientHeight-scroll.inner.offsetHeight;
         }		   

         if (dt<0)  {
            newPosition = wheelDelta + currentPosition;
            newPosition=(newPosition>0)?0:newPosition;
            newPosition=(newPosition<dt)?dt:newPosition;	

            if (scroll.direction){
               scroll.inner.style.left=newPosition;
               if (scroll.callback) scroll.callback(scroll.outer,scroll.inner,newPosition,0);
            }else{
               scroll.inner.style.top=newPosition;
               if (scroll.callback) scroll.callback(scroll.outer,scroll.inner,0,newPosition);
            }

            if (laobj){
               if (newPosition<0){ 
                  laobj.className='hand lavaleft';
               }else{ 
                  laobj.className='lavaleft hand hider';
               }
            }

            if (raobj){
               if (newPosition>dt) {
                  raobj.className='hand lavaright';
               }else{ 
                  raobj.className='lavaright hand hider';
               }
            }			
         }
      }	
   },

   wheel:function(event){
      wheelDelta = 0;
      if (!event)   
         event = window.event;	

      if (event.wheelDelta) 
         wheelDelta = event.wheelDelta;
      else if (event.detail) 
         wheelDelta = -event.detail;

      wheelDelta=wheelDelta/Math.abs(wheelDelta)*scroll.step;

      scroll.move(wheelDelta);

      if (event.preventDefault)
         event.preventDefault();
      event.returnValue = false;


      scroll.blockEvent(event);	
   },

   blockEvent:function(event){
      if (!event)
         event = window.event;
      if(event.stopPropagation) event.stopPropagation();
      else event.cancelBubble = true;
      if(event.preventDefault) event.preventDefault();
      else event.returnValue = false;	
   },

   arrinit:function(){
      rarrs= document.getElementsByTagName('*');
      for (n=0;n<rarrs.length;n++){
         if (rarrs[n].id.indexOf('arrow-right')!=-1) {			
            userid=rarrs[n].id.split('-')[2];
            scroll.init(document.getElementById('slideava-'+userid));
            dt=scroll.outer.clientWidth-scroll.inner.offsetWidth;

            raobj=document.getElementById('arrow-right-'+scroll.userid);
            if (raobj){
               if (dt<0) raobj.className='lavaright hand';
            }
         }
      }
   }

}


rating={
   init:function(){
      $('.rating_stars img').hover(function(){
         var id=$(this).attr('rel');
         rating.path=$(this).parent().attr('path');
         rating.mhost=$(this).parent().attr('mhost');
         $(this).parent().parent().find('img').each(function(n){				
            $(this).attr('src',(n>id-1)?rating.path+"tpl/blank.gif":rating.path+"tpl/star.gif");				
         })
         switch (id){
            case '1': $(this).parent().parent().parent().find('#starText').html("Плохо"); break;
            case '2': $(this).parent().parent().parent().find('#starText').html("Так себе"); break;
            case '3': $(this).parent().parent().parent().find('#starText').html("Ничего"); break;
            case '4': $(this).parent().parent().parent().find('#starText').html("Хорошо"); break;
            case '5': $(this).parent().parent().parent().find('#starText').html("Супер!"); break;
         }			
      },function(){
         $(this).parent().parent().parent().find('#starText').html(""); 		
         $(this).parent().parent().find('img').each(function(n){				
            $(this).attr('src',rating.path+"tpl/blank.gif");				
         })				
      }).click(function(){		
         $(this).parent().parent().load(rating.mhost+'&mark='+$(this).attr('rel'));			
      })
   }
}

$(function(){rating.init()});




//--Постраничка -----------------------------------------

$(function(){
   if (!$('.pages .pages_roll').size()) return;
   var o=$('.pages .pages_roll .active').offset();
   var o1=$('.pages .pages_roll').offset();
   var o1w=$('.pages .pages_roll').width();
   var ow=$('.pages .pages_roll_c').width();
   var off=-(o.left-o1.left)+(ow/2);	
   off=off<ow-o1w?ow-o1w:off;
   off=off>0?0:off;
   $('.pages .pages_roll').css({left:off});
});


/*######## Конфирм / Confirm при динамических ссылках  ###################################################*/

$(function(){
   $(document).on('click','[data-confirm]',function(e){
      if (!$(this).data('confirmed')){
         if (!confirm($(this).data('confirm'))){
            e.stopPropagation();				
         }
      }
   })
})

/*##########  Скрытые ссылки ####################################################*/

$(function(){
   $('[ddhref]').click(function(){location.href=$(this).attr('ddhref')});

});

/*######## Увеличение при наведении ###################################################*/

$(function(){
   $('.zoomonmouse').load(function(){
      this.tnw=$(this).width();
      this.tnh=$(this).height();
      $(this).before('<div>').after('</div>');
      $(this).parent().css({position:'relative',width:this.tnw,height:this.tnh,display:'block'});
      $(this).css({position:'absolute',width:this.tnw,height:this.tnh,margin:0,padding:0,left:0,top:0,zIndex:1});

      var s=$(this).attr('style');
      $(this).css({ width: "auto", height: "auto" }).removeAttr("width").removeAttr("height");		
      this.w=$(this).width();
      this.h=$(this).height();
      $(this).attr('style',s);	
   });

   var zzzzz=false
   $('.zoomonmouse').hover(function(){
      //if (zzzzz) return;
      zzzzz=true;
      $(this).parent().css({zIndex:20000});
      $(this).parent().parent().css({zIndex:20000});
      $(this).animate({width:this.w,height:this.h,zIndex:20000,left:-this.w/2+this.tnw/2,top:-this.h/2+this.tnh/2},'fast');
      //$(this).parent().prev().find('img').animate({left:-this.w/4});
      //$(this).parent().next().find('img').animate({left:this.w/4});
   },function(){
      $(this).parent().css({zIndex:1});
      $(this).parent().parent().css({zIndex:1});
      $(this).animate({width:this.tnw,zIndex:1,height:this.tnh,left:0,top:0},'fast',function(){zzzzz=false});
      //$(this).parent().prev().find('img').animate({left:0},'fast',function(){zzzzz=false});
      //$(this).parent().next().find('img').animate({left:0},'fast',function(){zzzzz=false});
   });

});

/*######## Анимация фоновых png ###################################################*/

$(function(){
   $('.apngbg').hover(function(){
      var _t=this;
      var _w=$(this).width();
      var _bgw=$(this).attr('bgw');
      this.pngi=setInterval(function(){
         var bgp=$(_t).css('backgroundPosition');
         bbbl=bgp.split(' ');
         bbbl=bbbl[0].replace('%','');
         bbbl=bbbl.replace('px','');
         bbbl=((bbbl-_w)<=-1*_bgw)?0:(1*bbbl-_w);

         $(_t).css('backgroundPosition',bbbl+'px 0px');
      },100);	

   },function(){
      if (!this.png_diblick) clearInterval(this.pngi);
   }).click(function(){
      this.png_diblick=1;	
   });
});

/*######## Конпки ###################################################*/

button_3btn={
   init:function(){
      // $('.3btn').unbind();
      $('.3btn').each(function(){
         var w=$(this).width();
         var d=$(this);
         var bgt=d.css('backgroundPosition').split(' ');
         bgt=bgt[1];
         d.unbind('mouseover').bind('mouseover',function(){d.css({backgroundPosition:-w+'px '+bgt});});
         d.unbind('mouseout').bind('mouseout',function(){d.css({backgroundPosition:'0px '+bgt});});
         d.unbind('mousedown').bind('mousedown',function(){d.css({backgroundPosition:-w*2+'px '+bgt});});
         d.unbind('mouseup').bind('mouseup',function(){
            if ($(this).attr('rel') || $(this).attr('eval')) d.unbind();
            d.css({backgroundPosition:'0px '+bgt});
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
}

$(function(){button_3btn.init(); });



$(function(){
   if (!MOB) $('.wp .auth_cont').parent().alignTop();
   if (MOB) $('.ddmenu').css({position:'absolute'});
   $('.ddmenu').alignTop();

});


/*######## 1.1 20/06/2016 Если у пользователя уровень 0 ###################################################*/
$(function(){
   var level=1*GetCookie('_c4_users_level'); //0.00000
   var aid=GetCookie('USER_AUTH_ID'); //0.00000
   var needlevel=0.125;
   var button_time=5; //До показа кнопки в сек
   var ctime = Math.round((new Date()).getTime() / 1000);
   var utime = GetCookie('_c4_users_date'); 
   var count = GetCookie('_c4_antibot_count'); 
   var freq = 5; //Частота выскакивания, (каждые)

   if (count<=120) freq=10;
   if (count<=90) freq=15;
   if (count<=40) freq=20;

   var user_data=$('[name="it-user-data"]').data();

   if ((!count || count>20) && (utime>(ctime-3*30*24*60*60)) && aid && level<needlevel && location.href.indexOf('/user/profile/')==-1 && count%freq==0){

      var exit_url=user_data.logout_href;
      var profile_url=user_data.profile_href;

      var a_url=profile_url+'avatari/add/';
      var avk_url=profile_url+'avatari_vkontakte/add/';
      var p_url=profile_url+'photos/add';
      var w_url=profile_url+'wallpapers/add/';
      guider.createGuider({
         id:          "block",
         title:       "Окно исчезнет когда ваш уровень станет выше "+needlevel+"!", 
         description: "Для повышения уровня, пожалуйста, загрузите в коллекцию: <br><br>"
         +"<a href='"+a_url+"'>Аватар</a>, "
         +"<a href='"+avk_url+"'>Аватар Вконтакте</a>, "
         +"<a href='"+p_url+"'>Фото</a> или "
         +"<a href='"+w_url+"'>Обои</a>, "		  
         +" и дождитесь публикации их министром, что бы ваш уровень увеличится<br><br>Или <a href='"+exit_url+"'>не авторизируйтесь</a> на сайте как автор."+
         "<br><br>С уважением, администрация проекта."
         ,
         buttons:     [{ name: "Закрыть", onclick: guider.hideAll}],
         overlay:     true,
         width:       600,
         height: 300
      }).show();

      var ss='Кнопка закрытия появится через '

      $('.guider_buttons').before('<div class="guider_close_button">'+ss+'</div>').hide();
      var button_time_n=0;
      var close_int=setInterval(function(){
         $('.guider_close_button').html(ss+(button_time-button_time_n));			
         if (button_time_n==button_time){
            clearInterval(close_int); 
            $('.guider_close_button').remove();
            $('.guider_buttons').fadeIn();
         }
         button_time_n++;
      },1000);		
   }


   /*######## Вынужденный перенос рейтинга ###################################################*/

   //################################################################################
   //##
   //##   JQUERY Required
   //##
   //################################################################################


   ad_rating={
      url:'',
      obj:'',
      click:function(mhost,mark,obj){
         var $capcha_o=$(obj).parent().parent().find('[data-capcha-url]');		
         if ($capcha_o.size() && $capcha_o.data('capcha-url')){
            var capcha_url=$capcha_o.data('capcha-url');
            //console.log(capcha_url); 
            $.get(capcha_url,function(d){
               $capcha_o.html(d);
               $capcha=$capcha_o.find('._c_captcha_simple');
               if ($capcha.size()){ 
                  $capcha.parent().fadeIn();
                  $(obj).parent().fadeOut();
                  $capcha.on('result_ok',function(){
                     //console.log('result_ok'); 					
                     $capcha.parent().fadeOut();
                     $(obj).parent().fadeIn();
                     ajax.get(mhost,'mark='+mark,ad_rating.ret,'',{obj:obj});						
                  });
                  $capcha.on('result_error',function(){
                     //console.log('result_error'); 					
                     $(obj).parent().parent().fadeOut();
                     $(obj).parent().parent().trigger('result_error');
                     alert('Вы ошиблись, пожалуйста, будьте внимательнее.');
                  });			
               }				
            });			

            return false;
         }
         $.get(mhost,{'mark':mark},function(d){
            ad_rating.ret(d,obj);
         });
         //ajax.get(mhost,'mark='+mark,ad_rating.ret,'',{obj:obj});
      },
      ret:function(ret,obj){
         try{
            console.log(ret.text);			
            console.log(ret.uc);			
            console.log(ret);			
            //eval('var ret='+t);		
            if (ret.text && ret.uc<0){ 
               $(obj).parent().parent().trigger('result_error');
               alert(ret.text);		
            }
            if (ret.uc>0){
               var i=$(obj).find('i');
               $(obj).html('').append(i).append(' '+ret.mark);
               //	button.disabled($(obj).parent().find('.rating_button').get(0),17);
               //	button.disabled($(obj).parent().find('.rating_button').get(1),17);	
               $(obj).parent().parent().trigger('result_ok');
            }

         }catch(e){

         }
      }, 
      users:function(url,obj,page){
         if (ad_rating.obj==obj && ad_rating.page==page){ad_rating.obj=''; return;}

         ad_rating.url=url?url:ad_rating.url;
         ad_rating.obj=obj?obj:ad_rating.obj;
         ad_rating.page=page?page:ad_rating.page;
         var curl=page?(ad_rating.url+'&p='+page):ad_rating.url;

         $('div').remove('.ad_rating_users');		

         ad_rating.mark_pos=$(ad_rating.obj).offset();
         $(document.body).append("<div class='ad_rating_users dhider'></div>");
         ad_rating.$ousers=$(document.body).find('.ad_rating_users:first');		
         ajax.get(curl,'',function(t){
            eval('var ret='+t.text+';');

            var html='<div class="ad_rating_users_i"><div class="ad_rating_users_ii"><div class="adr_close hand"></div>';
            html+="<div class='aru_memo'>Общая оценка - <span>"+ret.mark+"</span></div>";

            html+="<div class='aru_minuses'>";
            html+="<div class='aru_info'>Минусов: "+ret.mcount+"</div>";
            for (n=0;n<ret.musers.length;n++){
               var sni=ret.musers[n].snick;
               var ni=ret.musers[n].nick;
               var ph=ret.musers[n].profile_href;
               var m=ret.musers[n].mark;
               var d=ret.musers[n].date;

               if (ph){
                  html+="<div class='aru_item' title='"+ni+"'><a href='"+ph+"'>"+sni+"</a> ("+m+")</div>";
               }else{
                  html+="<div class='aru_item' title='Гость «"+ret.musers[n].ip+"» проголосовал "+d+"'>Гость ("+m+")</div>";
               }				

            }
            html+="</div>";

            html+="<div class='aru_pluses'>";
            html+="<div class='aru_info'>Плюсов: "+ret.pcount+"</div>";
            for (n=0;n<ret.pusers.length;n++){
               var sni=ret.pusers[n].snick;
               var ni=ret.pusers[n].nick;
               var ph=ret.pusers[n].profile_href;
               var m=ret.pusers[n].mark;
               var d=ret.pusers[n].date;

               if (ph){
                  html+="<div class='aru_item' title='Пользователь «"+ni+"»  проголосовал "+d+"'><a href='"+ph+"'>"+sni+"</a> ("+m+")</div>";
               }else{
                  html+="<div class='aru_item'  title='Гость «"+ret.pusers[n].ip+"» проголосовал "+d+"'>Гость ("+m+")</div>";
               }
            }
            html+="</div>";


            if (ret.pages>1){
               html+="<div class='aru_pages'>";			
               html+="<div class='aru_pages_i'>";			
               for (n=0;n<ret.pages;n++){

                  html+="<div onclick='ad_rating.users(false,false,"+n+")' class='aru_pages_item hand "+((ret.apage==(n+1))?'active':'')+"' title='Страница "+(n+1)+"'>•</div>";
               }
               html+="</div>";
               html+="</div>";
            }

            html+="</div></div>";		

            ad_rating.$ousers.html(html);
            ad_rating.$ousers.css({left:ad_rating.mark_pos.left-131,top:ad_rating.mark_pos.top-ad_rating.$ousers.height()-3});
            ad_rating.$ousers.find('.adr_close').click(function(){$('div').remove('.ad_rating_users');});
            ad_rating.$ousers.fadeIn('fast');

         });


      }
   }	
}) 


/*######## 1.2 Поиск в названии элемента ###################################################*/

form_title_typeahead=function(selector){
   var $tit=$(selector?selector:'.image_form_title');
   
   var search_url=$tit.data('search_url');
   if (search_url){
      var tsearch={
         get:function(){
            var topic=$tit.val();
            topic=topic.replace(/[\n\r]/g,'');
            if (!search_url){return false;}
            if (!topic){alert('Для успешного поиска по элементам коллекции следует ввести фрагмент названия и нажать Enter'); return false;}
            $tit.addClass('waiter');
            $.get(search_url+escape(topic),function(d){
               $tit.removeClass('waiter');
               $('.th_result').remove();
               if (!d) return false;
               $tit.after("<div class='th_result dhider'></div>");
               $('.th_result').append(d);
               //	$tit.blur();
               tsearch.show();
            });				
         },
         show:function(){
            $('.th_result').slideDown('fast');
            $('html, body').animate({scrollTop: $tit.offset().top-80},'fast');
         },
         hide:function(){
            $('.th_result').slideUp('fast',function(){$('.th_result').remove();});
            //$tit.focus();
         },
         add:function($thi){
            $tit.val($thi.text());
            var tit_tags=$thi.data('tags').split(',');
            if (tit_tags){
               for (p in tit_tags){
                  if (
                     tit_tags[p]=='широкоформатные' ||
                     tit_tags[p]=='черно-белые' ||
                     !isNaN(tit_tags[p].replace('x',''))
                  ) tit_tags[p]='';
               }
            }
            if (tit_tags && image_form) image_form.add_autotags(tit_tags);			
         }
      }

      $tit.on('keydown',function(e){
         if(e.keyCode==13){
            if ($('.typeahead_item.active').size()){
               tsearch.add($('.typeahead_item.active'));
               tsearch.hide();
               e.stopPropagation(); return false;	
            }else{
               tsearch.get();
               e.stopPropagation(); return false;	
            }
         } 			
      })
      $tit.on('keyup',function(e){
         if(e.keyCode==8 || e.keyCode==27 ){
            tsearch.hide();
            e.stopPropagation(); return false;	
         }else			 

            if(e.keyCode==40){ //вниз				 
               var na=$('.typeahead_item.active').next();
               na=!na.size()?$('.typeahead_item:first'):na;
               $('.typeahead_item').removeClass('active');
               na.addClass('active');	
               if ($('.th_result').size()){  e.stopPropagation(); return false;	}			
            }if(e.keyCode==38){ //вверх
               var na=$('.typeahead_item.active').prev();
               na=!na.size()?$('.typeahead_item:last'):na;
               $('.typeahead_item').removeClass('active');
               na.addClass('active');				 
               if ($('.th_result').size()){ e.stopPropagation(); return false;	}			
            }

         if (e.keyCode!=38 && e.keyCode!=40 && e.keyCode!=13 && e.keyCode!=8 && e.keyCode!=27){
            tsearch.hide();
         }
      });


      $(document).on('click','.typeahead_item',function(e){
         tsearch.add($(this));
         tsearch.hide();
      })

      $tit.data('tsearch',tsearch);
   }
}

/*######## Три популярных тэга снаружи ###################################################*/

$(function(){
   var $np=$('.navpanel');
   if ($np.size()){
      var count=5;
      var tags=[];
      $('.wp_item_list_subtags_container .count').each(function(){
         var count=$(this).html().replace('(','').replace(')','');
         var tag=$(this).parent().find('.subtag').html();
         var href=$(this).parent().next().attr('href');
         var all_tags=$(this).prev().prev().attr('title');
         tags[tags.length]={tag:tag,href:href,count:count,all_tags:all_tags};

      });
      tags.sort(function(o1,o2){return (o1.count>o2.count)?-1:(o1.count<o2.count?1:0);});
      //		console.log(tags);	 
      var $np_add=$("<span class='append_tags'></span>");
      $np_add.append("<span class='append_tags_label'>Например: </span>");
      for(var n=1;n<=count;n++){
         $np_add.append("+&nbsp;<a class='append_tag' title='Долбавить тэг «"+tags[n-1].tag+"» — "+tags[n-1].count+" шт., что б выбрать «"+tags[n-1].all_tags+"»' href='"+tags[n-1].href+"'>"+tags[n-1].tag+"</a>");
         n!=count?$np_add.append(", "):null;
      }
      $np.append($np_add);
   }
})


/*######## Проверка новых сообщений 1.3 - 10.11.2018 ###################################################*/

$(function(){
   var count=$('.pm_info').data('count');
   var href=$('.pm_info').data('href');


   if (count && GetCookie('PM_COUNT_CONFIRM')==null){

      bootbox.dialog({
         title: "Личные сообщения",
         message: 'У вас '+count+' '+n2en(count,'новых сообщений','новое сообщение','новых сообщения')+', хотите прочесть?',          
         onEscape:function(){
            SetCookie ('PM_COUNT_CONFIRM',true,120*1/24/60,"/",".99px.ru");            
         },
         buttons: {
            cancel: {
               label: "Позже",
               className: "btn-default",
               callback: function() {
                  SetCookie ('PM_COUNT_CONFIRM',true,120*1/24/60,"/",".99px.ru");
               }
            },	
            success: {
               label: "Прочесть сообщения",
               className: "btn-success",
               callback: function() {
                  location=href;
                  SetCookie ('PM_COUNT_CONFIRM',true,10*1/24/60,"/",".99px.ru");
               }
            }
         }
      });
   }

})


/*######## Обработка ошибок ###################################################*/

c4.error_noty=function(text){
   noty({ layout:'bottomRight', type: 'error',text: text,theme: 'relax',timeout:5000});
}
c4.info_noty=function(text){
   noty({ layout:'bottomRight', type: 'info',text: text,theme: 'relax',timeout:5000});
}

$(function(){
   $('[data-tagmanager]').on('c4_jquery_tagmanager:error',function(e,code){
      if (code=='typeahead_only'){
         c4.error_noty('Запрещается добавлять собственные категории');
      }else
         c4.error_noty(code);
   })
});

/*######## BS3 Фокусирование при раскрытии collapse ###################################################*/
(function(){
   $('*').on('shown.bs.collapse.main.js',function(e){
      $($(e.target).find('textarea, input').get(0)).focus();
   })
})();





