'use strict';

/**
 * @ngdoc function
 * @name karamuseDjApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the karamuseDjApp
 */
angular.module('karamuseDjApp')
	.controller('MainCtrl', function($log) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		$log.log('HELLO!');
	});