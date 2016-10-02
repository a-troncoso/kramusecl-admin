'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:ActiveSessionModalInstanceCtrl
 * @description
 * # ActiveSessionModalInstanceCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
	.controller('ActiveSessionModalInstanceCtrl', function($uibModalInstance, $state) {

		this.ok = function() {
			$uibModalInstance.close();
			$state.go('home');
		};

		this.cancel = function() {
			$uibModalInstance.dismiss('cancel');
			$state.go('home');
		};

	});