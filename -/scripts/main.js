function injectContent() {
    document.getElementById('page-footer').innerHTML = "Classic Tech Tips 2025";
}

injectContent();



function enlargeImages() {
	$('img[data-enlargeable]').each(function() {
		var enlargeable = $(this).attr('data-enlargeable');
		if (enlargeable === 'false') {
			return;
		}
		$(this).click(function() {
			var src = $(this).attr('src');
			var modal;

			function removeModal() {
				modal.remove();
				$('body').off('keyup.modal-close');
			}

			modal = $('<div>').addClass('enlarged-image').css({
			'background-image': 'url(' + src + ')'
			}).click(function() {
			removeModal();
			}).appendTo('body');

			//ESC
			$('body').on('keyup.modal-close', function(e) {
			if (e.key === 'Escape') {
				removeModal();
			}
			});
		});
	});
}
