'use strict';

angular
	.module('karamuseClientApp')

.config(function($authProvider, $mdThemingProvider, API_URL_BASE) {
	$authProvider.loginUrl = API_URL_BASE + "/login";
	$authProvider.tokenPrefix = '';

	$mdThemingProvider
		.theme('karamuseTheme')
		.primaryPalette('blue', {
			default: '500',
			'hue-1': 'A100',
		})
		.accentPalette('orange', {
			default: '600'
		})
		.warnPalette('red', {
			default: '900'
		})
		.backgroundPalette('grey');

	$mdThemingProvider.setDefaultTheme('karamuseTheme');
});