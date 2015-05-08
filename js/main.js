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
	// Fadeout white div when page has loaded 
	$( "#loading" ).addClass('hidden');
	setTimeout(function(){
		$( "#loading" ).addClass('removed');
	}, 900)

	// Start iframe loading
	$('#map-iframe').attr('src', "https://www.google.com/maps/embed/v1/place?q=TJHSST%2C%20Braddock%20Road%2C%20Alexandria%2C%20VA%2C%20United%20States&key=AIzaSyAccIzlS8Eruaf5KrClzMOER2GQ67FuVDA");
	
	// Open mentor popup if that's what we want
	if(location.hash == "#mentor"){
		setTimeout(function(){
			$('.registration-mentors').click();
		}, 1000);
	}
	if(location.hash == "#student" || location.hash == "#register"){
		setTimeout(function(){
			$('.registration-students').click();
		}, 1000);
	}

	window.queryArgs = {}
	location.search.substr(1).split("&").forEach(function(item) {
		queryArgs[item.split("=")[0]] = item.split("=")[1]
	});

	if(queryArgs["discount_code"]){
		if(queryArgs["discount_code"].toLowerCase().indexOf("payincash") == 0){
			queryArgs["discount_code"] = "payInCash";
			$('#student-title').text('1 Registration: Pay in Cash');
			$('#charge-info').html('To complete your registration you MUST bring $10 in cash to Ms. Galanos within a week. She can be found in T17, T19, or T20 during most class periods and breaks. If you\'re not a TJ student, please <a href="mailto:hello@hacktj.org">email us</a> and we can help you.');
		}else{
			$('#student-title').text('Discounted Registration: FREE');
		}
	}
});

// Resize cover images for the screen
function calculateCoverWidth(){
	if( $(window).width() > $(window).height() ){
		$('.cover').css('background-size', '100% '+$(window).height()+'px');
	}else{
		$('.cover').css('background-size', '200% '+ $(window).height() +'px');
	}
}
calculateCoverWidth()

jQuery(function($){

	// Smooth Scrolling for #links
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
	var navRed = false;
	function scrollHandler(){
		var s = $(window).scrollTop();
		for(var i=0; i<sections.length-1; i++){
			var y = sections[i].contentMidpoint - s; // Midpoint of content
			y = y <= 0 ? 0
			  : y >= h ? h
			  : y;

			sections[i].background.height(y);
		};

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
		modalOpen = false,
		hasOpenedNav = false;
	var navContainer = $('.nav-container'),
		modalContainer = $('.modal'),
		modalBackground = $('.modal-cover');
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
	
	$(".registration-students").click(function(e){
		$('.modal.student').addClass('shown');
		modalBackground.addClass('shown');
		modalOpen = true;
		$('.student .tito-submit').text("Purchase Ticket");

		if(queryArgs["discount_code"]){
			$('#tito-tito-hacktj-2015-1-discount-code-field').attr('value', queryArgs["discount_code"]);
			$('#tito-tito-hacktj-2015-1-discount-apply-button').click();
		}

		return false;
	});
	$(".registration-mentors").click(function(e){
		$('.modal.mentor').addClass('shown');
		modalBackground.addClass('shown');
		modalOpen = true;
		$('.mentor .tito-submit').text("Register");
		return false;
	});
	$('.close-button').click(function(e){
		modalContainer.removeClass('shown');
		modalBackground.removeClass('shown');
		modalOpen = false;

		return false;
	});

	Tito.on('registration:started', function(data){
		modalContainer.removeClass('shown');
	});
	Tito.on('registration:complete', function(data){
		modalBackground.removeClass('shown');
		modalOpen = false;
	});

	$(document).click(function(e) {
	    if (navOpen && !$(e.target).is('.nav-container') && !$(e.target).parents().is('.nav-container')) {
	        navContainer.removeClass('shown');
	        navOpen = false
	    }
	    if (modalOpen && !$(e.target).is('.modal') && !$(e.target).parents().is('.modal')) {
	        modalContainer.removeClass('shown');
	        modalBackground.removeClass('shown');
	        modalOpen = false
	    }
	});


	// Listen for page resizes to fix headers
	$( window ).resize(function() {
	  calculateCoverWidth();
	});
	
});