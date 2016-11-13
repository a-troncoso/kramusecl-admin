'use strict';

/**
 * @ngdoc function
 * @name karamuseDjApp.controller:EmptyStateCtrl
 * @description
 * # EmptyStateCtrl
 * Controller of the karamuseDjApp
 */
angular.module('karamuseDjApp')
  .controller('EmptyStateCtrl', function ($log, $stateParams) {

  	$log.log($stateParams);
    
  	this.elements = {
  		messages: {
  			primary: $stateParams.data.messages.primary
  		}
  	};
  });
