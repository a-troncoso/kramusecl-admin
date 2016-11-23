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
			sent: 0,
			notSent: 0
		};

		this.ticket = Utils.getInStorage('ticket') || {
			orders: [],
			code: null
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
			var ordersSent = 0,
				ordersNotSent = 0;
			for (var i = 0; i < self.ticket.orders.length; i++) {
				if (self.ticket.orders[i].result.added) {
					ordersSent++;
				} else {
					ordersNotSent++;
				}
			}
			self.orders.sent = ordersSent;
			self.orders.notSent = ordersNotSent;
		};

		self.calculateOrdersSent();


	});