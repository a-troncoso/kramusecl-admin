'use strict';

/**
 * @ngdoc directive
 * @name karamuseDjApp.directive:scrollOnClick
 * @description
 * # scrollOnClick
 */
angular.module('karamuseDjApp')
	.directive('scrollOnClick', function() {
		return {
			restrict: 'A',
			link: function(scope, $elm, attrs) {
				var idToScroll = attrs.href;
				$elm.on('click', function() {
					var $target;
					if (idToScroll) {
						$target = $(idToScroll);
					} else {
						$target = $elm;
					}

					$('html, body').stop().animate({
						scrollTop: $target.offset().top
					}, 1500, 'easeInOutExpo');
					
					event.preventDefault();
				});
			}
		}
	});