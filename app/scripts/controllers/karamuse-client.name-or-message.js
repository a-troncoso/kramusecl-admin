'use strict';

/**
 * @ngdoc function
 * @name karamuseDjApp.controller:NameOrMessageCtrl
 * @description
 * # NameOrMessageCtrl
 * Controller of the karamuseDjApp
 */
angular.module('karamuseDjApp')
	.controller('NameOrMessageCtrl', function($rootScope, $log, $auth, $q, $mdDialog, order, Utils, Codes) {

		var self = this;

		var ticket = Utils.getInStorage('ticket') || {
			orders: [],
			code: null
		};

		this.elements = {
			form: {
				code: {
					text: ticket.code,
					show: ticket.code ? false : true,
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
						show: ticket.code ? true : false
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

		this.validateCode = function() {
			var deferred = $q.defer();

			Codes.verify({
				token: $auth.getToken(),
				code: self.elements.form.code.text
			}, function(success) {
				if (success.status === 200) {
					deferred.resolve();
				} else if (success.status === 201 || success.status === 202) {
					deferred.reject();
				} else {
					deferred.reject();
				}
			}, function(error) {
				$log.error(error);
				deferred.reject();
			});
			return deferred.promise;
		};

		this.addNameOrMessage = function(message) {

			$rootScope.clientGlobalLoader.show = true;

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
					$rootScope.clientGlobalLoader.show = false;
					ticket.code = self.elements.form.code.text;
					Utils.setInStorage('ticket', ticket);
					openDialogTicket(); // abre modal ticket
				}, function() {
					$rootScope.clientGlobalLoader.show = false;
					self.elements.form.code.error.text = 'Código no válido';
					self.elements.form.code.error.show = true;
				});
			} else {
				$rootScope.clientGlobalLoader.show = false;
				Utils.setInStorage('ticket', ticket);
				openDialogTicket(); // abre modal ticket
			}
		};

		this.skip = function() {
			$mdDialog.cancel();
		};
	});