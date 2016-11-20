'use strict';

angular
	.module('karamuseClientApp')

.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('client', {
			abstract: true,
			url: '/client',
			template: '<ui-view/>',
			controller: 'ClientCtrl',
			controllerAs: 'client'
		})
		.state('client.home', {
			url: '/home',
			templateUrl: 'views/karamuse-client.client-home.html',
			controller: 'ClientHomeCtrl',
			controllerAs: 'clientHome'
		})
		.state('client.search-karaoke', {
			url: '/search-karaoke',
			templateUrl: 'views/karamuse-client.search-karaoke.html',
			controller: 'SearchKaraokeCtrl',
			controllerAs: 'searchKaraoke'
		})
		.state('client.results', {
			url: '/results',
			templateUrl: 'views/karamuse-client.results.html',
			controller: 'ResultsCtrl',
			controllerAs: 'results'
		})
		.state('client.karaoke-details', {
			url: '/details',
			params: {
				id: null,
				url: null,
				avatar: null,
				title: null
			},
			templateUrl: 'views/karamuse-client.karaoke-details.html',
			controller: 'KaraokeDetailsCtrl',
			controllerAs: 'karaokeDetails'
		})
		.state('client.empty-state', {
			url: '/empty-state',
			params: {
				data: null
			},
			templateUrl: 'views/karamuse-client.empty-state.html',
			controller: 'EmptyStateCtrl',
			controllerAs: 'emptyState'
		})
		.state('client.banner', {
			url: '/karamuse-client.banner',
			templateUrl: 'views/karamuse-client.banner.html',
			controller: 'BannerCtrl',
			controllerAs: 'banner'
		});
});