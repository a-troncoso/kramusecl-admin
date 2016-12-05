'use strict';

angular
	.module('karamuseClientApp')

.run(function($rootScope) {

	$rootScope.clientGlobalLoader = {
		show: false
	};
});