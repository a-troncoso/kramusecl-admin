'use strict';

/**
 * @ngdoc function
 * @name karamuseClientApp.controller:Utils
 * @description
 * # Utils
 * Controller of the karamuseClientApp
 */

angular.module('karamuseClientApp')

.service('ClientUtils', function($log, Utils, $state, $anchorScroll, $location, localStorageService) {

	this.setEmptyTicket = function() {
		Utils.setInStorage('ticket', {
			orders: [],
			code: null
		});
	};

});