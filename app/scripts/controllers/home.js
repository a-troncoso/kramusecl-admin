'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
	.controller('HomeCtrl', function($auth, $log, $uibModal, Utils, Orders, OrdersLimit, Settings, Codes, Catalog) {

		var self = this,
			i = 0;

		this.page = {

		};

		this.bar = {
			info: {
				avatar: '',
				name: Utils.getInStorage('name'),
				address: Utils.getInStorage('address'),
				ordersLimit: 0
			}
		};

		this.orders = {
			list: [],
			total: 0,
			show: true,
			btnGroup: {
				show: true,
				buttons: {
					search: {
						show: true
					},
					reload: {
						show: true
					},
					order: {
						show: true
					},
					lockUnlock: {
						text: 'Bloquear',
						show: true
					}
				}
			},
			search: {
				title: {
					text: ''
				},
				focus: false,
				show: false
			}
		};

		this.codes = {
			list: []
		};

		this.catalog = {
			title: {
				text: ''
			},
			url: {
				text: ''
			},
			buttons: {
				send: {
					disabled: false
				}
			}
		};

		this.getSettings = function() {
			Settings.query({
				token: $auth.getToken()
			}, function(success) {
				// $log.log(success);
				if (success.status === 200) {
					self.bar.info.avatar = success.data.avatar;
					self.bar.info.ordersLimit = parseInt(success.data.order_limit);
					if (self.bar.info.ordersLimit === 0) {
						self.orders.btnGroup.buttons.lockUnlock.text = 'Desbloquear';
					}
				}
			}, function(error) {
				$log.log(error);
			});
		};

		this.openModalEditData = function(data) {
			var modalInstance = $uibModal.open({
				animation: true,
				backdrop: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'edit-data.html',
				controller: 'EditDataModalInstanceCtrl',
				controllerAs: 'editData',
				size: 'md',
				resolve: {
					data: function() {
						return data;
					}
				}
			});

			modalInstance.result.then(function(data) {
				self.bar.info.avatar = data.avatar;
				self.bar.info.name = data.barName;
				self.bar.info.address = data.address;
				self.bar.info.ordersLimit = data.orderLimit;
			}, function() {});
		};

		this.getOrders = function() {
			self.orders.list = [];

			Orders.query({
				idOrder: '',
				token: $auth.getToken()
			}, function(success) {
				// $log.log(success);
				if (success.status === 200) {
					self.orders.btnGroup.buttons.search.show = true;
					self.orders.show = true;
					self.orders.total = success.total;

					for (i = 0; i < success.data.length; i++) {
						self.orders.list.push({
							id: success.data[i].id,
							ticket: success.data[i].ticket,
							title: success.data[i].title,
							createdAt: new Date(success.data[i].created_at),
							state: success.data[i].state,
							origin: success.data[i].origin,
							codeClient: success.data[i].code_client,
							url: success.data[i].url,
							time: success.data[i].time
						});
					}
				} else {
					// $log.error(success);
					self.orders.btnGroup.buttons.search.show = false;
					self.orders.show = false;
				}
			}, function(error) {
				$log.log(error);
			});
		};

		this.openModalOrderInfo = function(data) {
			var modalInstance = $uibModal.open({
				animation: true,
				backdrop: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'order-info.html',
				controller: 'OrderInfoModalInstanceCtrl',
				controllerAs: 'orderInfo',
				size: 'md',
				resolve: {
					orderData: function() {
						return data;
					}
				}
			});

			modalInstance.result.then(function() {}, function() {});
		};

		this.changeOrderState = function(idOrder, action) {
			var newState;
			if (action === 'switchToReady') {
				newState = 1;
			} else if (action === 'switchToPending') {
				newState = 0;
			} else if (action === 'remove') {
				newState = 2;
			}

			Orders.update({
				idOrder: idOrder,
				state: newState,
				token: $auth.getToken()
			}, function(success) {
				// $log.log(success);
				if (success.status === 200) {
					self.getOrders();
				}
			}, function(error) {
				$log.log(error);
				self.openModalDialog({
					title: 'Tenemos un problemita...',
					subtitle: 'Ha ocurrido un error al actualizar el pedido',
					submit: {
						text: 'Reintentar',
						function: function() {
							return self.changeOrderState(idOrder, action);
						},
						show: false
					},
					cancel: {
						text: 'Cancelar',
						function: null
					}
				});
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

		this.deleteOrder = function(idOrder, action) {
			self.openModalDialog({
				title: '¿Deseas eliminar este pedido?',
				subtitle: '',
				submit: {
					text: 'Eliminar',
					function: function() {
						return self.changeOrderState(idOrder, action);
					},
					show: true
				},
				cancel: {
					text: 'Cancelar',
					function: null
				}
			});
		};

		this.openModalAddOrder = function() {
			var modalInstance = $uibModal.open({
				animation: true,
				backdrop: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'add-order.html',
				controller: 'AddOrderModalInstanceCtrl',
				controllerAs: 'addOrder',
				size: 'md',
				resolve: {}
			});

			modalInstance.result.then(function() {}, function() {});
		};

		this.openModalOrdersLimit = function(data) {
			var modalInstance = $uibModal.open({
				animation: true,
				backdrop: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'orders-limit.html',
				controller: 'OrdersLimitModalInstanceCtrl',
				controllerAs: 'ordersLimit',
				size: 'md',
				resolve: {
					data: function() {
						return data;
					}
				}
			});

			modalInstance.result.then(function(data) {
				self.bar.info.ordersLimit = data.newOrdersLimit;
				self.orders.btnGroup.buttons.lockUnlock.text = 'Bloquear';
			}, function() {});
		};

		this.lockUnlockOrders = function() {
			// Si están bloqueados los pedidos:
			if (self.bar.info.ordersLimit === 0) {
				var minOrdersLimit = self.orders.total;
				self.openModalOrdersLimit({
					ordersLimit: minOrdersLimit
				});
			} else {
				self.openModalDialog({ // Si estan desbloqueados los pedidos:
					title: '¿Deseas bloquear los pedidos?',
					subtitle: 'Con esta acción ya no recibirás más pedidos',
					submit: {
						text: 'Bloquear',
						function: function() {
							return self.setOrdersLimit(0);
						},
						show: true
					},
					cancel: {
						text: 'Cancelar',
						function: null
					}
				});
			}
		};

		this.setOrdersLimit = function(limit) {

			Settings.update({
				order_limit: limit,
				token: $auth.getToken()
			}, function(success) {
				if (success.status === 200) {
					self.bar.info.ordersLimit = limit;
					self.orders.btnGroup.buttons.lockUnlock.text = 'Desbloquear';
				} else {
					$log.error(success);
				}
			}, function(error) {
				$log.error(error);
			});
		};

		this.getCodes = function() {
			Codes.verify({
				token: $auth.getToken(),
				action: 'verify'
			}, function(success) {
				$log.log(success);
				if (success.status === 200) {
					self.codes.list = success.data;
				} else {
					$log.error(success);
				}
			}, function(error) {
				$log.error(error);
			});
		};

		this.updateCodeState = function(code, state, index) {
			var newState;

			if (state === '0') {
				newState = '1';
			} else if (state === '1') {
				newState = '2';
			} else if (state === '2') {
				newState = '0';
			}

			Codes.update({
				token: $auth.getToken(),
				action: code,
				subAction: 'state',
				value: newState
			}, function(success) {
				// $log.log(success);
				if (success.status === 200) {
					self.codes.list[index].state = newState;
				} else {
					$log.error(success);
				}
			}, function(error) {
				$log.error(error);
			});
		};

		this.saveKaraoke = function(title, url) {
			self.catalog.buttons.send.disabled = true;

			Catalog.save({
				token: $auth.getToken(),
				title: title,
				url: url
			}, function(success) {
				// $log.log(success);
				self.catalog.buttons.send.disabled = false;
				if (success.status === 200) {
					self.catalog.title.text = '';
					self.catalog.url.text = '';

					self.openModalDialog({
						title: '¡Gracias!',
						subtitle: 'Estamos revisando tu karaoke',
						submit: {
							text: '',
							function: function() {
								return null;
							},
							show: false
						},
						cancel: {
							text: 'Cerrar',
							function: null
						}
					});
				} else if (success.status === 201) {
					self.openModalDialog({
						title: 'Paciencia por favor...',
						subtitle: 'Estamos revisando tu karaoke, pronto estará disponible',
						submit: {
							text: '',
							function: function() {
								return null;
							},
							show: false
						},
						cancel: {
							text: 'Cerrar',
							function: null
						}
					});
				} else if (success.status === 400) {
					self.openModalDialog({
						title: 'Houston, tenemos un problemita...',
						subtitle: '¡No se qué pasó!, pero tu karaoke no pudo ser enviado :(',
						submit: {
							text: 'Reintentar',
							function: function() {
								return self.saveKaraoke(title, url);
							},
							show: true
						},
						cancel: {
							text: 'Cancelar',
							function: null
						}
					});
				}
			}, function(error) {
				$log.error(error);
				self.openModalDialog({
					title: 'Houston, tenemos un problemita...',
					subtitle: '¡No se qué pasó!, pero tu karaoke no pudo ser enviado :( ... Si el problema persiste escríbenos a karamuseapp@gmail.com',
					submit: {
						text: 'Reintentar',
						function: function() {
							return self.saveKaraoke(title, url);
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

		self.getOrders();
		self.getSettings();
		self.getCodes();

	});