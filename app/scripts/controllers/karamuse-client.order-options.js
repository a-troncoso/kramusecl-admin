'use strict';

/**
 * @ngdoc function
 * @name karamuseDjApp.controller:OrderOptionsCtrl
 * @description
 * # OrderOptionsCtrl
 * Controller of the karamuseDjApp
 */
angular.module('karamuseDjApp')
	.controller('OrderOptionsCtrl', function($log, $mdDialog, Utils, order) {

		this.order = order;

		var i = 0;

		this.openDialogKataokeDetails = function(karaokeSelected) {

			karaokeSelected.fromResults = false;

			$mdDialog.show({
					controller: 'KaraokeDetailsCtrl',
					controllerAs: 'karaokeDetails',
					templateUrl: 'karamuse-client.karaoke-details.tmpl.html',
					parent: angular.element(document.querySelector('#dialogContainer')),
					clickOutsideToClose: true,
					fullscreen: true, // Only for -xs, -sm breakpoints.
					locals: {
						karaokeSelected: karaokeSelected
					}
				})
				.then(function() {}, function() {});
		};

		this.delete = function() {
			var temporalOrders = Utils.getInStorage('temporalOrders'),
				currentOrder = order;

			for (i = 0; i < temporalOrders.length; i++) {
				if (temporalOrders[i].id === currentOrder.id) {
					temporalOrders.splice(i, 1);
					break;
				}
			}
			Utils.setInStorage('temporalOrders', temporalOrders)
		};

		this.openDialogTicket = function(ev) {
			$mdDialog.show({
					controller: 'TicketCtrl',
					controllerAs: 'ticket',
					templateUrl: 'karamuse-client.ticket.tmpl.html',
					parent: angular.element(document.querySelector('#dialogContainer')),
					clickOutsideToClose: true,
					fullscreen: true, // Only for -xs, -sm breakpoints.
					locals: {
						orderWarnings: null
					}
				})
				.then(function() {}, function() {});
		};

		this.closeDialog = function() {
			$mdDialog.cancel();
		};

	});