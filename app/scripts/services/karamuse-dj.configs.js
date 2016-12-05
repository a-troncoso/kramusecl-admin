'use strict';

angular
	.module('karamuseDjApp')

.config(function($authProvider, API_URL_BASE) {
	$authProvider.loginUrl = API_URL_BASE + "/login";
	$authProvider.tokenPrefix = '';
});