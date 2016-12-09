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
			i = 0,
			ticket = Utils.getInStorage('ticket') || {
				orders: [],
				code: null
			};

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
				},
				search: {
					state: 1
				}
			},
			inputs: {
				search: {
					show: false,
					value: ''
				}
			},
			content: {
				fill: {
					show: false
				},
				empty: {
					show: true
				}
			}
		};

		this.pagination = {
			totalPages: 0,
			sizePage: 100,
			currentPage: 1
		};

		this.results = {
			list: []
		};

		this.ticket = Utils.getInStorage('ticket') || {
			orders: [],
			code: null
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

		// 1: estado escondido; 2: estado visible
		this.switchSearch = function(state) {
			if (state === 1) {
				self.elements.content.fill.show = false;
				self.elements.content.empty.show = true;
				self.elements.inputs.search.show = true;
				self.elements.buttons.search.state = 2;
			} else if (state === 2) {
				self.elements.content.fill.show = true;
				self.elements.content.empty.show = false;
				$log.log(self.elements.inputs.search.value);
				$log.log(self.pagination.sizePage);
				$log.log(self.pagination.currentPage);
				self.getKaraokes(self.elements.inputs.search.value, self.pagination.sizePage, self.pagination.currentPage);
			}
		};

		this.getKaraokes = function(keyword, sizePage, numPage, mode) {
			$rootScope.clientGlobalLoader.show = true;

			// // si el numero de página siguiente es menor a la cantidad total de paginas, se desbloquea el boton sgte
			// if (numPage + 1 < self.catalog.pagination.totalPages) {
			// 	self.elements.buttons.next.disabled = false;
			// } else {
			// 	// si es mayor se desactiva el boton siguiente
			// 	self.elements.buttons.next.disabled = true;
			// }

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

			// self.catalog.pagination.currentPage = numPage;
			self.results.list = [];

			Catalog.query({
				keyword: keyword,
				sizePage: sizePage,
				numPage: numPage,
				token: $auth.getToken()
			}, function(success) {
				$rootScope.clientGlobalLoader.show = false;
				if (success.status === 200) { // 200 = hay resultados
					// self.catalog.pagination.totalPages = success.totalPages;
					// self.catalog.pagination.totalResults = success.totalResults;
					// self.catalog.pagination.show = true;

					for (i = 0; i < success.data.length; i++) {
						if (success.data[i].active === '1') {
							self.results.list.push({
								id: success.data[i].id,
								artist: success.data[i].artist,
								song: success.data[i].song,
								url: success.data[i].url,
								active: success.data[i].active,
								avatar: success.data[i].url ? 'https://img.youtube.com/vi/' + success.data[i].url.substring(success.data[i].url.indexOf('=') + 1, success.data[i].url.length) + '/0.jpg' : 'http://cumbrianrun.co.uk/wp-content/uploads/2014/02/default-placeholder.png',
								disabled: false
							});
						}
					}
				}
			}, function(error) {
				$log.error(error);
			});
		};

		// Valida si ya está en lista temporal el pedido
		this.validateOrderInTicket = function(order) {
			var isInTicket = false;

			for (i = 0; i < ticket.orders.length; i++) {
				if (ticket.orders[i].id === order.id) {
					isInTicket = true;
					break;
				}
			}
			return isInTicket;
		};

		this.openDialogCustomAlert = function(data) {
			$mdDialog.show({
					controller: 'CustomAlertCtrl',
					controllerAs: 'customAlert',
					templateUrl: 'karamuse-client.custom-alert.tmpl.html',
					parent: angular.element(document.querySelector('#dialogContainer')),
					clickOutsideToClose: true,
					fullscreen: false, // Only for -xs, -sm breakpoints.
					locals: {
						data: data
					}
				})
				.then(function() {}, function() {});
		};

		this.openDialogNameOrMessage = function(order) {

			if (self.validateOrderInTicket(order)) {
				self.openDialogCustomAlert({
					title: '¡Hey!',
					subtitle: '',
					body: {
						paragraph1: 'Ya tienes este karaoke en tu ticket'
					}
				});
			} else {
				$mdDialog.show({
						controller: 'NameOrMessageCtrl',
						controllerAs: 'nameOrMessage',
						templateUrl: 'karamuse-client.nameOrMessage.tmpl.html',
						parent: angular.element(document.querySelector('#dialogContainer')),
						clickOutsideToClose: true,
						fullscreen: false, // Only for -xs, -sm breakpoints.
						locals: {
							order: order
						}
					})
					.then(function() {}, function() {});
			}
		};

		var openDialogNameOrMessage = function(order) {

			if (self.validateOrderInTicket(order)) {
				self.openDialogCustomAlert({
					title: '¡Hey!',
					subtitle: '',
					body: {
						paragraph1: 'Ya tienes este karaoke en tu ticket'
					}
				});
			} else {
				$mdDialog.show({
						controller: 'NameOrMessageCtrl',
						controllerAs: 'nameOrMessage',
						templateUrl: 'karamuse-client.nameOrMessage.tmpl.html',
						parent: angular.element(document.querySelector('#dialogContainer')),
						clickOutsideToClose: true,
						fullscreen: false, // Only for -xs, -sm breakpoints.
						locals: {
							order: order
						}
					})
					.then(function() {}, function() {});
			}
		};

		var openDialogKaraokeDetails = function(karaokeSelected) {
			karaokeSelected.fromResults = true;

			$mdDialog.show({
					controller: 'KaraokeDetailsCtrl',
					controllerAs: 'karaokeDetails',
					templateUrl: 'karamuse-client.karaoke-details.tmpl.html',
					parent: angular.element(document.querySelector('#dialogContainer')),
					clickOutsideToClose: true,
					fullscreen: false, // Only for -xs, -sm breakpoints.
					locals: {
						karaokeSelected: karaokeSelected
					}
				})
				.then(function() {}, function() {});
		};

		this.validateKaraokeUrl = function(karaokeSelected) {
			// $log.log(karaokeSelected);
			if (karaokeSelected.url) {
				openDialogKaraokeDetails(karaokeSelected);
			} else {
				openDialogNameOrMessage(karaokeSelected);
			}
		};

		this.openDialogTicket = function() {
			console.log("length: " + this.ticket.orders.length);
			console.log("data: " + JSON.stringify(this.ticket.orders));
			if (this.ticket.orders.length === 0) {
				this.openDialogCustomAlert({
					title: '¡Hey!',
					subtitle: '',
					body: {
						paragraph1: 'No tienes Karaokes agregados por el momento.'
					}
				});
				return;
			}

			$mdDialog.show({
					controller: 'TicketCtrl',
					controllerAs: 'ticket',
					templateUrl: 'karamuse-client.ticket.tmpl.html',
					parent: angular.element(document.querySelector('#dialogContainer')),
					clickOutsideToClose: true,
					fullscreen: false, // Only for -xs, -sm breakpoints.
					locals: {
						orderWarnings: null
					}
				})
				.then(function() {}, function() {});

		};

		this.gotoState = function(state) {
			Utils.gotoState(state);
		};

		self.switchSearch(1);

	});