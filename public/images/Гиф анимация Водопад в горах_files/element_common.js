


/*######## Сохранение 1.1 ###################################################*/
$(function(){

});


/*######## Кадрирование кроп обоев 1.1 ###################################################*/

$(function(){
   if (!$('.wp .element').size()) return;
   var $image = $('.element_data_wrapper ._content [itemprop="image"]');
   var $generate_sizes_container = $('[role="generated_sizes_container"]');
   var $download_button = $('[role="download_button"]');
   $download_button.data('default-html',$download_button.html());

   var image_width=parseInt($generate_sizes_container.data('image-width'));
   var image_height=parseInt($generate_sizes_container.data('image-height'));

   var screen_width = screen.width;
   var screen_height  = screen.height;

   $('#collapseDownload').parent().on('shown.bs.collapse',function(){

      $image.cropper({
         aspectRatio: 1,
         viewMode:1,
         background:false,
         scalable:false,
         zoomable:false,
         rotatable:false, 
         cropBoxResizable:false,
         autoCropArea:1,


      });
      $image.data('cropped',true);
      //$('._sidebar').css({marginTop:-200});

      $('[role="crop_sizes"]').change();

   }).on('hidden.bs.collapse',function(){
      $image.cropper('destroy'); 
      $image.data('cropped',false);
      $download_button.html($download_button.data('default-html'));
   });

   $(document).on('mouseup mousedown click','.cropper-drag-box',function(event){	

      $image.cropper('reset');

   });

   $(document).on('change','[role="crop_sizes"]',function(){
      $t=$(this).find("option:selected");
      var ar=$t.data('crop-size-width')/$t.data('crop-size-height');

      $download_button.find('span').text($t.data('crop-size-width')+'x'+$t.data('crop-size-height'));
      $download_button.data('crop-size-height',$t.data('crop-size-height'));
      $download_button.data('crop-size-width',$t.data('crop-size-width'));

      $image.cropper('setAspectRatio',ar);		
   })


   $(document).on('click','[role="download_button"]',function(e){
      if (!$image.data('cropped')) return;

      e.preventDefault();
      e.stopPropagation();

      var crop=$image.cropper('getData');
      var image=$image.cropper('getImageData');

      var url=$(this).attr('href');		

      var result_height=$(this).data('crop-size-height');
      var result_width=$(this).data('crop-size-width');

      var image_k=image.width/image.height; //Кофф исх картинки
      var crop_k=crop.width/crop.height; //Кофф кропа

      var ir={};

      ir.w=result_width;
      ir.h=result_height;
      if (image_k>=crop_k){ //Режим Х сдвига
         ir.x=Math.round(crop.x/image.naturalWidth*image_width);
         ir.y=0;			 

      }else{
         ir.x=0;
         ir.y=Math.round(crop.y/image.naturalHeight*image_height);
      }


      url=url+ir.w+'x'+ir.h+'x'+ir.x+'x'+ir.y;

      //			console.log(crop);			
      //console.log(image);			
      // 
      //console.log(url);		
      //return


      location=url;
   })




   var wallpaper_sizes=[
      {w:screen_width,h:screen_height,label:'Ваш монитор',force:true},
      {label:'-',force:true},
      {w:1920,h:1080},	{w:1680,h:1050},	{w:1600,h:900},		{w:1440,h:900},		{w:1366,h:768},		{w:1360,h:768},
      {w:1280,h:1024},	{w:1280,h:960},		{w:1280,h:800},		{w:1280,h:768},		{w:1280,h:720},		{w:1024,h:768},
      {w:1024,h:600},		{w:1152,h:864},		{w:800,h:600},		
      {label:'-',force:true},
      {w:320,h:480,label:'IPhone 2/3',force:true},	
      {w:640,h:960,label:'iPhone 4/4s',force:true}, 
      {w:640,h:1136,label:'iPhone 5/5s/5c',force:true},
      {w:750,h:1334,label:'iPhone 6/6s',force:true},		
      {w:1080,h:1920,label:'iPhone 6+/6s+',force:true}
   ];

   $sizes_selector=$('<select class="form-control" role="crop_sizes"></select>');



   for (n in wallpaper_sizes){
      var ws=wallpaper_sizes[n];
      if ((parseInt(ws.w)<image_width && parseInt(ws.h)<image_height) || (ws.force==true)){
         if (ws.label=='-')
            $sizes_selector.append('<option disabled></option>');
         else
            $sizes_selector.append('<option data-crop-size-height="'+ws.h+'" data-crop-size-width="'+ws.w+'">'+ws.w+'x'+ws.h+(ws.label?' — '+ws.label:'')+'</option>');
      }
   }
   $generate_sizes_container.append($sizes_selector);

});

