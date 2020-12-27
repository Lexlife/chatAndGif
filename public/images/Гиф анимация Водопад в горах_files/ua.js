/*######## Установка и парсинг рекламы Google Adsense 1.1 - 01.02.2017  ###################################################*/

(function() {
   var userLevel=parseFloat(GetCookie ('_c4_users_level'));

   //  if (GetCookie ('USER_AUTH_ID')){return;}
   if (userLevel>0){
      $('[role="advertizing_left"]').remove();
      $('[role="advertizing_bottom"]').remove();
      $('[role="advertizing"]').remove();
      $('[role="advertizing2"]').remove();
      return;
   
   }


   /*######## Google Feed ###################################################*/
   // 
   var code_top='<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-5306303895924240" data-ad-slot="9744244814" data-ad-format="auto"></ins>';
   var code_top2='<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-5306303895924240" data-ad-slot="3980209864" data-ad-format="auto"></ins>';
   var code_fw='<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-5306303895924240" data-ad-slot="3980209864" data-full-width-responsive="true" data-ad-format="auto"></ins>';
   var code_left='<ins class="adsbygoogle" style="display:inline-block;width:240px;height:400px" data-ad-client="ca-pub-5306303895924240" data-ad-slot="6651177618"></ins>';
   var code_bottom='<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-5306303895924240" data-ad-slot="6976760419" data-ad-format="auto"></ins>';
   
   var code_middle='<div class="it-adblk it-adblk-middle" role="advertizing_middle"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-5306303895924240" data-ad-slot="3980209864" data-ad-format="auto"></ins></div>';
   var code_related='<div class="it-adblk it-adblk-related" role="advertizing_related"><ins class="adsbygoogle" style="display:block" data-ad-format="autorelaxed" data-ad-client="ca-pub-5306303895924240" data-ad-slot="7858401197"></ins></div>';


   var activate_advert=function(){
      (adsbygoogle = window.adsbygoogle || []).push({
      });
   }

   var activate_dom=function(){

      //Автоматизированные объявления
      /*   (adsbygoogle = window.adsbygoogle || []).push({
         google_ad_client: "pub-5306303895924240",
         enable_page_level_ads: true
      });

		return ;*/

      if (MOB){
         $('[role="advertizing_left"]').remove();

         if ($('[data-scope-element]').size()>0){//Элемент

            $('[data-scope-element] ._content').after($('[role="advertizing"]'));
            $('[data-scope-element] .element_data_wrapper').after($('[role="advertizing_bottom"]'));

         }else{
            if ($('[role="content-wrapper"] .photo2_list').size()>0){//Есть списки на странице

               $advert_clone=$('[role="advertizing"]').clone();
               $advert_clone2=$('[role="advertizing"]').clone();
               $('[role="advertizing"]').remove();

               $advert_clone2.attr('role','advertizing2');

               var $list=$('[role="content-wrapper"] .photo2_list');
               var items_count=$list.find('.photo2_tmb').size();

               var index1=Math.round(Math.random()*items_count/2);
               var index1=0;
               var index2=Math.round(items_count/2+Math.random()*items_count/2);
               var index3=Math.round(items_count/3+Math.random()*items_count/3);

               //console.log(items_count);

               $list.find('.photo2_tmb').eq(index1).after($advert_clone);               
               $list.find('.photo2_tmb').eq(index3).after($advert_clone2);               

            }
         }


         //Другие страницы
         $('[role="advertizing"]')			.html(code_top2);
         $('[role="advertizing2"]')			.html(code_top);
         $('[role="advertizing_bottom"]')	.html(code_bottom);

      }else{ //Десктоп
         $('[role="advertizing_left"]')	.html(code_left);
         $('[role="advertizing"]')			.html(code_top2);
         $('[role="advertizing_bottom"]')	.html(code_bottom);
      }
      //console.log('dom created'); 
   }

   $(function(){  
      activate_dom();

      $.getScript("//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",function(){      
         $('.adsbygoogle').each(function(){
            activate_advert();
         });

         //  console.log('script loaded');      
      });
   });
 
})();

