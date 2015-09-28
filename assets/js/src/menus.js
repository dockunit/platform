(function($) {

	$(document).on('click', '.navbar-collapse.in', function(e) {
	    if( $(e.target).is('a') ) {
	    	console.log('hello');
	        $(this).collapse('hide');
	    }
	});

})(jQuery);