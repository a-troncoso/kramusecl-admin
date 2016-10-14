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
    'ng.deviceDetector', //detecta el device
    'LocalStorageModule',
    'ui.router',
    'ui.bootstrap',
    'ui.footable',
    'picardy.fontawesome'
  ]);