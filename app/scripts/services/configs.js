'use strict';

angular
	.module('karamuseclAdminApp')

.config(function($authProvider, API_URL_BASE) {
	$authProvider.loginUrl = API_URL_BASE + "/login";
});