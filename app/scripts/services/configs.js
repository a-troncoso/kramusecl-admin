'use strict';

angular
	.module('karamuseApp')

.config(function($authProvider, API_URL_BASE) {
	$authProvider.loginUrl = API_URL_BASE + "/login";
});