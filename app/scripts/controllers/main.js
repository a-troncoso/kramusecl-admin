'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
	.controller('MainCtrl', function($log) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		$log.log('HELLO!');
	});