(function($) {
	$(document).on('click', '.help .help-menu a', function(event) {
		event.preventDefault();
		$(this).tab('show');
	});

	$(document).on('click', '.help-pointer', function(event) {
		var helpTab = $(event.target).attr('data-help-tab');

		$('[data-tab="' + helpTab + '"]').click();

		$('html, body').animate({ scrollTop: 0 }, 'slow');
	});
})(jQuery);