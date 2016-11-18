'use strict';

/**
 * @ngdoc function
 * @name karamuseDjApp.controller:NameOrMessageCtrl
 * @description
 * # NameOrMessageCtrl
 * Controller of the karamuseDjApp
 */
angular.module('karamuseDjApp')
	.controller('NameOrMessageCtrl', function($log, $mdDialog, order, Utils) {

		var temporalOrders = Utils.getInStorage('temporalOrders') || [];

		this.elements = {
			form: {
				nameOrMessage: {
					text: ''
				}
			}
		};

		var openDialogTicket = function() {
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

		this.addNameOrMessage = function(message) {
			order.message = message; // al obj order agrega el attr message
			order.result = {
				added: false,
				show: false,
				color: '',
				message: ''
			};

			temporalOrders.push(order);
			Utils.setInStorage('temporalOrders', temporalOrders); // guarda en local storage

			openDialogTicket(); // abre modal ticket
		};

		this.skip = function() {
			$mdDialog.cancel();
		};
	});