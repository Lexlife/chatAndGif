 
comments_99={
	init:function(){
		comments_99.refresh_events();
	},
	refresh_events:function(){ //Обновление событий
		$('textarea[message="1"]').unbind().bind('keydown',function(e){
			if (e.ctrlKey && e.keyCode == 13) {
				sendCommentsReq(objectById('cbutton'));
				$('.dyndownload_form_o').remove();
			}		
		});
		$('.dyndownload').each(function(){
			comments_99.dd_open(this);
		});
		comment.parse();
	},
	onclick:function(t){
		t.dd_url=$(t).attr('dd_url');
		if (!t.opened){comments_99.dd_open(t);}else{comments_99.dd_close(t);}
	},
	dd_open:function(t){
		$(t).parent().append('<div class="dyndownload_form_o"><form id="file_upload_form" method="post" enctype="multipart/form-data" action="'+$(t).attr('dd_url')+'"><div class="dd_file_input_o"><input class="dd_file_input" name="dd_file" onchange="comments_99.dd_change(this)" type="file" /></div><iframe id="upload_target" name="upload_target" src="" style="width:0;height:0;border:0px solid #fff;"></iframe></form></div>');
		t.opened=true;
	},
	dd_close:function(t){
		$(t).parent().find('.dyndownload_form_o').remove();
		t.opened=false;
	},
	dd_change:function(t) {
		var f=$(t).parent().parent().get(0);
		f.target=$(f).find('iframe').get(0).id;
		f.submit();
		$(f).parent().parent().append('<div class="temp_image">Загрузка...</div>')
	},
	dd_load:function(t,a) { // a.code .error attr.url 
		if (a.error){ 
			$('.temp_image').remove(); 
			alert(a.error); 
			return;
		}else{
			$('.temp_image').html('<img fname="'+a.attr.fname+'" src="'+a.attr.url+'">'); 
		}
		
	}
 }
 
$(function(){comments_99.init()});



	
comment={ //1.1 Обработка комментариев
	currentOpen:null,
	init:function(){
		comment.parse(); 
	},
	parse:function(){
		$(function(){c4.href_parse($('.comment_text'));});
                
		/*$('.comment_text img').each(function(){
			var w=$(this).width()
			if (w>500) {
				$(this).attr('width',500);$(this).attr('title','Нажмите для увеличения'); $(this).addClass('hand');$(this).click(function(){window.open(this.src)});
			}
		})*/
	},
	commentAnswer:function(id){
		af=document.getElementById('answerForm');
		afcc=document.getElementById('answerFormConteiner'+comment.currentOpen);
		afci=document.getElementById('answerFormConteiner'+id);
		if (comment.currentOpen==id){
			af.innerHTML=afci.innerHTML;
			afcc.innerHTML="";
			comment.currentOpen=null;
		}else{
			if (comment.currentOpen){
				afci.innerHTML=afcc.innerHTML;
				 afcc.innerHTML="";
			}else{
				afci.innerHTML=af.innerHTML;
				af.innerHTML="";
			}
			comment.currentOpen=id;
		}
	}		

}


$(function(){comment.init()});