/*######## Скачивание элемента ###################################################*/

$(function(){
   if (!$('.element_download').length) return;

   var user_authorised=GetCookie('USER_AUTH_ID');
   download_element_onload=false;
   download_element_onload_sta=false;

   $('.wpmaketext').html(IE?'Сделать фоновым рисунком':(OP?'Как изображение рабочего стола':'Сделать фоновым рисунком рабочего стола'))
   if (CR) $('.wpmaketext').html('Сохранить картинку как...');

   if (!user_authorised) $('.ifnotuser').fadeIn();

   var $o=$('.element_download ._downloaded_image');

   var zoom_toggle=function($o,ow){
      if (ow==$o.width()){
         $o.animate({width:'100%'},'fast');         
         //         if (!MOB) $("[role='sidebar']").show();
      }else{
         $o.animate({width:ow},'fast'); 
         //         if (!MOB) $("[role='sidebar']").hide();
      }
   }



   download_element_onload=function(){
      if (download_element_onload_sta) clearTimeout(download_element_onload_sta);
      setTimeout(function(){
         opw=$o.parent().width(); 	
         ow=$o.width(); 	
         $o.parent().find('div').fadeOut();
         $o.closest('.waiter').removeClass('waiter');
         $('._descr').fadeIn();
         if (opw<ow) $o.width('100%');
         $o.fadeIn('slow',function(){
            if (opw<ow){	
               $o.click(function(){
                  zoom_toggle($o,ow);
               });
               $("[role='zoom']").click(function(){
                  zoom_toggle($o,ow);
               });
            }else{
               $("[role='zoom']").addClass('disabled');
            }
         });	
      },user_authorised?0:4000);
   }

   $o.load(function(){download_element_onload();});
   download_element_onload_sta= setTimeout(function(){download_element_onload(this);},4000); //Страховка на загрузку из кеша


   if ($('.wpdwimg').width() || IE) download_element_onload($('.wpdwimg').get(0)); 	

});



//##### Предложения #######################################################



