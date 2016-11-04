'use strict';

angular
	.module('karamuseClientApp')

.factory('Bars', function($resource, API_URL_BASE) {

	return $resource(API_URL_BASE + '/client/bars', {}, {
		query: {
			method: 'GET'
		}
	});
})
