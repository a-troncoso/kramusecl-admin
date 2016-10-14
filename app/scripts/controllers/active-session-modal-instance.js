'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:ActiveSessionModalInstanceCtrl
 * @description
 * # ActiveSessionModalInstanceCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
	.controller('ActiveSessionModalInstanceCtrl', function($rootScope, $log, $q, $uibModalInstance, $uibModal, $state, $auth, success, deviceDetector, Session, Codes
		) {

		var self = this, data = {}, deferred = null;

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
			$uibModalInstance.close();

			var verifyCodes = self.verifyCodes();

			verifyCodes.then(function(success) {
				$log.log('success');
				$log.log(success);
				if (success.status === 200) {
					$state.go('home');
				} else if (success.status === 201) {
					$uibModalInstance.close();
					self.openModalGenerateCodes();
				} else if(success.status === 202) {
					self.openModalDialog({
						title: '¡Vaya, vaya!',
						subtitle: 'No tienes una sesión abierta',
						submit: {
							text: 'Abrir sesión',
							function: function() {
								return self.openSession();
							}
						},
						cancel: {
							text: 'Cancelar',
							function:  null
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
				
				data = {
					action: 'open',
					origin: deviceDetector.os + '/' + deviceDetector.browser + '/' + deviceDetector.browser_version,
					token: $auth.getToken()
				};

				Session.save(data, function(success){
					if (success.status === 200 || success.status === 201) {
						$log.info('Se abre sesión: OK');
						var verifyCodes = self.verifyCodes();
						verifyCodes.then(function(success) {
							$log.log('success');
							$log.log(success);
							$rootScope.loader.show = false;
							if (success.status === 200) {
								$state.go('home');
							} else if (success.status === 201) {
								$uibModalInstance.close();
								self.openModalGenerateCodes();
							} else if(success.status === 202) {
								self.openModalDialog({
									title: '¡Vaya, vaya!',
									subtitle: 'No tienes una sesión abierta',
									submit: {
										text: 'Abrir sesión',
										function: function() {
											return self.openSession();
										}
									},
									cancel: {
										text: 'Cancelar',
										function:  null
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
									}
								},
								cancel: {
									text: 'Cancelar',
									function:  null
								}
							});
						});
					} else {
						self.modal.buttons.createNew.disabled = false;
						$log.info('Se abre sesión: ERROR');
					}
				}, function(error){
					$log.error(error);
					$log.info('Se abre sesión: ERROR');
				});
			}, function() {
				self.openModalDialog({
					title: 'Wow!',
					subtitle: 'Ocurrió un problema al cerrar la sesión anterior',
					submit: {
						text: 'Reintentar',
						function: function() {
							return self.openSession();
						}
					},
					cancel: {
						text: 'Cancelar',
						function:  null
					}
				});
			});
		};
		
		this.closeSession = function() {

			deferred = $q.defer();
			
			data = {
				action: 'close',
				token: $auth.getToken()
			};

			Session.save(data, function(success){
				if (success.status === 200 || success.status === 201) {
					deferred.resolve();
					$log.info('Se cierra sesión: OK');
				} else {
					deferred.reject();
					$log.info('Se cierra sesión: ERROR');
				}
			}, function(error){
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
				deferred.resolve({status: success.status});			
				$log.log(success);
			}, function(error) {
				deferred.reject({status: 'some error'});
				$log.error(error);
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

			modalInstance.result.then(function () {}, function () {});
		};

		this.openModalGenerateCodes = function() {
			var modalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'generate-codes.html',
				controller: 'GenerateCodesModalInstanceCtrl',
				controllerAs: 'generateCodes',
				size: 'md',
				resolve: {}
			});

			modalInstance.result.then(function () {}, function () {});
		};

	});