$(function(){ //1.5
   $('[data-offer-url]').on('click',function(event){
      event.stopPropagation();
      event.preventDefault();
      var data=$(this).data();
      var message=$($(this).data('offer-message')).html();
      if (data.offerCode=='3') //Удаление
         bootbox.dialog({
            title: 'Предлагаю удалить элемент',
            message: 
            '<div class="row"><div class="col-md-12"><form class="form-horizontal"><div class="form-group">'+
            '<label class="col-md-3 control-label" for="offer">Причина удаления?</label> '+
            '<div class="col-md-8">'+
            '<div class="radio"> <label for="offer0"> <input type="radio" name="offer" id="offer0" value="Низкое качество" checked="checked">Низкое качество</label> </div>'+
            '<div class="radio"> <label for="offer1"> <input type="radio" name="offer" id="offer1" value="Любительское фото" checked="checked">Любительское фото</label> </div>'+
            '<div class="radio"> <label for="offer5"> <input type="radio" name="offer" id="offer5" value="Искажение пропорций" checked="checked">Искажение пропорций человека</label> </div>'+
            '<div class="radio"> <label for="offer2"> <input type="radio" name="offer" id="offer2" value="Нарушение правил проекта" checked="checked">Нарушение правил проекта</label> </div>'+
            '<div class="radio"> <label for="offer3"> <input type="radio" name="offer" id="offer3" value="Адрес другого сайта" checked="checked">На изображении виден адрес другого сайта</label> </div>'+
            '<div class="radio"> <label for="offer4"> <input type="radio" name="offer" id="offer4" value="Другое" checked="checked">Другое</label> </div>'+
            '</div></div> '+ 
            '<div class="form-group"> 				'+
            '<label class="col-md-3 control-label" for="name">Адрес дубля</label> <div class="col-md-8"> '+
            '<input id="name" name="copy_url" type="text" placeholder="http://..." class="form-control input-md"> '+
            '<span class="help-block">Если эта работа уже была опубликована на проекте укажите пожалуйста адрес более ранней копии</span> '+
            '</div></div> '+
            '<div class="form-group"> '+
            '<label class="col-md-3 control-label" for="name">Своя причина</label> '+
            '<div class="col-md-8"> <input id="name" name="user_offer" type="text" placeholder="Своя причина" class="form-control input-md"> </div> '+
            '</div>'+
            '</form> '+
            '</div></div>'
            ,
            buttons: {
               cancel: {label: 'Отмена',className: "btn-default"},	
               success: {label:'Отправить предложение',className: "btn-success",callback: function(e) {
                  var form=$('.modal-dialog form').serialize();
                  $.get(data.offerUrl,form,function(d){
                     if (typeof d =='object' && d.result && d.result=='error'){
                        c4.info_noty('Ощиюка #'+d.code+' при отаравке предложения');
                     }else{                        
                        c4.info_noty('Предложение успешно отправлено, спасибо за помощь!');
                     }
                  });			 
               }
                        }, 
            }
         });	

      if (data.offerCode=='0'){ //Название
         var d=bootbox.dialog({
            title: 'Предлагаю изменить название',
            message: 
            '<div class="row"><div class="col-md-12"><form class="form-horizontal"><div class="form-group">'+
            '<label class="col-md-3 control-label" for="offer">Название</label> '+
            '<div class="col-md-8"><textarea autofocus id="name" name="user_offer" type="text" placeholder="Название" class="form-control input-md">'+data.offerDefault+'</textarea></div>'+
            '</div>'+
            '</form> '+
            '</div></div>'
            ,
            buttons: {
               cancel: {label: 'Отмена',className: "btn-default"},	
               success: {label:'Отправить предложение',className: "btn-success",callback: function(e) {
                  var form=$('.modal-dialog form').serialize();
                  $.get(data.offerUrl,form,function(d){
                     if (typeof d =='object' && d.result && d.result=='error'){
                        c4.info_noty('Ощиюка #'+d.code+' при отаравке предложения');
                     }else{                        
                        c4.info_noty('Предложение успешно отправлено, спасибо за помощь!');
                     }
                  });			 
               }
                        }, 
            }
         });	  
         d.on('shown.bs.modal', function () {
            $('.modal-dialog [name="user_offer"]').focus(); 
         })
      }
      if (data.offerCode=='1'){ //Тэги
         bootbox.dialog({
            title: 'Предлагаю изменить тэги',
            message: 
            '<div class="row offer-modal"><div class="col-md-12"><form class="form-horizontal"><div class="form-group">'+
            '<label class="col-md-3 control-label" for="offer">Тэги</label> '+
            '<div class="col-md-8">'+
            '<input autofocus type="text"'+
            'name="tags" '+
            'data-tagmanager '+
            'data-tm-typeahead="'+data.offerTagsUrl+'"  '+
            'data-tm-cache_url="'+data.offerTagsUrl+'"  '+
            'data-tm-maxtags="100" '+
            'placeholder="Новый тэг" '+
            'data-tm-prefilled="'+data.offerDefault+'" >'+

            '</div>'+
            '</div>'+
            '</form> '+
            '</div></div>'
            ,
            buttons: {
               cancel: {label: 'Отмена',className: "btn-default"},	
               success: {label:'Отправить предложение',className: "btn-success",callback: function(e) {
                  var form=$('.modal-dialog form').serialize();
                  $.get(data.offerUrl,form,function(d){
                     if (typeof d =='object' && d.result && d.result=='error'){
                        c4.info_noty('Ощиюка #'+d.code+' при отаравке предложения');
                     }else{                        
                        c4.info_noty('Предложение успешно отправлено, спасибо за помощь!');
                     }
                  });			 
               }
                        }, 
            }
         }).on("shown.bs.modal", function(e) { 		
            $(this).c4_dom().find('[autofocus]').focus(); 
         });	
      }
      if (data.offerCode=='2'){ //Загрузить
         bootbox.dialog({
            title: 'Загрузить лучшего качества',
            message: 
            '<div class="row offer-modal"><div class="col-md-12"><form method="post" enctype="multipart/form-data" action="'+data.offerUrl+'" target="upload_target_item" class="form-horizontal"><div class="form-group">'+
            '<label class="col-md-3 control-label" for="offer">Файл изображения (gif, png, jpg)</label> '+
            '<div class="col-md-8">'+
            '<input name="dd_file" onchange="$(this).closest(\'form\').submit().addClass(\'waiter\')" type="file" />'+
            '<p class="help-block">Пожалуйста загружайте изображения только допустимого в данном разделе типа, загрузка начнется автоматически после выбора файла.</p>'+
            '</div>'+
            '</div>'+
            '</form> '+
            '<iframe name="upload_target_item" class="hide" id="upload_target_item" ></iframe>'+ 
            '</div></div>'				 
         }).on("shown.bs.modal", function(e) { 		
            var _t=this;
            $(this).c4_dom().find('[autofocus]').focus(); 
            $(window).on('offer_file_loaded',function(e,d){
               // console.log(e);
               //console.log(d);
               if (d.code=="0"){
                  $(window).off('offer_file_loaded');
                  $(_t).modal('hide');
                  c4.info_noty('Предложение успешно отправлено, спасибо за помощь!');
               }else{
                  c4.info_noty(d.error);
               }
            });
         });	
      }
      if (data.offerCode=='4'){ //Отправить в ПН
         bootbox.dialog({
            title: 'Предлагаю отправить в помогите назвать',
            message: 
            '<div class="row"><div class="col-md-12"><form class="form-horizontal"><div class="form-group">'+
            '<label class="col-md-3 control-label" for="offer">Причина</label> '+
            '<div class="col-md-8"><textarea autofocus id="name" name="user_offer" type="text" placeholder="Почему вы считаете что это необходимо сделать?" class="form-control input-md"></textarea></div>'+
            '</div>'+
            '</form> '+
            '</div></div>'
            ,
            buttons: {
               cancel: {label: 'Отмена',className: "btn-default"},	
               success: {label:'Отправить предложение',className: "btn-success",callback: function(e) {
                  var form=$('.modal-dialog form').serialize();
                  $.get(data.offerUrl,form,function(d){
                     if (typeof d =='object' && d.result && d.result=='error'){
                        c4.info_noty('Ощиюка #'+d.code+' при отаравке предложения');
                     }else{                        
                        c4.info_noty('Предложение успешно отправлено, спасибо за помощь!');
                     }
                  });			 
               }
                        }, 
            }
         });	
      }
      if (data.offerCode=='5'){ //Снять с ПН
         bootbox.dialog({
            title: 'Удалить из помогите назвать',
            message: 
            '<div class="row"><div class="col-md-12"><form class="form-horizontal"><div class="form-group">'+
            '<label class="col-md-3 control-label" for="offer">Причина удаления</label> '+
            '<div class="col-md-8">'+
            '<div class="radio"> <label for="offer0"> <input type="radio" name="user_offer" id="offer0" value="Названо достаточно точно" checked="checked">Названо достаточно точно</label> </div>'+
            '<div class="radio"> <label for="offer1"> <input type="radio" name="user_offer" id="offer1" value="Невозможно уточнить название" >Невозможно уточнить название</label> </div>'+
            '</div></div> '+
            '</form> '+
            '</div></div>'
            ,
            buttons: {
               cancel: {label: 'Отмена',className: "btn-default"},	
               success: {
                  label:'Отправить предложение',
                  className: "btn-success",
                  callback: function(e) {
                     var form=$('.modal-dialog form').serialize();
                     $.get(data.offerUrl,form,function(d){
                        if (typeof d =='object' && d.result && d.result=='error'){
                           c4.info_noty('Ощиюка #'+d.code+' при отаравке предложения');
                        }else{                        
                           c4.info_noty('Предложение успешно отправлено, спасибо за помощь!');
                        }
                     });			 
                  }
               }, 
            }
         });				
      }

      if (data.offerCode=='uncontest'){ //Снять с конкурса
         bootbox.dialog({
            title: 'Снять с конкурса', 
            onEscape:true, 
            message: 


            '<div class="">Вы уверены что работа не должна участвовать в конкурсе?'+
            ' </div>' 

            ,
            buttons: {
               cancel: {label: 'Нет',className: "btn-default"},	

               success: {
                  label:'Да',
                  className: "btn-success",
                  callback: function(e) {
                     var form=$('.modal-dialog form').serialize();
                     $.get(data.offerUrl,form,function(d){
                        if (typeof d =='object' && d.result && d.result=='error'){
                           c4.info_noty('Ощиюка #'+d.code+' при отаравке предложения');
                        }else{                        
                           c4.info_noty('Предложение успешно отправлено, спасибо за помощь!');
                        }
                     });			 
                  }
               }, 
            }
         });				
      }

      /*-- Функции модератора ----------------- */

      if (data.offerCode=='master_edit'){ //Модератор редактирует элемент
         location=data.offerUrl;
      }

      if (data.offerCode=='master_delete'){ //Модератор удаляет элемент
         $.get(data.offerUrl,function(d){
            c4.info_noty('Элемент #'+d.id+' удален - '+d.result);
         });	
      }

      if (data.offerCode=='master_unhelp'){ //Модератор снимает с помогите назвать
         $.get(data.offerUrl,function(d){
            c4.info_noty('Элемент #'+d.id+' снят с помогите назвать - '+d.result);
         });	
      }

      if (data.offerCode=='master_help'){ //Модератор переносит в помогите назвать
         $.get(data.offerUrl,function(d){
            c4.info_noty('Элемент #'+d.id+' перенесен в помогите назвать - '+d.result);
         });	
      }

      if (data.offerCode=='master_relupdate'){ //Модератор пересчитывает похожие
         $.get(data.offerUrl,function(d){
            if (d.error){
               c4.error_noty(d.error);
            }
            if (d.success){
               c4.info_noty(d.success);
            }
         });	
      }

      if (data.offerCode=='master_uncontest'){ //Снять с конкурса
         $.get(data.offerUrl,function(d){
            if (d.error){
               c4.error_noty(d.error);
            }
            if (d.success){
               c4.info_noty(d.success);
            }
         });	
      }

      if (data.offerCode=='master_change_user'){ //Модератор меняет пользователя

         bootbox.dialog({
            title: 'Сменить автора работы',
            message: 
            '<div class="row"><div class="col-md-12"><form class="form-horizontal"><div class="form-group">'+
            '<label class="col-md-3 control-label" for="offer">Идентификатор нового владельца</label> '+
            '<div class="col-md-8"><input name="user_id" type="text" autofocus placeholder="Идентификатор нового владельца" value="'+data.offerDefault+'" class="form-control input-md"></div>'+
            '</div>'+
            '</form> '+
            '</div></div>'
            ,
            onEscape:true,            
            buttons: {
               cancel: {label: 'Отмена',className: "btn-default"},	            
               success: {
                  label:'Отправить',
                  className: "btn-success",

                  callback: function(e) {

                     var form=$('.modal-dialog form').serialize();

                     $.get(data.offerUrl,form,function(d){ 
                        if (d.error){
                           c4.error_noty(d.error);
                        }
                        if (d.success){
                           c4.info_noty(d.success);
                        }
                     });			 
                  }
               }, 
            }
         });

         setTimeout(function(){$('.modal [autofocus]').focus().select();},500);


      }

   });






   $('.offer[t]').on('click',function(){
      var element_in_help=$('.element_on_help').size()?true:false;

      var k='',k1='';
      var at=$(this).attr('t')?$(this).attr('t').split(';'):[];
      var av=$(this).attr('v')?$(this).attr('v').split(';'):[];
      var url=$(this).attr('url');
      var urladd='?';
      var ad=[];
      for (var n=0;n<at.length;n++){
         k=prompt(at[n],av[n]?av[n]:'');		
         if (!k && n==0){
            return; 
         } 
         if (k==null){
            n--;				
            n--;				
         }else{
            if (!k){
               if (element_in_help){
                  bootbox.alert('Для разделов находящихся в разделе «Помогите назвать» обязательно отвечать на все вопросы и указывать ссылку на источник');						
                  return;
               }else{
                  bootbox.alert('Для принятия предложения, пожалуйста, ответьте на все вопросы');					
               }

            } else{
               if (n==1){ //Источник			
                  if (location.href.indexOf(k)!=-1){
                     bootbox.alert('Пожалуйста, правильно укажите источник правки. Это адрес другого сайта подтверждающий ваше название или указание на опечатку.');
                     n--;
                  }
               }
            }
            ad[n]=escape(k);
         }
      }	


      if (url){
         $.post(url,{'d[]':ad},function(){
            c4.info_noty('Спасибо, ваше предложение отправлено.');
         });
      }
   }); 

   $('.offer[file]').on('click',function(){
      dyn_download_image.onclick(this,$(this).attr('url'));
   });

});

