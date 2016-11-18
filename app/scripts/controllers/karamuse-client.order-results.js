'use strict';

/**
 * @ngdoc function
 * @name karamuseDjApp.controller:OrderResultsCtrl
 * @description
 * # OrderResultsCtrl
 * Controller of the karamuseDjApp
 */
angular.module('karamuseDjApp')
	.controller('OrderResultsCtrl', function($mdDialog, Utils) {

		var self = this;

		this.orders = {
			sent: 0
		};

		this.temporalOrders = {
			list: Utils.getInStorage('temporalOrders') || []
		};

		this.removeStorageItem = function(item) {
			Utils.removeStorageItem(item);
		};

		this.gotoState = function(state) {
			Utils.gotoState(state);
		};

		this.closeDialog = function() {
			$mdDialog.cancel();
		};

		this.calculateOrdersSent = function() {
			var ordersSent = 0;
			for (var i = 0; i < self.temporalOrders.list.length; i++) {
				if (self.temporalOrders.list[i].result.added) {
					ordersSent++;
				}
			}
			self.orders.sent = ordersSent;
		};

		self.calculateOrdersSent();


	});