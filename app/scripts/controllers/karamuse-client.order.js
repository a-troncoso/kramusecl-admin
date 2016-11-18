'use strict';

/**
 * @ngdoc function
 * @name karamuseClientApp.controller:OrderCtrl
 * @description
 * # OrderCtrl
 * Controller of the karamuseClientApp
 */
angular.module('karamuseClientApp')
	.controller('OrderCtrl', function($auth, $state, $mdDialog, $log, Orders, Utils, deviceDetector) {

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

		this.order = function() {

			var temporalOrders = Utils.getInStorage('temporalOrders'),
				order = [];

			for (i = 0; i < temporalOrders.length; i++) {
				order.push({
					id_karaoke: temporalOrders[i].id,
					message: temporalOrders[i].message
				});
			}

			Orders.save({
				token: $auth.getToken(),
				code_client: self.elements.form.code.text,
				origin: deviceDetector.os,
				order: order
			}, function(success) {
				// $log.log(success);
				if (success.status === 200) {
					for (i = 0; i < success.data.length; i++) {
						for (j = 0; j < temporalOrders.length; j++) {
							if (success.data[i].id_karaoke === temporalOrders[j].id) {
								temporalOrders[j].result.show = true;
								if (success.data[i].add_order) {
									temporalOrders[j].result.added = true;
									temporalOrders[j].result.color = 'primary-hue-3';
									temporalOrders[j].result.message = 'Enviado correctamente';
								} else {
									temporalOrders[j].result.added = false;
									temporalOrders[j].result.color = 'warn';
									temporalOrders[j].result.message = 'Otro usuario ya lo había pedido';
								}
							}
						}
					}
					Utils.setInStorage('temporalOrders', temporalOrders);
					$mdDialog.hide();
					self.openDialogOrderResults();
				} else if (success.status === 403) {
					// $log.log('codigo no válido');
					self.elements.form.code.error.show = true;
					self.elements.form.code.error.text = 'Código no válido';
				} else if (success.status === 404) {
					$log.log('puede ser que el arreglo del pedido está vacío o es invalido');
				} else if (success.status === 406) {
					// $log.log('Cupos limitados');
					self.openDialogTicket(success);
				} else {
					$log.error(success);
				}
			}, function(error) {
				$log.error(error);
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