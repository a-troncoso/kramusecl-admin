'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
	.controller('SignupCtrl', function($log, $routeParams, $q, ChileRegions, ChileProvinces, ChileCommunes, Signup) {

		this.page = {
			messages: {
				registryResponse: {
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
				},
				show: false
			},
			formGroups: {
				email: {
					show: true,
					disabled: false
				},
				phone: {
					show: true,
					disabled: false
				},
				bar: {
					show: false,
					required: false
				},
				rut: {
					show: false,
					required: false
				},
				address: {
					show: false,
					required: false
				},
				region: {
					show: false,
					required: false
				},
				province: {
					show: false,
					required: false
				},
				commune: {
					show: false,
					required: false
				},
				password: {
					show: false,
					required: false,
					type: 'password'
				},
				repassword: {
					show: false,
					required: false
				},
			},
			regions: {
				list: []
			},
			provinces: {
				list: []
			},
			communes: {
				list: []
			},
			buttons: {
				send: {
					disabled: false,
					text: 'Contáctanos'
				}
			}
		};

		this.user = {
			data: {
				email: '',
				phone: '',
				bar: '',
				rut: '',
				address: '',
				region: {},
				province: {},
				commune: {},
				password: '',
				repassword: ''
			}
		};

		var self = this,
			tokenIsValid = false,
			data = {};

		var validateToken = function(token) {
			var deferred = $q.defer();

			data = {
				token: token,
				action: 'validate_token'
			};

			Signup.validateToken(data, function(success) {
				if (success.status === 200) {
					self.user.data.email = success.data.email;
					self.user.data.phone = success.data.phone;
					deferred.resolve(true);
				} else {
					deferred.reject(false);
				}
			}, function(error) {
				$log.error(error);
				deferred.reject(false);
			});

			return deferred.promise;
		};

		var getRegions = function() {
			ChileRegions.query({}, function(success) {
				self.page.regions.list = success;
				self.user.data.region = self.page.regions.list[0];
				self.getProvinces(self.user.data.region.codigo);
			}, function(error) {
				$log.error(error);
			});
		};

		this.getProvinces = function(regionId) {
			ChileProvinces.query({
				regionId: regionId
			}, function(success) {
				self.page.provinces.list = success;
				self.user.data.province = self.page.provinces.list[0];
				self.getCommunes(self.user.data.region.codigo, self.user.data.province.codigo);
			}, function(error) {
				$log.error(error);
			});
		};

		this.getCommunes = function(regionId, provinceId) {
			ChileCommunes.query({
				regionId: regionId,
				provinceId: provinceId
			}, function(success) {
				self.page.communes.list = success;
				self.user.data.commune = self.page.communes.list[0];
			}, function(error) {
				$log.error(error);
			});
		};

		this.hideShowPassword = function() {
			if (self.page.formGroups.password.type === 'password') {
				self.page.formGroups.password.type = 'text';
			} else {
				self.page.formGroups.password.type = 'password';
			}
		};

		this.signup = function() {

			data = {};

			if ($routeParams.token) {
				tokenIsValid = validateToken($routeParams.token);
			}

			if (tokenIsValid) {
				data = {
					action: '',
					email: self.user.data.email,
					phone: self.user.data.phone,
					name: self.user.data.bar,
					rut: self.user.data.rut,
					address: self.user.data.address,
					region: self.user.data.region.nombre,
					city: self.user.data.province.nombre,
					commune: self.user.data.commune.nombre,
					password: self.user.data.password,
					repassword: self.user.data.repassword,
					token: $routeParams.token
				};
			} else {
				data = {
					action: '',
					email: self.user.data.email,
					phone: self.user.data.phone
				};
			}

			$log.log(data);

			self.page.buttons.send.disabled = true;

			Signup.save(data, function(success) {
				self.page.messages.registryResponse.show = true;
				if (success.status === 200) {
					self.page.messages.registryResponse.title.text = '¡Muchas gracias!';
					if (tokenIsValid) {
						self.page.messages.registryResponse.subtitle.text = 'Pronto nos pondremos en contacto contigo';
					} else {
						self.page.messages.registryResponse.subtitle.text = 'Te damos la bienvenida a Karamuse';
					}
					self.page.messages.registryResponse.title.color = 'white';
					self.page.messages.registryResponse.subtitle.color = 'white';
					self.page.buttons.send.disabled = true;
				} else if (success.status === 403) {
					self.page.messages.registryResponse.title.text = 'Ha ocurrido un error :(';
					self.page.messages.registryResponse.subtitle.text = 'Tu email ya está registrado';
					self.page.messages.registryResponse.title.color = 'danger';
					self.page.messages.registryResponse.subtitle.color = 'danger';
					self.page.buttons.send.disabled = false;
				}

				$log.info(success);
			}, function(error) {
				$log.error(error);
			});
		};

		if ($routeParams.token) {
			self.page.buttons.send.text = 'Registrar';

			tokenIsValid = validateToken($routeParams.token);

			if (tokenIsValid) {
				self.page.formGroups.email.disabled = true;
				self.page.formGroups.phone.disabled = true;
				self.page.formGroups.bar.show = true;
				self.page.formGroups.rut.show = true;
				self.page.formGroups.address.show = true;
				self.page.formGroups.region.show = true;
				self.page.formGroups.province.show = true;
				self.page.formGroups.commune.show = true;
				self.page.formGroups.password.show = true;
				self.page.formGroups.repassword.show = true;

				self.page.formGroups.bar.required = true;
				self.page.formGroups.rut.required = true;
				self.page.formGroups.address.required = true;
				self.page.formGroups.region.required = true;
				self.page.formGroups.province.required = true;
				self.page.formGroups.commune.required = true;
				self.page.formGroups.password.required = true;
				self.page.formGroups.repassword.required = true;

				getRegions();
			}
		}

	});