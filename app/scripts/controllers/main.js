'use strict';

/**
 * @ngdoc function
 * @name karamuseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the karamuseApp
 */
angular.module('karamuseApp')
	.controller('MainCtrl', function($log) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		$log.log('HELLO!');
	});