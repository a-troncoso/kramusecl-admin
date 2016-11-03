'use strict';

/**
 * @ngdoc directive
 * @name karamuseApp.directive:showHeaderOnTop
 * @description
 * # showHeaderOnTop
 */
angular.module('karamuseApp')
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