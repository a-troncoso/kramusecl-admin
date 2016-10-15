'use strict';

/**
 * @ngdoc directive
 * @name karamuseclAdminApp.directive:focus
 * @description
 * # focus
 */
angular.module('karamuseclAdminApp')
	.directive('focus', function($timeout) {
		return {
			scope: {
				trigger: '=focus'
			},
			link: function(scope, element) {
				scope.$watch('trigger', function(value) {
					if (value === true) {
						$timeout(function() {
							element[0].focus();
							scope.trigger = false;
						});
					}
				});
			}
		};
	});