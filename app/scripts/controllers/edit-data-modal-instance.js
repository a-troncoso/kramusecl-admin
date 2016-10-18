'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:EditDataModalInstanceCtrl
 * @description
 * # EditDataModalInstanceCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
	.controller('EditDataModalInstanceCtrl', function($log, $uibModalInstance, $auth, data, Settings) {

		// var self = this;

		this.modal = {
			title: {
				text: 'Cambiar los datos del bar',
				show: true
			},
			subtitle: {
				text: data.subtitle || null,
				show: false
			},
			paragraph1: {
				text: null,
				show: false
			},
			paragraph2: {
				text: null,
				show: false
			},
			paragraph3: {
				text: null,
				show: false
			},
			buttons: {
				save: {
					disabled: false
				}
			}
		};

		this.bar = {
			data: {
				name: data.name,
				address: data.address,
				avatar: data.avatar,
				ordersLimit: data.ordersLimit
			}
		};

		this.editData = function(data) {
			Settings.update({
				token: $auth.getToken(),
				avatar: data.avatar,
				order_limit: data.ordersLimit,
				bar_name: data.name,
				address: data.address
			}, function(success) {
				$log.log(success);
			}, function(error) {
				$log.log(error);
			});
		};

		this.cancel = function() {
			$uibModalInstance.dismiss();
		};
	});