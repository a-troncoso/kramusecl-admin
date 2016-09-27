'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:ForgotPassCtrl
 * @description
 * # ForgotPassCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
	.controller('ForgotPassCtrl', function($log, RenewPass) {

		this.page = {
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

			RenewPass.query(data, function(success) {
				self.page.messages.forgotPassResponse.show = 'true';
				if (success.status === 200) {
					self.page.messages.forgotPassResponse.title.text = 'Te hemos enviado un correo con instrucciones para restablecer tu contraseña';
					self.page.messages.forgotPassResponse.title.color = 'white';
				} else if (success.status === 400) {
					self.page.messages.forgotPassResponse.title.text = 'Ha ocurrido un error :(';
					self.page.messages.forgotPassResponse.subtitle.text = 'Por favor intenta de nuevo';
					self.page.messages.forgotPassResponse.title.color = 'danger';
					self.page.messages.forgotPassResponse.subtitle.color = 'danger';
				} else if (success.status === 404) {
					self.page.messages.forgotPassResponse.title.text = 'Revisa que tu correo esté bien escrito';
					self.page.messages.forgotPassResponse.title.color = 'danger';
				} else if (success.status === 405) {
					self.page.messages.forgotPassResponse.title.text = 'Correo no enviado';
					self.page.messages.forgotPassResponse.subtitle.text = 'Tenemos un problema al enviar el correo, por favor intenta de nuevo';
					self.page.messages.forgotPassResponse.title.color = 'danger';
					self.page.messages.forgotPassResponse.subtitle.color = 'danger';
				} else {
					self.page.messages.forgotPassResponse.title.text = 'Ha ocurrido un error :(';
					self.page.messages.forgotPassResponse.subtitle.text = 'Por favor contáctanos a: karamuseapp@gmail.com';
					self.page.messages.forgotPassResponse.title.color = 'danger';
					self.page.messages.forgotPassResponse.subtitle.color = 'danger';
				}
				$log.log(success);
			}, function(error) {
				$log.log(error);
			});


		};

	});