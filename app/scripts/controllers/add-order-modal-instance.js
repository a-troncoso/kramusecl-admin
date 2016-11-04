'use strict';

/**
 * @ngdoc function
 * @name karamuseDjApp.controller:AddOrderModalInstanceCtrl
 * @description
 * # AddOrderModalInstanceCtrl
 * Controller of the karamuseDjApp
 */
angular.module('karamuseDjApp')
	.controller('AddOrderModalInstanceCtrl', function($rootScope, $log, $uibModalInstance, $auth, $timeout, Catalog, deviceDetector, Orders) {

		var self = this,
			i = 0;

		this.modal = {
			loader: {
				show: false
			},
			messages: {
				catalog: {
					text: '',
					show: false
				}
			}
		};

		this.catalog = {
			list: [],
			pagination: {
				show: false,
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
			self.modal.loader.show = true;
			self.catalog.list = [];
			self.catalog.pagination.show = false;
			self.modal.messages.catalog.show = false;

			Catalog.query({
				keyword: keyword,
				sizePage: sizePage,
				numPage: numPage,
				token: $auth.getToken()
			}, function(success) {
				// $log.log(success);
				self.modal.loader.show = false;
				if (success.status === 200) { // 200 = hay resultados
					self.catalog.pagination.totalPages = success.totalPages;
					self.catalog.pagination.totalResults = success.totalResults;
					self.catalog.pagination.show = true;

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
				} else if (success.status === 404) {
					// $log.error(success);
					self.modal.messages.catalog.text = 'No encontramos karaokes :('; // 404 = no hay resultados
					self.modal.messages.catalog.show = true;
				}
			}, function(error) {
				$log.error(error);
				self.modal.loader.show = false;
				self.openModalDialog({
					title: 'Houston, tenemos un problema...',
					subtitle: 'Ha ocurrido un error al buscar tus karaokes D:',
					submit: {
						text: 'Reintentar',
						function: function() {
							return self.displayCatalog(self.catalog.criterion.text, self.catalog.pagination.sizePage, self.catalog.pagination.currentPage);
						},
						show: true
					},
					cancel: {
						text: 'Cancelar',
						function: null
					}
				});
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
				// $log.log(success);
				self.catalog.list[index].addButton.successPopover.show = true;
				$timeout(function() {
					self.catalog.list[index].addButton.disabled = false;
					self.catalog.list[index].addButton.successPopover.show = false;
				}, 3000);
				if (success.status === 200) {
					// Si el pedido se agregó
					if (success.data[0].add_order) {
						self.catalog.list[index].addButton.successPopover.text = 'Agregado';
						$rootScope.getOrders();
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