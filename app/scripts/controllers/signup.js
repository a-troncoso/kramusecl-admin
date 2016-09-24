'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
	.controller('SignupCtrl', function($log, Signup, $routeParams) {

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
				city: {
					show: false
				},
				region: {
					show: false
				},
				commune: {
					show: false
				},
			}
		};

		this.user = {
			data: {
				email: '',
				phone: ''
			}
		};

		var validateToken = function(token) {
			// PENDIENTE
			if (token) {
				return true;
			}
			return false;
		};

		if ($routeParams.token) {
			var tokenIsValid = validateToken($routeParams.token);

			if (tokenIsValid) {
				this.page.formGroups.bar.show = true;
				this.page.formGroups.rut.show = true;
				this.page.formGroups.address.show = true;
				this.page.formGroups.city.show = true;
				this.page.formGroups.region.show = true;
				this.page.formGroups.commune.show = true;
			}
		}

		this.signup = function() {

			var data = {
				email: this.user.data.email,
				phone: this.user.data.phone
			};

			$log.log(data);

			Signup.save(data, function(success) {
				$log.info(success);
			}, function(error) {
				$log.log('soy un error');
				$log.error(error);
			});


		};

	});