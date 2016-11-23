'use strict';

/**
 * @ngdoc function
 * @name karamuseClientApp.controller:SearchKaraokeCtrl
 * @description
 * # SearchKaraokeCtrl
 * Controller of the karamuseClientApp
 */
angular.module('karamuseClientApp')
	.controller('SearchKaraokeCtrl', function($rootScope, $location, $auth, $log, $state, Utils, Catalog) {

		var self = this,
			i = 0;

		this.bar = {
			info: Utils.getInStorage('bar')
		};

		this.form = {
			buttons: {
				search: {
					disabled: false
				}
			}
		};

		$rootScope.catalog = {
			list: [],
			pagination: {
				show: false,
				currentPage: 1,
				sizePage: 100,
				maxSize: 5,
				totalResults: 1,
				totalPages: 1
			},
			show: false,
			criterion: {
				text: '',
				focus: true
			}
		};

		this.getKaraokes = function(keyword, sizePage, numPage) {
			$rootScope.clientGlobalLoader.show = true;
			Catalog.query({
				keyword: keyword,
				sizePage: sizePage,
				numPage: numPage,
				token: $auth.getToken()
			}, function(success) {
				// $log.log(success);
				if (success.status === 200) { // 200 = hay resultados
					$rootScope.catalog.pagination.totalPages = success.totalPages;
					$rootScope.catalog.pagination.totalResults = success.totalResults;
					$rootScope.catalog.pagination.show = true;

					for (i = 0; i < success.data.length; i++) {
						if (success.data[i].active === '1') {
							$rootScope.catalog.list.push({
								id: success.data[i].id,
								artist: success.data[i].artist,
								song: success.data[i].song,
								url: success.data[i].url,
								active: success.data[i].active,
								avatar: success.data[i].url ? 'https://img.youtube.com/vi/' + success.data[i].url.substring(success.data[i].url.indexOf('=') + 1, success.data[i].url.length) + '/sddefault.jpg' : 'http://cumbrianrun.co.uk/wp-content/uploads/2014/02/default-placeholder.png',
								disabled: false
							});
						}
					}
					$rootScope.clientGlobalLoader.show = false;
					$state.go('client.results');
				} else if (success.status === 404) { // 404 = no hay resultados
					self.gotoEmptyState(keyword);
				}
			}, function(error) {
				$log.error(error);
			});
		};

		this.gotoEmptyState = function(data) {
			Utils.gotoState('client.empty-state', {
				data: {
					messages: {
						primary: 'que contengan `' + data + '`'
					}
				}
			});
		};

		this.gotoState = function(state) {
			Utils.gotoState(state);
		};


	});