dyn_download_image={
   onclick:function(t,url){
      dyn_download_image.button=t;
      t.dd_url=url;
      if (!t.opened){dyn_download_image.dd_open(t);}else{dyn_download_image.dd_close(t);}
   },
   dd_open:function(t){
      $(t).parent().append('<div class="dyndownload_form_o"><form id="file_upload_form" method="post" enctype="multipart/form-data" action="'+t.dd_url+'"><input name="dd_file" onchange="dyn_download_image.dd_change(this)" type="file" /><br><iframe id="upload_target" name="upload_target" src="" style="width:0;height:0;border:0px solid #fff;"></iframe></form></div>');
      t.opened=true;
   },
   dd_close:function(){
      $(dyn_download_image.button).parent().find('.dyndownload_form_o').remove();
      dyn_download_image.button.opened=false;
   },
   dd_change:function(t) {
      var f=$(t).parent().get(0);
      f.target=$(f).find('iframe').get(0).id;
      f.submit();
      $(f).parent().append('<div class="temp_image">Загрузка...</div>')
   },
   dd_load:function(t,a) { // a.code .error attr.url 
      if (a.error){ 
         $('.temp_image').remove(); 
         alert(a.error); 
         return;
      }else{
         alert('Спасибо, ваше предложение отправлено.');
         dyn_download_image.dd_close();
         //$('.temp_image').html('<img fname="'+a.attr.fname+'" src="'+a.attr.url+'">'); 
         //$('.temp_image').html('<img fname="'+a.attr.fname+'" src="'+a.attr.url+'">'); 
      }

   }
}

