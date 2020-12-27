/*######## Скоп ###################################################*/
	$('[data-scope]').c4_scope({verbose:0});
	$('[data-scope-element]').c4_scope({verbose:0});

/*######## Появляющиеся картинки ###################################################*/

 	$('.c4_fadeIn').on('load',function(){ 
		$(this).css({"opacity":1}); 
	}) 
	
	$(function(){
			setTimeout(function(){$('.c4_fadeIn').css({"opacity":1});},2000);
	})
	
 