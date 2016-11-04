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
		});
});