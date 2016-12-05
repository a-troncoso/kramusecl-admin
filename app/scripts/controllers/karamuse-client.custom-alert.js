'use strict';

/**
 * @ngdoc function
 * @name karamuseDjApp.controller:CustomAlertCtrl
 * @description
 * # CustomAlertCtrl
 * Controller of the karamuseDjApp
 */
angular.module('karamuseDjApp')
  .controller('CustomAlertCtrl', function ($log, $mdDialog, data) {

    this.elements = data;

    this.closeDialog = function() {
    	$mdDialog.cancel();
    };	
    
  });
