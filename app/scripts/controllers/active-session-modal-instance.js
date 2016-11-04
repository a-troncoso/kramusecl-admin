'use strict';

/**
 * @ngdoc function
 * @name karamuseDjApp.controller:ActiveSessionModalInstanceCtrl
 * @description
 * # ActiveSessionModalInstanceCtrl
 * Controller of the karamuseDjApp
 */
angular.module('karamuseDjApp')
	.controller('ActiveSessionModalInstanceCtrl', function($rootScope, $log, $q, $uibModalInstance, $uibModal, $state, $auth, success, deviceDetector, Session, Codes, Utils) {

		var self = this,
			deferred = null;

		this.modal = {
			session: {
				data: {
					createdAt: new Date(success.data.data.session.created_at)
				}
			},
			buttons: {
				createNew: {
					disabled: false
				},
				follow: {
					disabled: false
				}
			}
		};

		this.follow = function() {
			self.modal.buttons.follow.disabled = true;
			$rootScope.loader.show = true;
			$uibModalInstance.dismiss();

			var verifyCodes = self.verifyCodes();

			verifyCodes.then(function(success) {
				// $log.log(success);
				$rootScope.loader.show = false;
				if (success.status === 200) {
					Utils.setInStorage('codes', success.codes);
					$state.go('home');
				} else if (success.status === 201) {
					$uibModalInstance.dismiss();
					self.openModalGenerateCodes({
						value: 0
					});
				} else if (success.status === 202) {
					self.openModalDialog({
						title: '¡Vaya, vaya!',
						subtitle: 'No tienes una sesión abierta',
						submit: {
							text: 'Abrir sesión',
							function: function() {
								return self.openSession();
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
			});
		};

		this.openSession = function() {

			$rootScope.loader.show = true;
			self.modal.buttons.createNew.disabled = true;
			var closeSession = self.closeSession();

			closeSession.then(function() {

				Session.save({
					action: 'open',
					origin: deviceDetector.os + '/' + deviceDetector.browser + '/' + deviceDetector.browser_version,
					token: $auth.getToken()
				}, function(success) {
					$log.log(success);
					if (success.status === 200 || success.status === 201) {
						var verifyCodes = self.verifyCodes();
						verifyCodes.then(function(success) {
							$rootScope.loader.show = false;
							if (success.status === 200) {
								$state.go('home');
							} else if (success.status === 201) {
								$uibModalInstance.dismiss();
								self.openModalGenerateCodes({
									value: 0
								});
							} else if (success.status === 202) {
								self.openModalDialog({
									title: '¡Vaya, vaya!',
									subtitle: 'No tienes una sesión abierta',
									submit: {
										text: 'Abrir sesión',
										function: function() {
											return self.openSession();
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
							$rootScope.loader.show = false;
							self.openModalDialog({
								title: ':(',
								subtitle: 'Tuvimos problemas al cargar tu información',
								submit: {
									text: 'Reintentar',
									function: function() {
										return self.openSession();
									},
									show: true
								},
								cancel: {
									text: 'Cancelar',
									function: null
								}
							});
						});
					} else {
						self.modal.buttons.createNew.disabled = false;
						$log.info('Se abre sesión: ERROR');
					}
				}, function(error) {
					$log.error(error);
				});
			}, function(error) {
				$log.error(error);
				self.openModalDialog({
					title: 'Wow!',
					subtitle: 'Ocurrió un problema al cerrar la sesión anterior',
					submit: {
						text: 'Reintentar',
						function: function() {
							return self.openSession();
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

		this.closeSession = function() {

			deferred = $q.defer();

			Session.save({
				action: 'close',
				token: $auth.getToken()
			}, function(success) {
				if (success.status === 200 || success.status === 201) {
					deferred.resolve();
					$log.info('Se cierra sesión: OK');
				} else {
					deferred.reject();
					$log.info('Se cierra sesión: ERROR');
				}
			}, function(error) {
				$log.error(error);
				deferred.reject();
				$log.info('Se cierra sesión: ERROR');
			});
			return deferred.promise;
		};

		this.verifyCodes = function() {
			deferred = $q.defer();

			Codes.verify({
				action: 'verify',
				token: $auth.getToken()
			}, function(success) {
				// $log.log(success);
				deferred.resolve({
					status: success.status
				});
			}, function(error) {
				$log.error(error);
				deferred.reject({
					status: 'some error',
					codes: []
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

			modalInstance.result.then(function() {}, function() {});
		};

	});