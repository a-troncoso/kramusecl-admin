'use strict';

/**
 * @ngdoc overview
 * @name karamuseDjApp
 * @description
 * # karamuseDjApp
 *
 * Main module of the application.
 */

angular
  .module('karamuseDjApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'satellizer',
    'ng.deviceDetector',
    'LocalStorageModule',
    'ui.router',
    'ui.bootstrap',
    'ui.footable',
    'picardy.fontawesome',
    'ngclipboard',
  ]);

angular
  .module('karamuseClientApp', ['ui.router', 'ui.bootstrap']);

angular
  .module('karamuseApp', [
    'karamuseDjApp',
    'karamuseClientApp'
  ]);