(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

jQuery(function($){

	// $('.photo-1').css('opacity', '1');
	
	// var current;

	// function switchBackground(num){
	// 	if(current == num || $('.photo-'+num).length==0) return;
	// 	console.log("switching from", current, "to", num)
	// 	$('.photo-'+current).css('opacity', '0');
	// 	$('.photo-'+num).css('opacity', 1);

	// 	current = num;
	// }

	// var bottoms = [0];
	// $('.header').each(function(index, h){
	// 	bottoms.push($(h).offset().top + $(h).height())
	// });
	// console.log(bottoms)

	var sections = [];
	$('.header').each(function(index, h){
		var section = {};

		section.header = $(h);
		section.content = section.header.next();
		section.background = $('.'+section.header.attr('data-bg'));

		section.contentMidpoint = section.content.offset().top + section.content.height() / 2;
		sections.push(section);
	});

	var h = $(window).height();

	function scrollHandler(){
		var s = $(window).scrollTop();
		for(var i=0; i<sections.length; i++){
			var y = sections[i].contentMidpoint - s; // Midpoint of content
			y = y <= 0 ? 0
			  : y >= h ? h
			  : y;
			sections[i].background.height(y);
		};
		
	}
	scrollHandler();
	$(window).on('scroll', function(e){
		console.log(e);
		window.requestAnimationFrame(scrollHandler);
	});
})