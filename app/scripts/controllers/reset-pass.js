'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:ResetPassCtrl
 * @description
 * # ResetPassCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
	.controller('ResetPassCtrl', function($log, $routeParams, RenewPass, Validators) {

		this.page = {
			messages: {
				resetPassResponse: {
					show: false,
					title: {
						color: '',
						text: ''
					},
					subtitle: {
						color: '',
						text: ''
					}
				}
			}
		};

		this.user = {
			data: {
				password: '',
				repassword: ''
			}
		};

		var self = this,
			data = {};

		this.resetPass = function() {

			if (!Validators.comparePasswords(self.user.data.password, self.user.data.repassword)) {
				self.page.messages.resetPassResponse.show = true;
				self.page.messages.resetPassResponse.title.text = 'Las contraseñas deben ser iguales';
				self.page.messages.resetPassResponse.title.color = 'danger';
				return;
			}

			if (!Validators.validateStringLength(self.user.data.password, 6)) {
				self.page.messages.resetPassResponse.show = true;
				self.page.messages.resetPassResponse.title.text = 'La contraseña debe tener un largo mínimo de 6 caracteres';
				self.page.messages.resetPassResponse.title.color = 'danger';
				return;
			}

			data = {
				token: $routeParams.token,
				new_pass: '',
				step: 2
			};

			RenewPass.query(data, function(success) {
				if (success.status === 200) {
					self.page.messages.resetPassResponse.show = true;
					self.page.messages.resetPassResponse.title.text = 'Tu contraseña se ha actualizado correctamente';
					self.page.messages.resetPassResponse.title.color = 'white';
				} else if (400) {
					self.page.messages.resetPassResponse.show = true;
					self.page.messages.resetPassResponse.title.text = 'Ha ocurrido un error :(';
					self.page.messages.resetPassResponse.subtitle.text = 'Por favor vuelve a intentar';
					self.page.messages.resetPassResponse.title.color = 'danger';
					self.page.messages.resetPassResponse.subtitle.color = 'danger';
				} else if (401) {
					self.page.messages.resetPassResponse.show = true;
					self.page.messages.resetPassResponse.title.text = 'El código de verificación no es válido';
					self.page.messages.resetPassResponse.title.color = 'danger';
				} else if (402) {
					self.page.messages.resetPassResponse.show = true;
					self.page.messages.resetPassResponse.title.text = 'Por favor indica la nueva contraseña';
					self.page.messages.resetPassResponse.title.color = 'danger';
				} else {
					self.page.messages.resetPassResponse.show = true;
					self.page.messages.resetPassResponse.title.text = 'Ha ocurrido un error :(';
					self.page.messages.resetPassResponse.subtitle.text = 'Por favor vuelve a intentar';
					self.page.messages.resetPassResponse.title.color = 'danger';
					self.page.messages.resetPassResponse.subtitle.color = 'danger';
				}
				$log.log(success);
			}, function(error) {
				$log.error(error);
			});
		};

		if (!$routeParams.token) {
			$log.error('No viene el token');
		}

	});