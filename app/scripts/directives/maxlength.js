'use strict';

/**
 * @ngdoc directive
 * @name karamuseclAdminApp.directive:maxLength
 * @description
 * # maxLength
 */
angular.module('karamuseclAdminApp')
	.directive('maxLength', function() {
		return {
			restrict: "A",
			link: function(scope, elem, attrs) {
				var limit = parseInt(attrs.maxLength);
				angular.element(elem).on("keypress", function(e) {
					if (this.value.length === limit) {
						e.preventDefault();
					};
				})
			}
		};
	});