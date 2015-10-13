(function($) {

	$(document).on('click', '.navbar-collapse.in', function(event) {
	    if( $(event.target).is('a') ) {
	        $(this).collapse('hide');
	    }
	});
})(jQuery);