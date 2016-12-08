'use strict';

/**
 * @ngdoc function
 * @name karamuseDjApp.controller:BannerCtrl
 * @description
 * # BannerCtrl
 * Controller of the karamuseDjApp
 */
angular.module('karamuseDjApp')
	.controller('BannerCtrl', function($mdDialog, $log, Utils) {

		this.elements = {
			banner: {
				url: Utils.getInStorage('bar').settings.banner_ad
			}
		};

		this.gotoState = function(state) {
			Utils.gotoState(state);
		};

		this.closeDialog = function() {
			$mdDialog.cancel();
		};

	});