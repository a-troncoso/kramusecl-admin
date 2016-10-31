'use strict';

/**
 * @ngdoc function
 * @name karamuseApp.controller:ForgotPassCtrl
 * @description
 * # ForgotPassCtrl
 * Controller of the karamuseApp
 */
angular.module('karamuseApp')
	.controller('ForgotPassCtrl', function($rootScope, $log, RenewPass, Utils) {

		this.page = {
			container: {
				progressCursor: false
			},
			messages: {
				forgotPassResponse: {
					show: false,
					title: {
						text: '',
						color: '',
						show: false
					},
					subtitle: {
						text: '',
						color: '',
						show: false
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
				email: ''
			}
		};

		var self = this,
			data = {};

		this.sendInstructions = function() {
			data = {
				email: self.user.data.email,
				step: 1
			};

			self.page.buttons.send.disabled = true;
			self.page.container.progressCursor = true;
			$rootScope.loader.show = true;

			RenewPass.query(data, function(success) {
				self.page.messages.forgotPassResponse.show = 'true';
				if (success.status === 200) {
					Utils.gotoAnyPartOfPage('topPage');
					self.page.messages.forgotPassResponse.title.text = 'Te hemos enviado un correo con instrucciones para restablecer tu contraseña';
					self.page.messages.forgotPassResponse.subtitle.text = '(puedes cerrar esta página)';
					self.page.messages.forgotPassResponse.title.color = 'white';
					self.page.messages.forgotPassResponse.subtitle.color = 'white';
				} else if (success.status === 400) {
					Utils.gotoAnyPartOfPage('topPage');
					self.page.buttons.send.disabled = false;
					self.page.messages.forgotPassResponse.title.text = 'Ha ocurrido un error :(';
					self.page.messages.forgotPassResponse.subtitle.text = 'Por favor intenta de nuevo';
					self.page.messages.forgotPassResponse.title.color = 'danger';
					self.page.messages.forgotPassResponse.subtitle.color = 'danger';
				} else if (success.status === 404) {
					Utils.gotoAnyPartOfPage('topPage');
					self.page.buttons.send.disabled = false;
					self.page.messages.forgotPassResponse.title.text = 'Revisa que tu correo esté bien escrito';
					self.page.messages.forgotPassResponse.title.color = 'danger';
				} else if (success.status === 405) {
					Utils.gotoAnyPartOfPage('topPage');
					self.page.buttons.send.disabled = false;
					self.page.messages.forgotPassResponse.title.text = 'Correo no enviado';
					self.page.messages.forgotPassResponse.subtitle.text = 'Tenemos un problema al enviar el correo, por favor intenta de nuevo';
					self.page.messages.forgotPassResponse.title.color = 'danger';
					self.page.messages.forgotPassResponse.subtitle.color = 'danger';
				} else {
					Utils.gotoAnyPartOfPage('topPage');
					self.page.buttons.send.disabled = false;
					self.page.messages.forgotPassResponse.title.text = 'Ha ocurrido un error :(';
					self.page.messages.forgotPassResponse.subtitle.text = 'Por favor contáctanos a: karamuseapp@gmail.com y repórtanos este error';
					self.page.messages.forgotPassResponse.title.color = 'danger';
					self.page.messages.forgotPassResponse.subtitle.color = 'danger';
				}
				self.page.container.progressCursor = false;
				$rootScope.loader.show = false;

				$log.log(success);
			}, function(error) {
				$log.log(error);
			});


		};

	});