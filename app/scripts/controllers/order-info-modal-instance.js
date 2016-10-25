'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:OrderInfoModalInstanceCtrl
 * @description
 * # OrderInfoModalInstanceCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
	.controller('OrderInfoModalInstanceCtrl', function($log, $uibModalInstance, $window, orderData) {

		var i = 0,
			dateString = '',
			hours, minutes, seconds, date, summatory = new Date(0, 0, 0, 0, 0, 0, 0);

		for (i = 0; i < orderData.firstOrders.length; i++) {

			dateString = orderData.firstOrders[i].time;

			hours = parseInt(dateString.substring(0, 2));
			minutes = parseInt(dateString.substring(3, 5));
			seconds = parseInt(dateString.substring(6, 8));

			summatory = new Date(0, 0, 0, summatory.getHours() + hours, summatory.getMinutes() + minutes, summatory.getSeconds() + seconds, 0);
		}

		$log.log(summatory);

		this.orderData = {
			ticket: orderData.ticket,
			title: orderData.title,
			createdAt: orderData.createdAt,
			state: orderData.state,
			origin: orderData.origin,
			code: orderData.codeClient,
			time: orderData.time,
			waitTime: summatory,
			url: orderData.url
		};

		this.cancel = function() {
			$uibModalInstance.dismiss();
		};

		this.watchKaraoke = function(url) {
			$window.open(url, '', 'width=1024,height=600,left=100,top=50');
		};


	});