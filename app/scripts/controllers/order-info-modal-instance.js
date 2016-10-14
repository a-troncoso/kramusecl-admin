'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:OrderInfoModalInstanceCtrl
 * @description
 * # OrderInfoModalInstanceCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
    .controller('OrderInfoModalInstanceCtrl', function($log, $uibModalInstance, orderData) {

        this.modal = {

        };

        this.orderData = {
            ticket: orderData.ticket,
            title: orderData.title,
            createdAt: orderData.createdAt,
            state: orderData.state,
            origin: orderData.origin,
            code: orderData.codeClient,
            time: orderData.time,
            url: orderData.url
        };

        this.cancel = function() {
            $uibModalInstance.close();
        };


    });