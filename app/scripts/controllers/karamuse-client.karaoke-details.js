'use strict';

/**
 * @ngdoc function
 * @name karamuseClientApp.controller:KaraokeDetailsCtrl
 * @description
 * # KaraokeDetailsCtrl
 * Controller of the karamuseClientApp
 */
angular.module('karamuseClientApp')
	.controller('KaraokeDetailsCtrl', function($log, $q, $state, $mdDialog, deviceDetector, karaokeSelected, Utils) {

		var self = this,
			deferred = null,
			temporalOrders = Utils.getInStorage('temporalOrders') || []

		this.elements = {
			karaoke: {
				id: karaokeSelected.id || 1,
				url: karaokeSelected.url || 'https://www.youtube.com/watch?v=moCSOP4Y2KU',
				avatar: karaokeSelected.avatar || 'http://cumbrianrun.co.uk/wp-content/uploads/2014/02/default-placeholder.png',
				title: karaokeSelected.title || 'No indica'
			},
			buttons: {
				add: {
					disabled: false,
					show: karaokeSelected.fromResults
				}
			}
		};

		this.openDialogNameOrMessage = function(order) {
			$mdDialog.show({
					controller: 'NameOrMessageCtrl',
					controllerAs: 'nameOrMessage',
					templateUrl: 'karamuse-client.nameOrMessage.tmpl.html',
					parent: angular.element(document.querySelector('#dialogContainer')),
					clickOutsideToClose: true,
					fullscreen: true, // Only for -xs, -sm breakpoints.
					locals: {
						order: order
					}
				})
				.then(function() {}, function() {});
		};

		this.openDialogTicket = function() {
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

			if (!karaokeSelected.fromResults) {
				self.openDialogTicket();
			}

		};

	});