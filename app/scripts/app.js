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
    'ngTouch'
  ])
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
    .otherwise({
      redirectTo: '/'
    });
  });