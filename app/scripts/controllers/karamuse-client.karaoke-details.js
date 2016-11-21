'use strict';

/**
 * @ngdoc function
 * @name karamuseClientApp.controller:KaraokeDetailsCtrl
 * @description
 * # KaraokeDetailsCtrl
 * Controller of the karamuseClientApp
 */
angular.module('karamuseClientApp')
	.controller('KaraokeDetailsCtrl', function($log, $q, $state, $mdDialog, deviceDetector, karaokeSelected, Utils) {

		var self = this,
			i = 0,
			ticket = Utils.getInStorage('ticket') || {
				orders: [],
				code: null
			};

		this.elements = {
			karaoke: {
				id: karaokeSelected.id || 1,
				url: karaokeSelected.url || 'https://www.youtube.com/watch?v=moCSOP4Y2KU',
				avatar: karaokeSelected.avatar || 'http://cumbrianrun.co.uk/wp-content/uploads/2014/02/default-placeholder.png',
				title: karaokeSelected.title || 'No indica'
			},
			buttons: {
				add: {
					disabled: false,
					show: karaokeSelected.fromResults
				}
			}
		};

		// Valida si ya está en lista temporal el pedido
		this.validateOrderInTicket = function(order) {
			var isInTicket = false;

			for (i = 0; i < ticket.orders.length; i++) {
				if (ticket.orders[i].id === order.id) {
					isInTicket = true;
					break;
				}
			}
			return isInTicket;
		};

		this.openDialogCustomAlert = function(data) {
			$mdDialog.show({
					controller: 'CustomAlertCtrl',
					controllerAs: 'customAlert',
					templateUrl: 'karamuse-client.custom-alert.tmpl.html',
					parent: angular.element(document.querySelector('#dialogContainer')),
					clickOutsideToClose: true,
					fullscreen: false, // Only for -xs, -sm breakpoints.
					locals: {
						data: data
					}
				})
				.then(function() {}, function() {});
		};

		this.openDialogNameOrMessage = function(order) {

			if (self.validateOrderInTicket(order)) {
				self.openDialogCustomAlert({
					title: '¡Hey!',
					subtitle: '',
					body: {
						paragraph1: 'Ya tienes este karaoke en tu ticket'
					}
				});
			} else {
				$mdDialog.show({
						controller: 'NameOrMessageCtrl',
						controllerAs: 'nameOrMessage',
						templateUrl: 'karamuse-client.nameOrMessage.tmpl.html',
						parent: angular.element(document.querySelector('#dialogContainer')),
						clickOutsideToClose: true,
						fullscreen: true, // Only for -xs, -sm breakpoints.
						locals: {
							order: order
						}
					})
					.then(function() {}, function() {});
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

		this.closeDialog = function() {

			$mdDialog.cancel();

			if (!karaokeSelected.fromResults) {
				self.openDialogTicket();
			}

		};

	});