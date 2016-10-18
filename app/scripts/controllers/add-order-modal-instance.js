'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:AddOrderModalInstanceCtrl
 * @description
 * # AddOrderModalInstanceCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
	.controller('AddOrderModalInstanceCtrl', function($log, $uibModalInstance, $auth, $timeout, Catalog, deviceDetector, Orders) {

		var self = this,
			i = 0;

		this.modal = {};

		this.catalog = {
			list: [],
			pagination: {
				currentPage: 1,
				sizePage: 20,
				maxSize: 5,
				totalResults: 1,
				totalPages: 1
			},
			show: false,
			criterion: {
				text: '',
				focus: true
			}
		};

		this.displayCatalog = function(keyword, sizePage, numPage) {
			self.catalog.list = [];

			Catalog.query({
				keyword: keyword,
				sizePage: sizePage,
				numPage: numPage,
				token: $auth.getToken()
			}, function(success) {
				$log.log(success);
				if (success.status === 200) {
					self.catalog.pagination.totalPages = success.totalPages;
					self.catalog.pagination.totalResults = success.totalResults;

					for (i = 0; i < success.data.length; i++) {
						if (success.data[i].active === '1') {
							self.catalog.list.push({
								id: success.data[i].id,
								title: success.data[i].title,
								url: success.data[i].url,
								active: success.data[i].active,
								addButton: {
									disabled: false,
									successPopover: {
										show: false,
										text: ''
									}
								}
							});
						}
					}
				} else {
					$log.error(success);
				}

			}, function(error) {
				$log.log(error);
			});
		};

		this.addOrder = function(idKaraoke, index) {

			self.catalog.list[index].addButton.disabled = true;

			Orders.save({
				token: $auth.getToken(),
				code_client: 'DJ',
				message: '',
				order: [{
					id_karaoke: idKaraoke,
					origin: deviceDetector.os
				}]
			}, function(success) {
				$log.log(success);
				self.catalog.list[index].addButton.successPopover.show = true;
				$timeout(function() {
					self.catalog.list[index].addButton.disabled = false;
					self.catalog.list[index].addButton.successPopover.show = false;
				}, 3000);
				if (success.status === 200) {
					// Si el pedido se agregó
					if (success.data[0].add_order) {
						self.catalog.list[index].addButton.successPopover.text = 'Agregado';
					} else {
						self.catalog.list[index].addButton.successPopover.text = 'No se agregó porque ya está pedido';
					}
				} else if (success.status === 406) {
					self.catalog.list[index].addButton.successPopover.text = 'No se pueden hacer más pedidos';
				} else {
					$log.error(success);
				}
			}, function(error) {
				$log.log(error);
			});
		};

		this.cancel = function() {
			$uibModalInstance.dismiss();
		};

	});