'use strict';

/**
 * @ngdoc function
 * @name karamuseDjApp.controller:NameOrMessageCtrl
 * @description
 * # NameOrMessageCtrl
 * Controller of the karamuseDjApp
 */
angular.module('karamuseDjApp')
	.controller('NameOrMessageCtrl', function($log, $q, $mdDialog, order, Utils) {

		var self = this;

		var ticket = Utils.getInStorage('ticket') || {
			orders: [],
			code: null
		};
		
		this.elements = {
			form: {
				code: {
					text: ticket.code,
					disabled: ticket.code ? ticket.code : false,
					error: {
						show: false,
						text: ''
					}
				},
				nameOrMessage: {
					focus: true
				},
				buttons: {
					next: {
						disabled: false
					},
					skip: {
						disabled: ticket.code ? false : true
					}
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

			// order = {
			// 	message: '',
			// 	result: {
			// 		added: false,
			// 		show: false,
			// 		color: '',
			// 		message: ''
			// 	}
			// };

			order.message = message; // al obj order agrega el attr message
			order.result = {
				added: false,
				show: false,
				color: '',
				message: ''
			};

			ticket.orders.push(order);
			// aqui valida el código
			if (!ticket.code) {
				var validateCode = self.validateCode();
				validateCode.then(function() {
					ticket.code = self.elements.form.code.text;
					Utils.setInStorage('ticket', ticket);
					openDialogTicket(); // abre modal ticket
				}, function() {
					self.elements.form.code.error.text = 'Código no válido';
					self.elements.form.code.error.show = true;
				});
			} else {
				Utils.setInStorage('ticket', ticket);
				openDialogTicket(); // abre modal ticket
			}
		};

		this.validateCode = function() {
			var deferred = $q.defer();
			deferred.resolve();
			// deferred.reject();
			return deferred.promise;
		};

		this.skip = function() {
			$mdDialog.cancel();
		};
	});