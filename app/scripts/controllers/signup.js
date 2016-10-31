'use strict';

/**
 * @ngdoc function
 * @name karamuseApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the karamuseApp
 */
angular.module('karamuseApp')
	.controller('SignupCtrl', function($rootScope, $log, $stateParams, $q, ChileRegions, ChileProvinces, ChileCommunes, Signup, Utils, Validators) {

		this.page = {
			container: {
				progressCursor: false
			},
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
					},
					link: {
						href: '',
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
					required: false,
					hasError: false,
					withoutBorder: true
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
					self.user.data.phone = parseInt(success.data.phone);
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

		this.formatRut = function(rut) {
			if (Validators.validateRutCheckDigit(rut)) {
				self.user.data.rut = Utils.formatRut(rut);
			}
		};

		this.hideRegistryResponse = function() {
			if (self.page.messages.registryResponse.show) {
				self.page.messages.registryResponse.show = false;
			}
		};

		this.signup = function() {

			data = {};

			if ($stateParams.token) {
				tokenIsValid = validateToken($stateParams.token);
			}

			//Si es que está completando el registro 2:
			if (tokenIsValid) {
				data = {
					action: '',
					email: self.user.data.email,
					phone: self.user.data.phone,
					name: self.user.data.bar,
					rut: self.user.data.rut,
					address: self.user.data.address,
					region: self.user.data.region.nombre,
					province: self.user.data.province.nombre,
					commune: self.user.data.commune.nombre,
					password: self.user.data.password,
					repassword: self.user.data.repassword,
					token: $stateParams.token
				};

				if (!Validators.validaRequiredField(self.user.data.email)) {
					Utils.gotoAnyPartOfPage('topPage');
					self.page.messages.registryResponse.show = true;
					self.page.messages.registryResponse.title.color = 'danger';
					self.page.messages.registryResponse.title.text = 'Por favor indica el nombre de tu bar';
					return;
				}

				if (!Validators.validaRequiredField(self.user.data.rut)) {
					Utils.gotoAnyPartOfPage('topPage');
					self.page.messages.registryResponse.show = true;
					self.page.messages.registryResponse.title.color = 'danger';
					self.page.messages.registryResponse.title.text = 'Por favor indica el rut de tu bar';
					return;
				}

				if (!Validators.validaRequiredField(self.user.data.address)) {
					Utils.gotoAnyPartOfPage('topPage');
					self.page.messages.registryResponse.show = true;
					self.page.messages.registryResponse.title.color = 'danger';
					self.page.messages.registryResponse.title.text = 'Por favor indica la dirección de tu bar';
					return;
				}

				if (!Validators.validateRutCheckDigit(self.user.data.rut)) {
					Utils.gotoAnyPartOfPage('topPage');
					self.page.messages.registryResponse.show = true;
					self.page.messages.registryResponse.title.color = 'danger';
					self.page.messages.registryResponse.title.text = 'Revisa que el rut esté bien escrito';
					return;
				}

				if (!self.user.data.region.nombre) {
					Utils.gotoAnyPartOfPage('topPage');
					self.page.messages.registryResponse.show = true;
					self.page.messages.registryResponse.title.color = 'danger';
					self.page.messages.registryResponse.title.text = 'Debes seeleccionar una región';
					return;
				}

				if (!self.user.data.region.nombre) {
					Utils.gotoAnyPartOfPage('topPage');
					self.page.messages.registryResponse.show = true;
					self.page.messages.registryResponse.title.color = 'danger';
					self.page.messages.registryResponse.title.text = 'Debes seeleccionar una provincia';
					return;
				}

				if (!self.user.data.region.nombre) {
					Utils.gotoAnyPartOfPage('topPage');
					self.page.messages.registryResponse.show = true;
					self.page.messages.registryResponse.title.color = 'danger';
					self.page.messages.registryResponse.title.text = 'Debes seeleccionar una comuna';
					return;
				}

				if (!Validators.comparePasswords(data.password, data.repassword)) {
					Utils.gotoAnyPartOfPage('topPage');
					self.page.messages.registryResponse.show = true;
					self.page.messages.registryResponse.title.color = 'danger';
					self.page.messages.registryResponse.title.text = 'Las contraseñas no coinciden';
					return;
				}

				if (!Validators.validateStringLength(data.password, 6)) {
					Utils.gotoAnyPartOfPage('topPage');
					self.page.messages.registryResponse.show = true;
					self.page.messages.registryResponse.title.color = 'danger';
					self.page.messages.registryResponse.title.text = 'La contaseña debe tener un largo mínimo de 6 caracteres';
					return;
				}
				//Si es que está completando el registro 1:
			} else {
				data = {
					action: '',
					email: self.user.data.email,
					phone: '56' + self.user.data.phone
				};
			}

			self.page.buttons.send.disabled = true;
			self.page.container.progressCursor = true;
			$rootScope.loader.show = true;

			Signup.save(data, function(success) {
				self.page.messages.registryResponse.show = true;
				if (success.status === 200) {
					self.page.messages.registryResponse.title.text = '¡Muchas gracias!';
					self.page.messages.registryResponse.subtitle.text = 'Pronto nos pondremos en contacto contigo';
					self.page.messages.registryResponse.title.color = 'white';
					self.page.messages.registryResponse.subtitle.color = 'white';
					self.page.buttons.send.disabled = true;
					// Utils.gotoAnyPartOfPage('topPage');
				} else if (success.status === 201) {
					self.page.messages.registryResponse.title.text = '¡Muchas gracias!';
					self.page.messages.registryResponse.subtitle.text = 'Te damos la bienvenida a Karamuse';
					self.page.messages.registryResponse.link.text = 'ir al login';
					self.page.messages.registryResponse.title.color = 'white';
					self.page.messages.registryResponse.subtitle.color = 'white';
					self.page.messages.registryResponse.link.color = 'black';
					self.page.messages.registryResponse.link.href = '#/';
					self.page.buttons.send.disabled = true;
					// Utils.gotoAnyPartOfPage('topPage');
				} else if (success.status === 202) {
					self.page.messages.registryResponse.title.text = 'No se ha completado el registro :(';
					self.page.messages.registryResponse.subtitle.text = 'El bar ya está registrado';
					self.page.messages.registryResponse.link.text = 'ir al login';
					self.page.messages.registryResponse.title.color = 'white';
					self.page.messages.registryResponse.subtitle.color = 'white';
					self.page.messages.registryResponse.link.color = 'black';
					self.page.buttons.send.disabled = true;
					// Utils.gotoAnyPartOfPage('topPage');
				} else if (success.status === 403) {
					self.page.messages.registryResponse.title.text = 'Ha ocurrido un error :(';
					self.page.messages.registryResponse.subtitle.text = 'Tu email ya está registrado';
					self.page.messages.registryResponse.title.color = 'danger';
					self.page.messages.registryResponse.subtitle.color = 'danger';
					self.page.buttons.send.disabled = false;
					// Utils.gotoAnyPartOfPage('topPage');
				} else {
					self.page.messages.registryResponse.title.text = 'Ha ocurrido un error :(';
					self.page.messages.registryResponse.subtitle.text = 'Por favor contáctanos a: karamuseapp@gmail.com';
					self.page.messages.registryResponse.title.color = 'danger';
					self.page.messages.registryResponse.subtitle.color = 'danger';
					self.page.buttons.send.disabled = false;
					// Utils.gotoAnyPartOfPage('topPage');
				}
				self.page.container.progressCursor = false;
				$rootScope.loader.show = false;
				$log.info(success);
			}, function(error) {
				self.page.messages.registryResponse.title.text = 'Ha ocurrido un error :(';
				self.page.messages.registryResponse.subtitle.text = 'Por favor contáctanos a: karamuseapp@gmail.com';
				self.page.messages.registryResponse.title.color = 'danger';
				self.page.messages.registryResponse.subtitle.color = 'danger';
				self.page.buttons.send.disabled = false;
				self.page.container.progressCursor = false;
				$rootScope.loader.show = false;
				$log.error(error);
			});
		};

		if ($stateParams.token) {
			self.page.buttons.send.text = 'Registrar';

			tokenIsValid = validateToken($stateParams.token);
			tokenIsValid.then(function() {
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
			}, function() {
				Utils.gotoState('page-404');
			});
		}

	});