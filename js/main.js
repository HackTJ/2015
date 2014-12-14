// Animation Frame Shim
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
	// Smooth Scrolling
	$('a[href*=#]:not([href=#])').click(function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				$('html,body').animate({
					scrollTop: target.offset().top
				}, 1000);
				return false;
			}
		}
	});

	// Section backgrounds
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
	var credits = true,
		toggleWhite = true;

	var toggleHeight = $('#top').height() - $('.toggle-nav').height() + 20;
	function scrollHandler(){
		var s = $(window).scrollTop();
		for(var i=0; i<sections.length; i++){
			var y = sections[i].contentMidpoint - s; // Midpoint of content
			y = y <= 0 ? 0
			  : y >= h ? h
			  : y;
			sections[i].background.height(y);
		};
		if(credits && s > h/2){
			$('.photocreds').css('display', 'none');
			credits = false;
		}else if(!credits && s < h/2){
			$('.photocreds').css('display', 'block');
			credits = true;
		}
		console.log($('.toggle-nav').offset().top, '>', toggleHeight, $('.toggle-nav').offset().top > toggleHeight)
		if(toggleWhite && $('.toggle-nav').offset().top > toggleHeight){
			$('.toggle-nav').addClass('red');
			toggleWhite = false;
		}else if(!toggleWhite && $('.toggle-nav').offset().top < toggleHeight){
			$('.toggle-nav').removeClass('red');
			toggleWhite = true;
		}
	}
	scrollHandler();
	$(window).on('scroll', function(e){
		window.requestAnimationFrame(scrollHandler);
	});


	// Navigation dropdown
	var navOpen = false,
		hasOpenedNav = false;
	var navContainer = $('.nav-container');
	$('.toggle-nav, .nav-link').click(function(e){
		if(navOpen){
			navContainer.removeClass('shown');
		}else{
			if(!hasOpenedNav){
				navContainer.removeClass('no-animate');
				hasOpenedNav = true;
			}
			navContainer.addClass('shown');
		}
		navOpen = !navOpen;
	});
});