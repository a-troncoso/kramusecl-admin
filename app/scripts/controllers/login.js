'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
	.controller('LoginCtrl', function($rootScope, $log, $auth, $q, $location, $uibModal, $state, deviceDetector, Utils, Session, Codes) {

		var self = this;

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
					if (success.data.status === 200) {
						self.page.buttons.login.disabled = false;
						$auth.setToken(success.data.data.token);
						self.page.messages.loginResponse.show = true;
						Utils.setInStorage('logged', true);
						$log.log(success.data.data.session);
						if (success.data.data.session.active) {
							self.openModalActiveSession(success);
						} else {
							var openSession = self.openSession();
							openSession.then(function() {
								$state.go('home');
							}, function() {
								self.page.buttons.login.disabled = false;
								self.page.messages.loginResponse.show = true;
								self.page.messages.loginResponse.title.text = 'No pudimos abrir una nueva sesión, porfa vuelve a intentar';
								self.page.messages.loginResponse.title.color = 'danger';
							});
							self.openSession();
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
						self.page.messages.loginResponse.subtitle.text = 'Por favor contáctanos a: karamuseapp@gmail.com';
						self.page.messages.loginResponse.title.color = 'danger';
						self.page.messages.loginResponse.subtitle.color = 'danger';
					}
					$rootScope.loader.show = false;
					//$log.log(success);
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

			var deferred = $q.defer();

			data = {
				action: 'open',
				origin: deviceDetector.os + '/' + deviceDetector.browser + '/' + deviceDetector.browser_version,
				token: $auth.getToken()
			};

			Session.save(data, function(success){
				if (success.status === 200 || success.status === 201) {
					$log.info('Se abre sesión: OK');
					deferred.resolve();
				} else {
					$log.info('Se abre sesión: ERROR');
					deferred.reject();
				}
				// llamar a servicio codigos
			}, function(error){
				$log.error(error);
				$log.info('Se abre sesión: ERROR');
				deferred.reject();
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