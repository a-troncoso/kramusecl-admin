'use strict';

angular
	.module('karamuseDjApp')

.run(function($rootScope, $state) {

	$rootScope.loader = {
		show: false
	};

});

angular
	.module('karamuseClientApp')

.run(function($log) {


});