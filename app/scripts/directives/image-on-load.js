'use strict';

/**
 * @ngdoc directive
 * @name karamuseclAdminApp.directive:imageOnLoad
 * @description
 * # imageOnLoad
 */
angular.module('karamuseclAdminApp')
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