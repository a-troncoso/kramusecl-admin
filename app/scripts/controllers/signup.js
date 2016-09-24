'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
	.controller('SignupCtrl', function($scope, $log, $routeParams, ChileRegions, ChileProvinces, ChileCommunes, Signup) {

		this.page = {
			formGroups: {
				email: {
					show: true
				},
				phone: {
					show: true
				},
				bar: {
					show: false
				},
				rut: {
					show: false
				},
				address: {
					show: false
				},
				region: {
					show: false
				},
				province: {
					show: false
				},
				commune: {
					show: false
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
				commune: {}
			}
		};

		var self = this,
			tokenIsValid = false;

		var validateToken = function(token) {
			// PENDIENTE
			if (token) {
				return true;
			}
			return false;
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

		this.signup = function() {

			var data = {};
			tokenIsValid = validateToken($routeParams.token);

			if (tokenIsValid) {
				data = {
					email: self.user.data.email,
					phone: self.user.data.phone,
					bar: self.user.data.bar,
					rut: self.user.data.rut,
					address: self.user.data.address,
					region: self.user.data.region.nombre,
					province: self.user.data.province.nombre,
					commune: self.user.data.commune.nombre
				};
			} else {
				data = {
					email: this.user.data.email,
					phone: this.user.data.phone
				};
			}

			$log.log(data);

			Signup.save(data, function(success) {
				$log.info(success);
			}, function(error) {
				$log.log('soy un error');
				$log.error(error);
			});
		};

		if ($routeParams.token) {
			tokenIsValid = validateToken($routeParams.token);

			if (tokenIsValid) {
				this.page.formGroups.bar.show = true;
				this.page.formGroups.rut.show = true;
				this.page.formGroups.address.show = true;
				this.page.formGroups.region.show = true;
				this.page.formGroups.province.show = true;
				this.page.formGroups.commune.show = true;
				getRegions();
			}
		}

	});