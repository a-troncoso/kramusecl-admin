'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
	.controller('LoginCtrl', function($log, $auth, $location, deviceDetector, Utils) {

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
				email: 'alvaro.mc2@gmail.com',
				password: '123456',
				origin: deviceDetector.os + '/' + deviceDetector.browser + '/' + deviceDetector.browser_version
			}
		};

		var self = this;

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
						$location.path('home');
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
					$log.log(success);
				})
				.catch(function(error) {
					$log.error(error);
				});
		};
	});