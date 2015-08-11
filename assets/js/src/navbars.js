(function($) {
	'use strict';

	var $collapse = $('.navbar-collapse');

	$('.toggle-main-nav').on('click', function() {
		$collapse.toggle();
	});
	
})(jQuery);