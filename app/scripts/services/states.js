'use strict';

angular
	.module('karamuseclAdminApp')

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('login', {
			url: '/',
			templateUrl: 'views/login.html',
			controller: 'LoginCtrl',
			controllerAs: 'login'
		})
		.state('main', {
			url: '/main',
			templateUrl: 'views/main.html',
			controller: 'MainCtrl',
			controllerAs: 'main'
		})
		.state('about', {
			url: '/about',
			templateUrl: 'views/about.html',
			controller: 'AboutCtrl',
			controllerAs: 'about'
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
		.state('reset-pass/:token?', {
			url: '/reset-pass/:token?',
			templateUrl: 'views/reset-pass.html',
			controller: 'ResetPassCtrl',
			controllerAs: 'resetPass'
		})
		.state('home', {
			url: '/home',
			templateUrl: 'views/home.html',
			controller: 'HomeCtrl',
			controllerAs: 'home'
		});
	$urlRouterProvider.otherwise("/");
});