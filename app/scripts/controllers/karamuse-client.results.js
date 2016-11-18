'use strict';

/**
 * @ngdoc function
 * @name karamuseDjApp.controller:ResultsCtrl
 * @description
 * # ResultsCtrl
 * Controller of the karamuseDjApp
 */
angular.module('karamuseClientApp')
	.controller('ResultsCtrl', function($rootScope, $auth, $log, $mdDialog, Utils, Catalog) {

		var self = this,
			i = 0;

		this.bar = {
			info: Utils.getInStorage('bar')
		};

		this.catalog = $rootScope.catalog;

		this.elements = {
			buttons: {
				back: {
					disabled: true
				},
				next: {
					disabled: true
				}
			}
		};

		this.temporalOrders = {
			list: Utils.getInStorage('temporalOrders') || []
		};

		if (self.catalog) {
			if (this.catalog.pagination.totalPages === 1) {
				this.elements.buttons.next.disabled = true;
			} else {
				this.elements.buttons.next.disabled = false;
			}
		} else {
			this.elements.buttons.next.disabled = true;
		}

		this.getKaraokes = function(keyword, sizePage, numPage, mode) {

			// si el numero de página siguiente es menor a la cantidad total de paginas, se desbloquea el boton sgte
			if (numPage + 1 < self.catalog.pagination.totalPages) {
				self.elements.buttons.next.disabled = false;
			} else { // si es mayor se desactiva el boton siguiente
				self.elements.buttons.next.disabled = true;
			}

			// si el modo es back, se resta el numero pag
			if (mode === 'back') {
				numPage--;
				// si el numero de pagina es 1, se bloquea el botón atrás
				if (numPage === 1) {
					self.elements.buttons.back.disabled = true;
				}
			} else if (mode === 'next') {
				numPage++;
				self.elements.buttons.back.disabled = false; // si voy a siguiente, se desactiva el boton atrás
			}

			self.catalog.pagination.currentPage = numPage;
			self.catalog.list = [];

			Catalog.query({
				keyword: keyword,
				sizePage: sizePage,
				numPage: numPage,
				token: $auth.getToken()
			}, function(success) {
				$log.log(success);
				if (success.status === 200) { // 200 = hay resultados
					self.catalog.pagination.totalPages = success.totalPages;
					self.catalog.pagination.totalResults = success.totalResults;
					self.catalog.pagination.show = true;

					for (i = 0; i < success.data.length; i++) {
						if (success.data[i].active === '1') {
							self.catalog.list.push({
								id: success.data[i].id,
								title: success.data[i].title,
								url: success.data[i].url,
								active: success.data[i].active,
								avatar: 'https://img.youtube.com/vi/' + success.data[i].url.substring(success.data[i].url.indexOf('=') + 1, success.data[i].url.length) + '/sddefault.jpg'
							});
						}
					}

					// $state.go('client.results');
				} else if (success.status === 404) {
					// $log.error(success);
					// self.modal.message.catalog.text = 'No encontramos karaokes :('; // 404 = no hay resultados
					// self.modal.message.catalog.show = true;
				}
			}, function(error) {
				$log.error(error);
				// self.openModalDialog({
				// 	title: 'Houston, tenemos un problema...',
				// 	subtitle: 'Ha ocurrido un error al buscar tus karaokes D:',
				// 	submit: {
				// 		text: 'Reintentar',
				// 		function: function() {
				// 			return self.getKaraokes(self.catalog.criterion.text, self.catalog.pagination.sizePage, self.catalog.pagination.currentPage);
				// 		},
				// 		show: true
				// 	},
				// 	cancel: {
				// 		text: 'Cancelar',
				// 		function: null
				// 	}
				// });
			});
		};

		this.openDialogKataokeDetails = function(karaokeSelected) {
			karaokeSelected.fromResults = true;

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

		this.gotoState = function(state) {
			Utils.gotoState(state);
		};

	});