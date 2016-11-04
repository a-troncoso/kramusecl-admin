'use strict';

/**
 * @ngdoc function
 * @name karamuseDjApp.controller:EditDataModalInstanceCtrl
 * @description
 * # EditDataModalInstanceCtrl
 * Controller of the karamuseDjApp
 */
angular.module('karamuseDjApp')
	.controller('EditDataModalInstanceCtrl', function($rootScope, $log, $uibModalInstance, $auth, data, Settings) {

		var self = this;

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
				avatar: data.avatar.url,
				totalOrders: {
					value: parseInt(data.totalOrders) + 1,
					max: 60,
					min: parseInt(data.totalOrders) + 1,
					current: parseInt(data.totalOrders)
				}
			}
		};

		this.editData = function(data) {
			self.modal.buttons.save.disabled = true;
			$rootScope.loader.show = true;

			Settings.update({
				token: $auth.getToken(),
				avatar: data.avatar,
				order_limit: data.totalOrders.value,
				bar_name: data.name,
				address: data.address
			}, function(success) {
				// $log.log(success);
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
					$log.error(success);
				}
			}, function(error) {
				$log.error(error);
			});
		};

		this.cancel = function() {
			$uibModalInstance.dismiss();
		};
	});