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

		var self = this;

		this.elements = {
			errors: {
				show: orderWarnings,
				message: orderWarnings === null ? '' : orderWarnings.capacity === 0 ? 'Los pedidos se encuentran bloqueados temporalmente' : 'Puedes pedir ' + orderWarnings.capacity + ' karaokes como máximo'
			},
			form: {
				buttons: {
					next: {
						disabled: false
					}
				}
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

		this.openDialogTicket = function() {
			$mdDialog.show({
					controller: 'TicketCtrl',
					controllerAs: 'ticket',
					templateUrl: 'karamuse-client.ticket.tmpl.html',
					parent: angular.element(document.querySelector('#dialogContainer')),
					clickOutsideToClose: true,
					fullscreen: true, // Only for -xs, -sm breakpoints.
					locals: {
						orderWarnings: null
					}
				})
				.then(function() {}, function() {});
		};

		this.openDialogOrderOptions = function(order) {
			$mdDialog.show({
					controller: 'OrderOptionsCtrl',
					controllerAs: 'orderOptions',
					templateUrl: 'karamuse-client.order-options.tmpl.html',
					parent: angular.element(document.querySelector('#dialogContainer')),
					clickOutsideToClose: true,
					fullscreen: false, // Only for -xs, -sm breakpoints.
					locals: {
						order: order
					}
				})
				.then(function() {}, function() {
					if (angular.element(document.body).hasClass('md-dialog-is-showing')) {
						self.openDialogTicket();
					}

				});
		};

		this.closeDialog = function() {
			$mdDialog.cancel();
		};

	});