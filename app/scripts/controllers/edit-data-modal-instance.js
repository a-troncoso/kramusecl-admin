'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:EditDataModalInstanceCtrl
 * @description
 * # EditDataModalInstanceCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
	.controller('EditDataModalInstanceCtrl', function($rootScope, $log, $uibModalInstance, $auth, data, Settings) {

		var self = this,
			i = 0;

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
			self.modal.buttons.save.disabled = true;
			$rootScope.loader.show = true;

			Settings.update({
				token: $auth.getToken(),
				avatar: data.avatar,
				order_limit: data.ordersLimit,
				bar_name: data.name,
				address: data.address
			}, function(success) {
				$log.log(success);
				self.modal.buttons.save.disabled = false;
				$rootScope.loader.show = false;
				if (success.status === 200) {
					$uibModalInstance.close({
						orderLimit: success.data[0].order_limit,
						avatar: success.data[1].avatar,
						barName: success.data[2].bar_name,
						address: success.data[3].address
					});
				} else {
					$log.error(success)
				}
			}, function(error) {
				$log.error(error);
			});
		};

		this.cancel = function() {
			$uibModalInstance.dismiss();
		};
	});