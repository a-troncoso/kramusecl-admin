'use strict';

angular
	.module('karamuseDjApp')

.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('login', {
			url: '/',
			templateUrl: 'views/login.html',
			controller: 'LoginCtrl',
			controllerAs: 'login'
		})
		.state('signup', {
			url: '/signup?token',
			templateUrl: 'views/signup.html',
			controller: 'SignupCtrl',
			controllerAs: 'signup'
		})
		.state('forgot-pass', {
			url: '/forgot-pass',
			templateUrl: 'views/forgot-pass.html',
			controller: 'ForgotPassCtrl',
			controllerAs: 'forgotPass'
		})
		.state('reset-pass?', {
			url: '/reset-pass?token',
			templateUrl: 'views/reset-pass.html',
			controller: 'ResetPassCtrl',
			controllerAs: 'resetPass'
		})
		.state('home', {
			url: '/home',
			templateUrl: 'views/home.html',
			controller: 'HomeCtrl',
			controllerAs: 'home'
		})
		.state('page-404', {
			url: '/404',
			templateUrl: 'views/page-404.html',
			controller: 'Page404Ctrl',
			controllerAs: 'page404'
		})
		.state('client', {
			abstract: true,
			url: '/client',
			template: '<ui-view/>',
			controller: 'ClientCtrl',
			controllerAs: 'client'
		})
		.state('client.home', {
			url: '/home',
			templateUrl: 'views/client-home.html',
			controller: 'ClientHomeCtrl',
			controllerAs: 'clientHome'
		});
	
	// $locationProvider.html5Mode(true);
});