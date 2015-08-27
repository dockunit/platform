(function($) {
	'use strict';

	var $collapse = $('.navbar-collapse');
	var $navbar = $('#navbar');

	var setupMenuCloseMobile = false;

	$('.toggle-main-nav').on('click', function() {
		$collapse.toggle();

		if (!setupMenuCloseMobile) {
			$navbar.on('click', 'a', function() {
				setupMenuCloseMobile = true;

				$collapse.hide();
			});
		}
	});
	
})(jQuery);