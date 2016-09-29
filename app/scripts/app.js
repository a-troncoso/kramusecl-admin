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
    'LocalStorageModule'
  ])

.constant('API_URL_BASE', 'http://dev.karamuse.cl/public/api')

.run(function($rootScope) {

  $rootScope.$on('$stateChangeStart', function(e, toState) {

    $log.log(toState);

      var isSafe = toState.name === 'login' || toState.name === 'reset-pass' || toState.name === 'forgot-pass' || toState.name === 'signup' || toState.name === 'page404';

      if (isSafe) {
        return;
      }

      if (!Utils.getInStorage('logged')) {
        e.preventDefault(); // stop current execution
        $location.path('login'); // go to login
      }

  });
})

.config(function($authProvider, API_URL_BASE) {
  $authProvider.loginUrl = API_URL_BASE + "/login";
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
    .when('/home', {
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl',
      controllerAs: 'home'
    })
    .otherwise({
      redirectTo: '/'
    });
});