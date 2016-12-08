'use strict';

/**
 * @ngdoc function
 * @name karamuseClientApp.controller:ClientHomeCtrl
 * @description
 * # ClientHomeCtrl
 * Controller of the karamuseClientApp
 */
angular.module('karamuseClientApp')
	.controller('ClientHomeCtrl', function($mdDialog, $rootScope, $log, $auth, $q, Bars, Utils, Token, deviceDetector, ClientUtils) {

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
			list: [
				// {
				// 	id: 1,
				// 	name: 'Bar 1',
				// 	avatar: "http://2.bp.blogspot.com/_SFvBL--Odio/SrRKLPSf33I/AAAAAAAABJA/eFX0tTM2H5Q/s400/simones201.jpg",
				// 	address: 'San Camilo 686'
				// }, {
				// 	id: 2,
				// 	name: 'Bar 2',
				// 	avatar: "http://2.bp.blogspot.com/_SFvBL--Odio/SrRKLPSf33I/AAAAAAAABJA/eFX0tTM2H5Q/s400/simones201.jpg",
				// 	address: 'San Camilo 696'
				// }, {
				// 	id: 3,
				// 	name: 'Bar 3',
				// 	avatar: "http://2.bp.blogspot.com/_SFvBL--Odio/SrRKLPSf33I/AAAAAAAABJA/eFX0tTM2H5Q/s400/simones201.jpg",
				// 	address: 'San Camilo con 10 de julio'
				// }, {
				// 	id: 3,
				// 	name: 'Bar 3',
				// 	avatar: "http://2.bp.blogspot.com/_SFvBL--Odio/SrRKLPSf33I/AAAAAAAABJA/eFX0tTM2H5Q/s400/simones201.jpg",
				// 	address: 'San Camilo con 10 de julio'
				// }, {
				// 	id: 3,
				// 	name: 'Bar 3',
				// 	avatar: "http://2.bp.blogspot.com/_SFvBL--Odio/SrRKLPSf33I/AAAAAAAABJA/eFX0tTM2H5Q/s400/simones201.jpg",
				// 	address: 'San Camilo con 10 de julio'
				// }, {
				// 	id: 3,
				// 	name: 'Bar 3',
				// 	avatar: "http://2.bp.blogspot.com/_SFvBL--Odio/SrRKLPSf33I/AAAAAAAABJA/eFX0tTM2H5Q/s400/simones201.jpg",
				// 	address: 'San Camilo con 10 de julio'
				// }, {
				// 	id: 3,
				// 	name: 'Bar 3',
				// 	avatar: "http://2.bp.blogspot.com/_SFvBL--Odio/SrRKLPSf33I/AAAAAAAABJA/eFX0tTM2H5Q/s400/simones201.jpg",
				// 	address: 'San Camilo con 10 de julio'
				// }, {
				// 	id: 3,
				// 	name: 'Bar 3',
				// 	avatar: "http://2.bp.blogspot.com/_SFvBL--Odio/SrRKLPSf33I/AAAAAAAABJA/eFX0tTM2H5Q/s400/simones201.jpg",
				// 	address: 'San Camilo con 10 de julio'
				// }
			]
		};

		this.getBars = function() {
			$rootScope.clientGlobalLoader.show = true;
			Bars.query({}, function(success) {
				// $log.log(success);
				if (success.status === 200) {
					self.bars.list = success.data;
					for (i = 0; i < self.bars.list.length; i++) {
						self.bars.list[i].disabled = false;
					}
					$rootScope.clientGlobalLoader.show = false;
				}
			}, function(error) {
				$log.error(error);
				$rootScope.clientGlobalLoader.show = false;
			});
		};

		this.gotoSearchKaraoke = function(item) {
			// $log.log(item);

			var createToken = self.createToken(item);
			createToken.then(function() {
				Utils.setInStorage('bar', item);

				if (Utils.getInStorage('bar').settings.banner_ad !== '' || Utils.getInStorage('bar').settings.banner_ad) {
					self.openBanner();
				}

				ClientUtils.setEmptyTicket();
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