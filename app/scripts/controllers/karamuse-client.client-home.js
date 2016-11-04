'use strict';

/**
 * @ngdoc function
 * @name karamuseClientApp.controller:ClientHomeCtrl
 * @description
 * # ClientHomeCtrl
 * Controller of the karamuseClientApp
 */
angular.module('karamuseClientApp')
	.controller('ClientHomeCtrl', function($log, Bars) {

		var self = this;
		this.bars = {
			list: []
		};

		this.getBars = function() {
			Bars.query({}, function(success) {
				$log.log(success);
				if (success.status === 200) {
					self.bars.list = success.data;
				}
			}, function(error) {
				$log.log(error);
			})
		};

		self.getBars();
	});