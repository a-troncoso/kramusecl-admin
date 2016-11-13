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
			i = 0;

		this.elements = {
			form: {
				nameMessage: {
					text: ''
				},
				code: {
					text: ''
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
				$log.log(success);
				if (success.status === 200) {
					Utils.removeStorageItem('temporalOrders');
					$mdDialog.hide();
					$state.go('client.search-karaoke');
				} else if (success.status === 403) {
					$log.log('codigo no válido');
				} else if (success.status === 404) {
					$log.log('puede ser que el arreglo del pedido está vacío o es invalido');
				} else if (success.status === 406) {
					$log.log('Cupos limitados');
				} else {
					$log.error(success);
				}
			}, function(error) {
				$log.error(error);
			});

		};

		this.cancel = function() {
			$mdDialog.cancel();
		};


	});