'use strict';

/**
 * @ngdoc function
 * @name karamuseClientApp.controller:CodeCtrl
 * @description
 * # CodeCtrl
 * Controller of the karamuseClientApp
 */
angular.module('karamuseClientApp')
	.controller('CodeCtrl', function($auth, $q, $state, $mdDialog, $log, Orders, Utils, deviceDetector) {

		var self = this,
			i = 0,
			j = 0;

		this.elements = {
			form: {
				nameMessage: {
					text: ''
				},
				code: {
					text: '',
					focus: true,
					error: {
						show: false,
						text: ''
					}
				},
				buttons: {
					order: {
						disaled: false
					}
				}
			}
		};

		this.validateCode = function() {
			var code = self.elements.form.code.text;
			var deferred = $q.defer();
			deferred.resolve();
			// deferred.reject();
			return deferred.promise;
		};

		this.order = function() {

			var validateCode = self.validateCode();
			validateCode.then(function() {

				var ticket = Utils.getInStorage('ticket'),
					order = [];

					$log.log(self.elements.form.code.text);

				ticket.code = self.elements.form.code.text;
				Utils.setInStorage('ticket', ticket);

				for (i = 0; i < ticket.orders.length; i++) {
					order.push({
						id_karaoke: ticket.orders[i].id,
						message: ticket.orders[i].message
					});
				}

				Orders.save({
					token: $auth.getToken(),
					code_client: ticket.code,
					origin: deviceDetector.os,
					order: order
				}, function(success) {
					// $log.log(success);
					if (success.status === 200) {
						for (i = 0; i < success.data.length; i++) {
							for (j = 0; j < ticket.orders.length; j++) {
								if (success.data[i].id_karaoke === ticket.orders[j].id) {
									ticket.orders[j].result.show = true;
									if (success.data[i].add_order) {
										ticket.orders[j].result.added = true;
										ticket.orders[j].result.color = 'primary-hue-3';
										ticket.orders[j].result.message = 'Enviado correctamente';
									} else {
										ticket.orders[j].result.added = false;
										ticket.orders[j].result.color = 'warn';
										ticket.orders[j].result.message = 'Otro usuario ya lo había pedido';
									}
								}
							}
						}
						Utils.setInStorage('ticket', ticket);
						$mdDialog.hide();
						self.openDialogOrderResults();
					} else if (success.status === 403) {
						$log.error('codigo no válido');
						openDialogCode();
					} else if (success.status === 404) {
						$log.error('puede ser que el arreglo del pedido está vacío o es invalido');
					} else if (success.status === 406) {
						// $log.error('Cupos limitados');
						self.openDialogTicket(success);
					} else {
						$log.error(success);
					}
				}, function(error) {
					$log.error(error);
				});
			}, function() {
				// abre modal que solicita codigo
				openDialogCode();
			});
		};

		this.openDialogTicket = function(warnings) {
			$mdDialog.show({
					controller: 'TicketCtrl',
					controllerAs: 'ticket',
					templateUrl: 'karamuse-client.ticket.tmpl.html',
					parent: angular.element(document.querySelector('#dialogContainer')),
					clickOutsideToClose: true,
					fullscreen: true, // Only for -xs, -sm breakpoints.
					locals: {
						orderWarnings: warnings
					}
				})
				.then(function() {}, function() {});
		};

		this.openDialogOrderResults = function() {
			$mdDialog.show({
					controller: 'OrderResultsCtrl',
					controllerAs: 'orderResults',
					templateUrl: 'karamuse-client.order-results.tmpl.html',
					parent: angular.element(document.querySelector('#dialogContainer')),
					clickOutsideToClose: true,
					fullscreen: true, // Only for -xs, -sm breakpoints.
				})
				.then(function() {}, function() {});
		};

		this.cancel = function() {
			$mdDialog.cancel();
		};


	});