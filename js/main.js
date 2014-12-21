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
$(window).load(function(){
	// Page done loading
	$( "#loading" ).addClass('hidden');
	setTimeout(function(){
		$( "#loading" ).addClass('removed');
	}, 900)
});

function calculateCoverWidth(){
	if( $(window).width() > $(window).height() ){
		$('.cover').css('background-size', '100% '+$(window).height()+'px');
	}else{
		$('.cover').css('background-size', '200% '+ $(window).height() +'px');
	}
}
calculateCoverWidth()

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
		section.top = section.content.offset().top
		section.bottom = section.content.offset().top + section.content.height()

		sections.push(section);
	});
	window.sections = sections;
	
	function navIsOverSection(s){
		for(var i=0; i<sections.length; i++)
			if( sections[i].top < s+40 && s-40 < sections[i].bottom)
				return true;
		return false;
	}

	var h = $(window).height();
	var credits = true,
		navRed = false;

	function scrollHandler(){
		var s = $(window).scrollTop();
		for(var i=0; i<sections.length-1; i++){
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

		if(!navRed && navIsOverSection(s)){
			$('.toggle-nav').addClass('red');
			navRed = true;
		}else if(navRed && !navIsOverSection(s)){
			$('.toggle-nav').removeClass('red');
			navRed = false;
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

	$(document).click(function(e) {
	    if (navOpen && !$(e.target).is('.nav-container') && !$(e.target).parents().is('.nav-container')) {
	        navContainer.removeClass('shown');
	        navOpen = false
	    }
	});


	// Header image size
	$( window ).resize(function() {
	  calculateCoverWidth()
	});
});