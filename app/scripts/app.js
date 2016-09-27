'use strict';

/**
 * @ngdoc overview
 * @name karamuseclAdminApp
 * @description
 * # karamuseclAdminApp
 *
 * Main module of the application.
 */
angular
  .module('karamuseclAdminApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'satellizer',
    'ng.deviceDetector' //detecta el device
  ])

.config(function($authProvider) {

  $authProvider.oauth2({
    name: 'karamuse',
    url: '/auth/foursquare',
    clientId: 'Foursquare Client ID',
    redirectUri: window.location.origin,
    authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate',
  });

})

.config(function($authProvider) {
  $authProvider.loginUrl = "http://dev.karamuse.cl/public/api/login";
  $authProvider.tokenName = "token";
})

.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl',
      controllerAs: 'login'
    })
    .when('/main', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      controllerAs: 'main'
    })
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl',
      controllerAs: 'about'
    })

  .when('/signup/:token?', {
      templateUrl: 'views/signup.html',
      controller: 'SignupCtrl',
      controllerAs: 'signup'
    })
    .when('/forgot-pass', {
      templateUrl: 'views/forgot-pass.html',
      controller: 'ForgotPassCtrl',
      controllerAs: 'forgotPass'
    })
    .when('/reset-pass/:token?', {
      templateUrl: 'views/reset-pass.html',
      controller: 'ResetPassCtrl',
      controllerAs: 'resetPass'
    })
    .otherwise({
      redirectTo: '/'
    });
});