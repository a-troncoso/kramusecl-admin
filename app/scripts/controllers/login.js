'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
	.controller('LoginCtrl', function($log, $auth, $q, $location, $uibModal, $state, deviceDetector, Utils, Session, Codes) {

		var self = this;

		this.page = {
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

			$auth.login(data)
				.then(function(success) {
					if (success.data.status === 200) {
						$auth.setToken(success.data.data.token);
						self.page.messages.loginResponse.show = true;
						self.page.messages.loginResponse.title.text = 'Login correcto';
						self.page.messages.loginResponse.title.color = 'white';
						Utils.setInStorage('logged', true);
						$log.log(success.data.data.session);
						if (success.data.data.session.active) {
							self.openModalActiveSession(success);
						} else {
							self.openSession();
						}
					} else if (success.data.status === 401) {
						self.page.messages.loginResponse.show = true;
						self.page.messages.loginResponse.title.text = 'Usuario y/o password incorrectos';
						self.page.messages.loginResponse.title.color = 'danger';
					} else if (success.data.status === 404) {
						self.page.messages.loginResponse.show = true;
						self.page.messages.loginResponse.title.text = 'Usuario no encontrado';
						self.page.messages.loginResponse.title.color = 'danger';
					} else {
						self.page.messages.loginResponse.show = true;
						self.page.messages.loginResponse.title.text = 'Ha ocurrido un error :(';
						self.page.messages.loginResponse.subtitle.text = 'Por favor contáctanos a: karamuseapp@gmail.com';
						self.page.messages.loginResponse.title.color = 'danger';
						self.page.messages.loginResponse.subtitle.color = 'danger';
					}
					//$log.log(success);
				})
				.catch(function(error) {
					$log.error(error);
				});
		};

		this.openSession = function() {

			data = {
				action: 'open',
				origin: deviceDetector.os + '/' + deviceDetector.browser + '/' + deviceDetector.browser_version,
				token: $auth.getToken()
			};

			Session.save(data, function(success){
				$log.log(success);
				self.validateCodes();
			}, function(error){
				$log.log(error);
			});
		};

		this.validateCodes = function() {

			//simulo que no tiene codigos
			var noCodes = true;
			if (noCodes) {
				self.openModalGenerateCodes();
			} else {
				$state.go('home');
			}

			//var deferred = $q.defer();

			// Codes.get({}, function(success) {
			// 	$log.log(success);
			// 	if (success.status === 200) {
			// 		// llevar al home
			// 	} else {
			// 		// abrir modal crear codigos
			// 		self.openModalGenerateCodes();
			// 	}
			// }, function(error) {
			// 	$log.log(error);
			// });
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
				resolve: {
					// success: function() {
					// 	return data;
					// }
				}
			});

			modalInstance.result.then(function () {}, function () {});
		};


	});