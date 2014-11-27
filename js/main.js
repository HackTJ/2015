jQuery(function($){

	$('.photo-1').css('opacity', '1');
	
	var current;

	function switchBackground(num){
		if(current == num || $('.photo-'+num).length==0) return;
		console.log("switching from", current, "to", num)
		$('.photo-'+current).css('opacity', '0');
		$('.photo-'+num).css('opacity', 1);

		current = num;
	}

	var bottoms = [0];
	$('.header').each(function(index, h){
		bottoms.push($(h).offset().top + $(h).height())
	});
	console.log(bottoms)
	$(window).on('scroll', function(){
		var s = $(window).scrollTop();

		for(var i=0; i<bottoms.length; i++){
			var top1 = bottoms[i] || 0;
			var top2 = bottoms[i+1] || 10000000;
			if( top1 < s && s < top2 ){
				switchBackground(i+1);
			}
		}
		// if(s > 0) switchBackground( 1 );
		// else switchBackground( 2 )
	});
})