'use strict';

/**
 * @ngdoc function
 * @name karamuseClientApp.controller:ClientHomeCtrl
 * @description
 * # ClientHomeCtrl
 * Controller of the karamuseClientApp
 */
angular.module('karamuseClientApp')
	.controller('ClientHomeCtrl', function($mdDialog, $rootScope, $log, $auth, $q, Bars, Utils, Token, deviceDetector) {

		var self = this,
			deferred = null,
			i = 0;

		/* OPEN BANNER HERE */

		this.openBanner = function() {
			$mdDialog.show({
					controller: 'BannerCtrl',
					controllerAs: 'banner',
					templateUrl: 'karamuse-client.banner.tmpl.html',
					parent: angular.element(document.querySelector('#dialogContainer')),
					clickOutsideToClose: true,
					fullscreen: false, // Only for -xs, -sm breakpoints.
					locals: {}
				})
				.then(function() {}, function() {});
		}

		this.bars = {
			list: []
		};

		this.getBars = function() {
			$rootScope.clientGlobalLoader.show = true;

			try {
				Bars.getBars()
					.then(function(bars) {
						$rootScope.clientGlobalLoader.show = false;
						$log.info(bars);
					})
					.catch(function(error) {
						throw error;
					})

			} catch (error) {
				console.log(error);
			}
			// Bars.query({}, function(success) {
			// 	// $log.log(success);
			// 	if (success.status === 200) {
			// 		self.bars.list = success.data;
			// 		for (i = 0; i < self.bars.list.length; i++) {
			// 			self.bars.list[i].disabled = false;
			// 		}
			// 		$rootScope.clientGlobalLoader.show = false;
			// 	}
			// }, function(error) {
			// 	$log.error(error);
			// 	$rootScope.clientGlobalLoader.show = false;
			// });
		};

		this.gotoSearchKaraoke = function(item) {
			$log.log(item);
			var createToken = self.createToken(item);
			createToken.then(function() {
				Utils.setInStorage('bar', item);

				//reiniciar ticket
				Utils.setInStorage('ticket', {
					orders: [],
					code: null
				});

				$log.log(Utils.getInStorage('ticket'));

				if (Utils.getInStorage('bar').settings.banner_ad !== '' || Utils.getInStorage('bar').settings.banner_ad) {
					self.openBanner();
				}

				Utils.gotoState('client.results');
			}, function(error) {
				$log.error(error);
			});

		};

		this.createToken = function(data) {
			deferred = $q.defer();

			Token.save({
				id_bar: data.id,
				origin: deviceDetector.os + '/' + deviceDetector.browser + '/' + deviceDetector.browser_version
			}, function(success) {
				// $log.log(success);
				if (success.status === 200) {
					$auth.setToken(success.token);
					deferred.resolve({
						success: true,
						detail: success
					});
				} else if (success.status === 400) {
					deferred.resolve({
						success: false,
						detail: success
					});
				} else if (success.status === 402) {
					deferred.resolve({
						success: false,
						detail: success
					});
				} else if (success.status === 403) {
					deferred.resolve({
						success: false,
						detail: success
					});
				}
			}, function(error) {
				$log.log(error);
				deferred.resolve({
					success: false,
					detail: error
				});
			});

			return deferred.promise;
		};

		self.getBars();

	});