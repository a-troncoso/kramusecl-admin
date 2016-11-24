'use strict';

/**
 * @ngdoc function
 * @name karamuseDjApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the karamuseDjApp
 */
angular.module('karamuseDjApp')
	.controller('LoginCtrl', function($rootScope, $log, $auth, $q, $location, $uibModal, $state, deviceDetector, Utils, Session, VerifyCodes) {

		var self = this,
			deferred = null;

		this.page = {
			progressCursor: false,
			messages: {
				loginResponse: {
					show: false,
					title: {
						color: '',
						text: '',
						show: false
					},
					subtitle: {
						color: '',
						text: '',
						show: false
					}
				}
			},
			buttons: {
				login: {
					disabled: false
				}
			}
		};

		this.user = {
			data: {
				email: 'nicolascanto1@gmail.com',
				password: '123',
				origin: deviceDetector.os + '/' + deviceDetector.browser + '/' + deviceDetector.browser_version
			}
		};

		var data = {};

		this.login = function() {

			data = self.user.data;
			self.page.buttons.login.disabled = true;
			self.page.progressCursor = true;
			$rootScope.loader.show = true;
			self.page.messages.loginResponse.show = false;
			self.page.messages.loginResponse.title.text = '';
			self.page.messages.loginResponse.subtitle.text = '';

			$auth.login(data)
				.then(function(success) {
					// $log.log(success);
					self.page.progressCursor = false;
					if (success.data.status === 200) {
						self.page.buttons.login.disabled = false;
						$auth.setToken(success.data.data.token);
						Utils.setInStorage('email', success.data.data.email);
						Utils.setInStorage('perfil_pic', success.data.data.avatar);
						Utils.setInStorage('name', success.data.data.name);
						Utils.setInStorage('address', success.data.data.address);
						self.page.messages.loginResponse.show = true;
						if (success.data.data.session.active) {
							self.openModalActiveSession(success);
						} else {
							// ABRO sesion
							var openSession = self.openSession();
							openSession.then(function(success) {
								if (success.status === 200) {
									// Si abrió sesión correctamente, verifica si la sesión tiene códigos
									var verifyCodes = self.verifyCodes();
									verifyCodes.then(function(success) {
										$rootScope.loader.show = false;
										if (success.status === 200) {
											// si tiene codigos, va al home
											Utils.gotoState('home');
										} else if (success.status === 201) {
											// si no tiene codigos los solicita
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
													function: null
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
								} else if (success.status === 201) {
									self.openModalActiveSession(success);
								}
							}, function(error2) {
								$log.error(error2);
								self.page.buttons.login.disabled = false;
								self.page.messages.loginResponse.show = true;
								self.page.messages.loginResponse.title.text = 'No pudimos abrir una nueva sesión, por favor vuelve a intentar';
								self.page.messages.loginResponse.title.color = 'danger';
							});
						}
					} else if (success.data.status === 401) {
						self.page.buttons.login.disabled = false;
						self.page.messages.loginResponse.show = true;
						self.page.messages.loginResponse.title.text = 'Usuario y/o password incorrectos';
						self.page.messages.loginResponse.title.color = 'danger';
					} else if (success.data.status === 404) {
						self.page.buttons.login.disabled = false;
						self.page.messages.loginResponse.show = true;
						self.page.messages.loginResponse.title.text = 'Usuario no encontrado';
						self.page.messages.loginResponse.title.color = 'danger';
					} else {
						self.page.buttons.login.disabled = false;
						self.page.messages.loginResponse.show = true;
						self.page.messages.loginResponse.title.text = 'Ha ocurrido un error :(';
						self.page.messages.loginResponse.subtitle.text = 'Por favor contáctanos a: karamuseDjApp@gmail.com';
						self.page.messages.loginResponse.title.color = 'danger';
						self.page.messages.loginResponse.subtitle.color = 'danger';
					}
					$rootScope.loader.show = false;
				})
				.catch(function(error) {
					$log.error(error);
					self.page.buttons.login.disabled = false;
					self.page.progressCursor = false;
					$rootScope.loader.show = false;
					self.page.messages.loginResponse.show = true;
					self.page.messages.loginResponse.title.text = 'Algo salió mal';
					self.page.messages.loginResponse.subtitle.text = 'Por favor vuelve a interntar logearte';
					self.page.messages.loginResponse.title.color = 'danger';
					self.page.messages.loginResponse.subtitle.color = 'danger';
				});
		};

		this.openSession = function() {

			deferred = $q.defer();

			Session.save({
				action: 'open',
				origin: deviceDetector.os + '/' + deviceDetector.browser + '/' + deviceDetector.browser_version,
				token: $auth.getToken()
			}, function(success) {
				// $log.log(success);
				if (success.status === 200 || success.status === 201) {
					deferred.resolve({
						status: success.status
					});
				} else {
					deferred.reject({
						status: success.status
					});
				}
				// llamar a servicio codigos
			}, function(error) {
				$log.error(error);
				deferred.reject({
					status: 400
				});
			});
			return deferred.promise;
		};

		this.verifyCodes = function() {
			deferred = $q.defer();

			VerifyCodes.verify({
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

		this.openModalActiveSession = function(data) {
			var modalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'active-session.html',
				controller: 'ActiveSessionModalInstanceCtrl',
				controllerAs: 'activeSession',
				size: 'md',
				resolve: {
					success: function() {
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

	});