//##### Блокировка контекстного меню #######################################################


globalRbdeblock=false; //Флаг отмены блокировки контекстного меню
$(function(){
   $('.blog_insert').hover(function(){
      globalRbdeblock=true;

   },function(){
      globalRbdeblock=false;

   });
})


if (IE || OP){
   document.attachEvent("oncontextmenu",iecontext);
   document.attachEvent("onclick",context_hide);
}else{
   document.addEventListener("click",mzcontext,false);
}
var
contextObject;

function context_hide(){
   (contextObject)?contextObject.parentNode.removeChild(contextObject):null;
   contextObject=null;
}

function iecontext(){
   if (globalRbdeblock) return;
   context_hide();          
   var t=0;
   var l=0;
   //e=window.event;
   //x=e.x+l;
   //y=e.y+t;

   x = window.event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
   y = window.event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);      

   //          y=((document.body.offsetHeight+document.body.scrollTop-20)<(y+Contextmenu.height))?y-Contextmenu.height:y;
   //x=((document.body.offsetWidth-20)<(x+Contextmenu.width))?x-Contextmenu.width:x;
   y=((document.body.offsetHeight+document.body.scrollTop-20)<(y+85))?y-85:y;
   x=((document.body.offsetWidth-20)<(x+200))?x-200:x;


   context_show(x,y);
   window.event.returnValue = false;
}

