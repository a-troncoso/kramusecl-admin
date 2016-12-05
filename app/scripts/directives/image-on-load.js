'use strict';

/**
 * @ngdoc directive
 * @name karamuseDjApp.directive:imageOnLoad
 * @description
 * # imageOnLoad
 */
angular.module('karamuseDjApp')
	.directive('imageonload', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.bind('load', function() {
					scope.$apply(attrs.imageonload);
				});
			}
		};
	});