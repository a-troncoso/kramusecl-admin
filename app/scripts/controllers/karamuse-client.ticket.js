'use strict';

/**
 * @ngdoc function
 * @name karamuseClientApp.controller:TicketCtrl
 * @description
 * # TicketCtrl
 * Controller of the karamuseClientApp
 */
angular.module('karamuseClientApp')
	.controller('TicketCtrl', function($auth, $state, $mdDialog, $log, Orders, Utils) {

		var self = this;

		this.temporalOrders = {
			list: Utils.getInStorage('temporalOrders') || []
		};

		this.action = function(action) {
			if (action === 'addAnother') {
				$mdDialog.hide();
				$state.go('client.search-karaoke');
			} else if (action === 'order') {
				$mdDialog.hide();
				openDialogOrder();
			}
		};

		var openDialogOrder = function() {
			$mdDialog.show({
					controller: 'OrderCtrl',
					controllerAs: 'order',
					templateUrl: 'karamuse-client.order.tmpl.html',
					parent: angular.element(document.querySelector('#dialogContainer')),
					clickOutsideToClose: true,
					fullscreen: true // Only for -xs, -sm breakpoints.
				})
				.then(function() {}, function() {});
		};

		this.closeDialog = function() {
			$mdDialog.cancel();
		};

	});