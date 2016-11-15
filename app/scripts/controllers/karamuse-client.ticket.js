'use strict';

/**
 * @ngdoc function
 * @name karamuseClientApp.controller:TicketCtrl
 * @description
 * # TicketCtrl
 * Controller of the karamuseClientApp
 */
angular.module('karamuseClientApp')
	.controller('TicketCtrl', function($auth, $state, $mdDialog, $log, Orders, Utils, orderWarnings) {

		this.elements = {
			errors: {
				show: orderWarnings,
				message: orderWarnings === null ? '' : 'Puedes pedir ' + orderWarnings.capacity + ' karaokes como máximo'
			}
		};

		this.temporalOrders = {
			list: Utils.getInStorage('temporalOrders') || []
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

		this.action = function(action) {
			if (action === 'addAnother') {
				$mdDialog.hide();
				$state.go('client.search-karaoke');
			} else if (action === 'order') {
				$mdDialog.hide();
				openDialogOrder();
			}
		};

		this.openDialogOrderOptions = function(order) {
			$mdDialog.show({
					controller: 'OrderOptionsCtrl',
					controllerAs: 'orderOptions',
					templateUrl: 'karamuse-client.order-options.tmpl.html',
					parent: angular.element(document.querySelector('#dialogContainer')),
					clickOutsideToClose: false,
					fullscreen: false, // Only for -xs, -sm breakpoints.
					locals: {
						order: order
					}
				})
				.then(function() {}, function() {});
		};

		this.closeDialog = function() {
			$mdDialog.cancel();
		};

	});