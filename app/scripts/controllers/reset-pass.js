'use strict';

/**
 * @ngdoc function
 * @name karamuseDjApp.controller:ResetPassCtrl
 * @description
 * # ResetPassCtrl
 * Controller of the karamuseDjApp
 */
angular.module('karamuseDjApp')
	.controller('ResetPassCtrl', function($rootScope, $log, $stateParams, RenewPass, Validators, Utils) {

		var self = this,
			data = {};

		this.page = {
			container: {
				progressCursor: false
			},
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
					},
					link: {
						href: '',
						color: '',
						text: ''
					}
				}
			},
			buttons: {
				send: {
					disabled: false
				}
			}
		};

		this.user = {
			data: {
				password: '',
				repassword: ''
			}
		};

		this.resetPass = function() {

			if (!Validators.comparePasswords(self.user.data.password, self.user.data.repassword)) {
				Utils.gotoAnyPartOfPage('topPage');
				self.page.messages.resetPassResponse.show = true;
				self.page.messages.resetPassResponse.title.text = 'Las contraseñas deben ser iguales';
				self.page.messages.resetPassResponse.title.color = 'danger';
				return;
			}

			if (!Validators.validateStringLength(self.user.data.password, 6)) {
				Utils.gotoAnyPartOfPage('topPage');
				self.page.messages.resetPassResponse.show = true;
				self.page.messages.resetPassResponse.title.text = 'La contraseña debe tener un largo mínimo de 6 caracteres';
				self.page.messages.resetPassResponse.title.color = 'danger';
				return;
			}

			data = {
				token: $stateParams.token,
				new_pass: self.user.data.password,
				step: 2
			};

			self.page.buttons.send.disabled = true;
			self.page.container.progressCursor = true;
			$rootScope.loader.show = true;

			RenewPass.query(data, function(success) {
				if (success.status === 200) {
					Utils.gotoAnyPartOfPage('topPage');
					self.page.messages.resetPassResponse.show = true;
					self.page.messages.resetPassResponse.title.text = 'Tu contraseña se ha actualizado correctamente';
					self.page.messages.resetPassResponse.title.color = 'white';
					self.page.messages.resetPassResponse.link.href = '#/';
					self.page.messages.resetPassResponse.link.color = 'black';
					self.page.messages.resetPassResponse.link.text = 'Ir al login';
				} else if (success.status === 400) {
					Utils.gotoAnyPartOfPage('topPage');
					self.page.buttons.send.disabled = false;
					self.page.messages.resetPassResponse.show = true;
					self.page.messages.resetPassResponse.title.text = 'Ha ocurrido un error :(';
					self.page.messages.resetPassResponse.subtitle.text = 'Por favor vuelve a intentar';
					self.page.messages.resetPassResponse.title.color = 'danger';
					self.page.messages.resetPassResponse.subtitle.color = 'danger';
				} else if (success.status === 401) {
					Utils.gotoAnyPartOfPage('topPage');
					self.page.buttons.send.disabled = false;
					self.page.messages.resetPassResponse.show = true;
					self.page.messages.resetPassResponse.title.text = 'El código de verificación no es válido';
					self.page.messages.resetPassResponse.title.color = 'danger';
				} else if (success.status === 402) {
					Utils.gotoAnyPartOfPage('topPage');
					self.page.buttons.send.disabled = false;
					self.page.messages.resetPassResponse.show = true;
					self.page.messages.resetPassResponse.title.text = 'Por favor indica la nueva contraseña';
					self.page.messages.resetPassResponse.title.color = 'danger';
				} else {
					Utils.gotoAnyPartOfPage('topPage');
					self.page.buttons.send.disabled = false;
					self.page.messages.resetPassResponse.show = true;
					self.page.messages.resetPassResponse.title.text = 'Ha ocurrido un error :(';
					self.page.messages.resetPassResponse.subtitle.text = 'Por favor contáctanos a: karamuseDjApp@gmail.com y repórtanos este error';
					self.page.messages.resetPassResponse.title.color = 'danger';
					self.page.messages.resetPassResponse.subtitle.color = 'danger';
				}
				self.page.container.progressCursor = false;
				$rootScope.loader.show = false;
				$log.log(success);
			}, function(error) {
				$log.error(error);
			});
		};

		if (!$stateParams.token) {
			$log.error('No viene el token');
		}

	});