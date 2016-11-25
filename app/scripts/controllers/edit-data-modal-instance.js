'use strict';

/**
 * @ngdoc function
 * @name karamuseDjApp.controller:EditDataModalInstanceCtrl
 * @description
 * # EditDataModalInstanceCtrl
 * Controller of the karamuseDjApp
 */
angular.module('karamuseDjApp')
	.controller('EditDataModalInstanceCtrl', function($rootScope, $log, $uibModalInstance, $auth, Settings) {

		var self = this;

		this.modal = {
			title: {
				text: 'Editar los datos del bar',
				show: true
			},
			subtitle: {
				text: null,
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
				name: '',
				address: '',
				avatar: '',
				totalOrders: {
					value: 0,
					max: 60,
					min: 0,
					current: 0,
					message: {
						text: '',
						show: false
					}
				},
				textAd: '',
				bannerAd: ''
			}
		};

		this.getSettings = function() {
			$rootScope.loader.show = true;

			Settings.get({
				token: $auth.getToken()
			}, function(success) {
				if (success.status === 200) {
					self.bar.data.name = success.data.name;
					self.bar.data.address = success.data.address;
					self.bar.data.avatar = success.data.avatar;
					self.bar.data.totalOrders.value = parseInt(success.data.order_limit);
					self.bar.data.totalOrders.min = parseInt(success.data.order_limit);
					self.bar.data.totalOrders.current = parseInt(success.data.order_limit);
					self.bar.data.textAd = success.data.text_ad;
					self.bar.data.bannerAd = success.data.banner_ad;
				} else if (success.status === 404) {
					$log.error(success);
					self.openModalDialog({
						title: 'No encontramos datos',
						subtitle: 'Tu bar no tiene datos de configuración',
						submit: {
							show: false,
							text: '',
							function: function() {}
						},
						cancel: {
							text: 'Cerrar',
							function: function() {
								$uibModalInstance.close();
							},
							show: true
						}
					});
				}
				$rootScope.loader.show = false;
			}, function(error) {
				$log.log(error);
			});
		};

		this.editData = function(data) {
			self.modal.buttons.save.disabled = true;
			$rootScope.loader.show = true;
			self.bar.data.totalOrders.message.show = false;

			Settings.update({
				token: $auth.getToken(),
				avatar: data.avatar,
				order_limit: data.totalOrders.value,
				bar_name: data.name,
				address: data.address,
				text_ad: data.textAd,
				banner_ad: data.bannerAd
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
				} else if (success.status === 406) {
					self.bar.data.totalOrders.message.show = true;
					self.bar.data.totalOrders.message.text = 'Debes permtir ' + success.minValue + ' pedidos como mínimo.' ;
				} else {
					$log.error(success);
				}
			}, function(error) {
				$log.error(error);
			});
		};

		this.openModalDialog = function(data) {
			var modalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'dialog.html',
				controller: 'DialogModalInstanceCtrl',
				controllerAs: 'dialogModal',
				size: 'md',
				resolve: {
					data: function() {
						return data;
					}
				}
			});

			modalInstance.result.then(function() {}, function() {});
		};

		this.cancel = function() {
			$uibModalInstance.dismiss();
		};

		self.getSettings();
	});