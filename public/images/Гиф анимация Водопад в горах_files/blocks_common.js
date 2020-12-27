(function($){
	$(function(){
		/*######## РЎРєСЂС‹С‚С‹Р№ Р±Р»РѕРє 1.2 ###################################################*/
			$('.c4cmngr_type_hb').each(function(){
				var $t=$(this);
				var $n=$(this).next();
				if ($n.hasClass('c4cmngr_block')){
					$n.hide().addClass('c4cmngr_open_toggle');
					$t.on('click',function(){
						if (!$n.data('c4cmngr_type_hb_open')==true){
							$n.show();
							$n.data('c4cmngr_type_hb_open',true);
							$t.addClass('c4cmngr_open_next_opened').removeClass('c4cmngr_open_next_closed');
						}else{
							$n.hide();
							$n.data('c4cmngr_type_hb_open',false);
							$t.addClass('c4cmngr_open_next_closed').removeClass('c4cmngr_open_next_opened');
						}
					});
					
				}
			});

	});
})(jQuery);