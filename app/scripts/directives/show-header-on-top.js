'use strict';

/**
 * @ngdoc directive
 * @name karamuseDjApp.directive:showHeaderOnTop
 * @description
 * # showHeaderOnTop
 */
angular.module('karamuseDjApp')
	.directive('showHeaderOnTop', function() {

		return {
			restrict: 'A',
			link: function(scope, $elm, attrs) {
				$(window).scroll(function() {
					if ($(".navbar").offset().top > 50) {
						$(".navbar-fixed-top").addClass("top-nav-collapse");
					} else {
						$(".navbar-fixed-top").removeClass("top-nav-collapse");
					}
				});
			}
		}
	});