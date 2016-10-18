'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
	.controller('HomeCtrl', function($auth, $log, $uibModal, Utils, Orders, OrdersLimit, Settings) {

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
			btnGroup: {
				show: true,
				lockUnlock: {
					text: 'Bloquear'
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

		this.getSettings = function() {
			Settings.query({
				token: $auth.getToken()
			}, function(success) {
				// $log.log(success);
				if (success.status === 200) {
					self.bar.info.avatar = success.data.avatar;
					self.bar.info.ordersLimit = parseInt(success.data.order_limit);
					if (self.bar.info.ordersLimit === 0) {
						self.orders.btnGroup.lockUnlock.text = 'Desbloquear';
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
				$log.log(success);
				if (success.status === 200) {
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
					$log.error(success);
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
				$log.log(success);
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
						}
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
					}
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
				self.orders.btnGroup.lockUnlock.text = 'Bloquear';
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
						}
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
					self.orders.btnGroup.lockUnlock.text = 'Desbloquear';
				} else {
					$log.error(success);
				}
			}, function(error) {
				$log.error(error);
			});
		};

		self.getOrders();
		self.getSettings();

	});