'use strict';

/**
 * @ngdoc function
 * @name karamuseDjApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the karamuseDjApp
 */
angular.module('karamuseDjApp')
	.controller('HomeCtrl', function($rootScope, $q, $auth, $state, $timeout, $log, $uibModal, Utils, Orders, OrdersLimit, Settings, CodesDj, VerifyCodes, Catalog, Session) {
		var self = this,
			i = 0,
			deferred = null;

		this.bar = {
			info: {
				avatar: {
					url: '',
					show: false
				},
				name: Utils.getInStorage('name'),
				address: Utils.getInStorage('address'),
				ordersLimit: null,
				textAd: Utils.getInStorage('text_ad'),
				bannerAd: Utils.getInStorage('banner_ad')
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
						show: true,
						icon: 'lock',
						tooltip: 'Bloquear pedidos'
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
			list: [],
			buttons: {
				more: {
					disabled: true
				}
			}
		};

		this.catalog = {
			artist: {
				text: ''
			},
			song: {
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
					self.bar.info.avatar.url = success.data.avatar || 'http://www.hsdtaxlaw.com/wp-content/uploads/2016/05/logo_placeholder.png';
					self.bar.info.ordersLimit = parseInt(success.data.order_limit);
					self.bar.info.bannerAd = success.data.banner_ad;
					self.bar.info.textAd = success.data.text_ad;
					if (self.bar.info.ordersLimit === 0) {
						self.orders.btnGroup.buttons.lockUnlock.tooltip = 'Desbloquear pedidos';
						self.orders.btnGroup.buttons.lockUnlock.icon = 'lock';
					}
				} else if (success.status === 401) {
					$log.error(success);
					Utils.gotoState('login');
				}
			}, function(error) {
				$log.log(error);
			});
		};

		this.openModalEditData = function(data) {
			data.totalOrders = self.orders.list.length;

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
				self.bar.info.avatar.url = data.avatar;
				self.bar.info.name = data.barName;
				self.bar.info.address = data.address;
				self.bar.info.ordersLimit = data.orderLimit;
			}, function() {});
		};

		$rootScope.getOrders = function() {
			self.orders.list = [];
			$rootScope.loader.show = true;

			Orders.query({
				idOrder: '',
				token: $auth.getToken()
			}, function(success) {
				// $log.log(success);
				$rootScope.loader.show = false;

				if (success.status === 200) {
					self.orders.btnGroup.buttons.search.show = true;
					self.orders.show = true;
					self.orders.total = success.total;

					for (i = 0; i < success.data.length; i++) {
						self.orders.list.push({
							id: success.data[i].id,
							ticket: success.data[i].ticket,
							artist: success.data[i].artist,
							song: success.data[i].song,
							createdAt: new Date(success.data[i].created_at),
							state: success.data[i].state,
							origin: success.data[i].origin,
							codeClient: success.data[i].code_client,
							url: success.data[i].url,
							time: '00:04:00',
							message: success.data[i].message ? success.data[i].message : '-'
						});
					}
				} else if (success.status === 401) {
					// No autorizado
					$log.error(success);
					Utils.gotoState('login');
				} else if (success.status === 402) {
					// No hay sesiones abiertas
					$log.error(success);
				} else {
					// $log.error(success);
					self.orders.btnGroup.buttons.search.show = false;
					self.orders.show = false;
				}
			}, function(error) {
				$log.error(error);
			});
		};

		this.openModalOrderInfo = function(data, idx) {

			var firstOrders = [];

			for (i = 0; i < idx; i++) {
				firstOrders.push(self.orders.list[i]);
			}

			data.index = idx;
			data.firstOrders = firstOrders;

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
			deferred = $q.defer();
			$rootScope.loader.show = true;

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
				$rootScope.loader.show = false;

				if (success.status === 200) {
					deferred.resolve({
						status: 200
					});
					$rootScope.getOrders();
				} else {
					deferred.reject({
						status: success.status
					});
				}
			}, function(error) {
				$log.log(error);
				deferred.reject({
					status: 400
				});
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
						function: null,
						show: false
					}
				});
			});

			return deferred.promise;
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
					function: null,
					show: true
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
				self.orders.btnGroup.buttons.lockUnlock.tooltip = 'Bloquear pedidos';
				self.orders.btnGroup.buttons.lockUnlock.icon = 'unlock';
			}, function() {});
		};

		this.lockUnlockOrders = function() {
			// Si están bloqueados los pedidos:
			if (self.bar.info.ordersLimit === 0) {
				var minOrdersLimit = self.orders.list.length;
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
						function: null,
						show: true
					}
				});
			}
		};

		this.setOrdersLimit = function(limit) {
			deferred = $q.defer();

			// Cambiar este servicio por el de setear orders limit

			Settings.update({
				setting: 'order_limit',
				value: limit,
				token: $auth.getToken()
			}, function(success) {
				if (success.status === 200) {
					deferred.resolve({
						status: 200
					});
					self.bar.info.ordersLimit = limit;
					self.orders.btnGroup.buttons.lockUnlock.icon = 'lock';
					self.orders.btnGroup.buttons.lockUnlock.tooltip = 'Desbloquear pedidos';
				} else {
					deferred.reject({
						status: success.status
					});
				}
			}, function(error) {
				$log.error(error);
				deferred.reject({
					status: 400
				});
			});

			return deferred.promise;
		};

		this.getCodes = function() {

			self.codes.list = [];

			VerifyCodes.verify({
				token: $auth.getToken()
			}, function(success) {
				// $log.log(success);
				if (success.status === 200) {
					self.codes.list = success.data;
					self.codes.buttons.more.disabled = false;
					for (i = 0; i < self.codes.list.length; i++) {
						self.codes.list[i].popover = {
							text: '',
							show: false
						};
					}
				} else if (success.status === 201) {
					$log.error('Sesión no tiene códigos');
				} else if (success.status === 202) {
					$log.error('No hay sesiones abiertas para este bar');
				} else if (success.status === 401) {
					$log.error(success);
					Utils.gotoState('login');
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

			CodesDj.update({
				token: $auth.getToken(),
				action: code,
				subAction: 'state',
				value: newState
			}, function(success) {
				// $log.log(success);
				if (success.status === 200) {
					self.codes.list[index].state = newState;
					if (newState === '1') {
						self.codes.list[index].popover.text = 'El código está disponible';
					} else if (newState === '2') {
						self.codes.list[index].popover.text = 'El código está bloqueado';
					} else if (newState === '0') {
						self.codes.list[index].popover.text = 'El código está inactivo';
					}
					self.codes.list[index].popover.show = true;
					$timeout(function() {
						self.codes.list[index].popover.show = false;
					}, 3000);
				} else {
					$log.error(success);
				}
			}, function(error) {
				$log.error(error);
			});
		};

		this.openModalGenerateCodes = function(data) {
			var modalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'generate-codes.html',
				controller: 'GenerateCodesModalInstanceCtrl',
				controllerAs: 'generateCodes',
				size: 'md',
				resolve: {
					data: function() {
						return data;
					}
				}
			});

			modalInstance.result.then(function() {
				self.getCodes();
			}, function() {
				// $log.log('dismiss');
			});
		};

		this.saveKaraoke = function(artist, song, url) {
			self.catalog.buttons.send.disabled = true;

			Catalog.save({
				token: $auth.getToken(),
				artist: artist,
				song: song,
				url: url
			}, function(success) {
				// $log.log(success);
				self.catalog.buttons.send.disabled = false;
				if (success.status === 200) {
					self.catalog.artist.text = '';
					self.catalog.song.text = '';
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
							function: null,
							show: true
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
							function: null,
							show: true
						}
					});
				} else if (success.status === 400) {
					self.openModalDialog({
						title: 'Houston, tenemos un problema...',
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
							function: null,
							show: true
						}
					});
				}
			}, function(error) {
				$log.error(error);
				self.openModalDialog({
					title: 'Houston, tenemos un problemita...',
					subtitle: '¡No se qué pasó!, pero tu karaoke no pudo ser enviado :( ... Si el problema persiste escríbenos a karamuseDjApp@gmail.com',
					submit: {
						text: 'Reintentar',
						function: function() {
							return self.saveKaraoke(artist, song, url);
						},
						show: true
					},
					cancel: {
						text: 'Cancelar',
						function: null,
						show: true
					}
				});
			});
		};

		this.logout = function() {

			self.openModalDialog({
				title: '¿Deseas cerrar sesión?',
				subtitle: 'Con esta acción ya no podrás ver los pedidos de esta sesión',
				submit: {
					text: 'Cerrar sesión',
					function: function() {
						return closeSession();
					},
					show: true
				},
				cancel: {
					text: 'Cancelar',
					function: null,
					show: true
				}
			});

		};

		var closeSession = function() {

			Session.save({
				action: 'close',
				token: $auth.getToken()
			}, function(success) {
				if (success.status === 200 || success.status === 201) {
					$state.go('login');
				} else {
					deferred.reject();
				}
			}, function(error) {
				$log.error(error);
			});

		};

		$rootScope.getOrders();
		self.getSettings();
		self.getCodes();

	});