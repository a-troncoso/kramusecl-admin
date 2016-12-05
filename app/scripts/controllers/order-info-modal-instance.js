'use strict';

/**
 * @ngdoc function
 * @name karamuseDjApp.controller:OrderInfoModalInstanceCtrl
 * @description
 * # OrderInfoModalInstanceCtrl
 * Controller of the karamuseDjApp
 */
angular.module('karamuseDjApp')
	.controller('OrderInfoModalInstanceCtrl', function($log, $uibModalInstance, $window, orderData) {

		var i = 0,
			dateString = '',
			hours, minutes, seconds, summatory = new Date(0, 0, 0, 0, 0, 0, 0);

		for (i = 0; i < orderData.firstOrders.length; i++) {

			dateString = orderData.firstOrders[i].time;

			hours = parseInt(dateString.substring(0, 2));
			minutes = parseInt(dateString.substring(3, 5));
			seconds = parseInt(dateString.substring(6, 8));

			summatory = new Date(0, 0, 0, summatory.getHours() + hours, summatory.getMinutes() + minutes, summatory.getSeconds() + seconds, 0);
		}

		// $log.log(summatory);

		this.orderData = {
			ticket: orderData.ticket,
			artist: orderData.artist,
			song: orderData.song,
			createdAt: orderData.createdAt,
			state: orderData.state,
			origin: orderData.origin,
			code: orderData.codeClient,
			time: '00:04:00',
			waitTime: summatory,
			url: orderData.url ? orderData.url : 'Link no disponible',
			isUrl: orderData.url ? true : false,
			message: orderData.message
		};

		this.cancel = function() {
			$uibModalInstance.dismiss();
		};

		this.watchKaraoke = function(url) {
			$window.open(url, '', 'width=1024,height=600,left=100,top=50');
		};


	});