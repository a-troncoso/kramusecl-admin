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
    'angularMoment'
  ]);

angular
  .module('karamuseClientApp', [
    'ui.router',
    'satellizer',
    'ui.bootstrap',
    'ngMaterial',
    'youtube-embed'
  ]);

angular
  .module('karamuseApp', [
    'karamuseDjApp',
    'karamuseClientApp'
  ]);