function mzcontext(e){
   if (globalRbdeblock) return;
   context_hide();
   if(e.button & 2){
      e.preventDefault();

      x = e.clientX + window.scrollX;
      y = e.clientY + window.scrollY;           

      context_show(x,y);
   }

}

function context_show(left,top){
   context_hide();
   this.html="<div oncontextmenu='return false;' onselectstart='return false;'  class=noSelectStart style='color:#333; padding:7px; background:#F7F7FB; border:1px solid #928FAF; position:absolute; line-height:150% ; left:"+left+"px; top:"+top+"px; width:200px; height:auto; z-index:1000000'>";
   //       this.html+="u??????????????>???S? ?z/b> ???? ???? ?? ??? ";
   this.html+=gloalContextText; 
   this.html+="</DIV>";
   div=document.createElement('span');
   contextObject=document.body.appendChild(div);
   div.innerHTML=html;
}


/*######## События гугла ###################################################*/
$(function(){
   $('.element_download #vk_like').on('click',function(){
      ga('send', 'event', 'likes', 'click', 'vk');		
   });

   $('.element .c4_shareicon_service_vk').on('click',function(){
      ga('send', 'event', 'shares', 'click', 'vk');		
   });
   $('.element .c4_shareicon_service_fb').on('click',function(){
      ga('send', 'event', 'shares', 'click', 'fb');		
   });
   $('.element .c4_shareicon_service_tw').on('click',function(){
      ga('send', 'event', 'shares', 'click', 'tw');		
   });
   $('.element .c4_shareicon_service_pi').on('click',function(){
      ga('send', 'event', 'shares', 'click', 'tw');		
   });

   $('.element .ad_rating2 .btn').on('click',function(){
      ga('send', 'event', 'user', 'click', 'like');		
   });

});
