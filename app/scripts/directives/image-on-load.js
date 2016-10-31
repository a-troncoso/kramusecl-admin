'use strict';

/**
 * @ngdoc directive
 * @name karamuseApp.directive:imageOnLoad
 * @description
 * # imageOnLoad
 */
angular.module('karamuseApp')
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