'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
  .controller('HomeCtrl', function (Utils) {
    
    var self = this;

    this.page = {

    };

    this.bar = {
    	info: {
    		email: Utils.getInStorage('email'),
    		perfilPic: Utils.getInStorage('perfil_pic'),
    		name: Utils.getInStorage('name'),
    		address: Utils.getInStorage('address'),
    		ordersLimit: 60
    	}
    };

  });
