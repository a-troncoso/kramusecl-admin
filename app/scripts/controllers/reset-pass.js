'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:ResetPassCtrl
 * @description
 * # ResetPassCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
	.controller('ResetPassCtrl', function($log, $routeParams, RenewPass, Validators, Utils) {

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
				Utils.gotoAnyPartOfPage('topPage');
				return;
			}

			if (!Validators.validateStringLength(self.user.data.password, 6)) {
				self.page.messages.resetPassResponse.show = true;
				self.page.messages.resetPassResponse.title.text = 'La contraseña debe tener un largo mínimo de 6 caracteres';
				self.page.messages.resetPassResponse.title.color = 'danger';
				Utils.gotoAnyPartOfPage('topPage');
				return;
			}

			data = {
				token: $routeParams.token,
				new_pass: '',
				step: 2
			};

			self.page.container.progressCursor = true;

			RenewPass.query(data, function(success) {
				if (success.status === 200) {
					self.page.messages.resetPassResponse.show = true;
					self.page.messages.resetPassResponse.title.text = 'Tu contraseña se ha actualizado correctamente';
					self.page.messages.resetPassResponse.title.color = 'white';
					self.page.messages.resetPassResponse.link.href = '#/';
					self.page.messages.resetPassResponse.link.color = 'black';
					self.page.messages.resetPassResponse.link.text = 'Ir al login';
					Utils.gotoAnyPartOfPage('topPage');
				} else if (success.status === 400) {
					self.page.messages.resetPassResponse.show = true;
					self.page.messages.resetPassResponse.title.text = 'Ha ocurrido un error :(';
					self.page.messages.resetPassResponse.subtitle.text = 'Por favor vuelve a intentar';
					self.page.messages.resetPassResponse.title.color = 'danger';
					self.page.messages.resetPassResponse.subtitle.color = 'danger';
					Utils.gotoAnyPartOfPage('topPage');
				} else if (success.status === 401) {
					self.page.messages.resetPassResponse.show = true;
					self.page.messages.resetPassResponse.title.text = 'El código de verificación no es válido';
					self.page.messages.resetPassResponse.title.color = 'danger';
					Utils.gotoAnyPartOfPage('topPage');
				} else if (success.status === 402) {
					self.page.messages.resetPassResponse.show = true;
					self.page.messages.resetPassResponse.title.text = 'Por favor indica la nueva contraseña';
					self.page.messages.resetPassResponse.title.color = 'danger';
					Utils.gotoAnyPartOfPage('topPage');
				} else {
					self.page.messages.resetPassResponse.show = true;
					self.page.messages.resetPassResponse.title.text = 'Ha ocurrido un error :(';
					self.page.messages.resetPassResponse.subtitle.text = 'Por favor contáctanos a: karamuseapp@gmail.com';
					self.page.messages.resetPassResponse.title.color = 'danger';
					self.page.messages.resetPassResponse.subtitle.color = 'danger';
					Utils.gotoAnyPartOfPage('topPage');
				}
				self.page.container.progressCursor = false;
				$log.log(success);
			}, function(error) {
				$log.error(error);
			});
		};

		if (!$routeParams.token) {
			$log.error('No viene el token');
		}

	});