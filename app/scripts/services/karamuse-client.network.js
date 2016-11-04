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

.factory('Token', function($resource, API_URL_BASE) {

	return $resource(API_URL_BASE + '/client/access_token', {}, {
		save: {
			method: 'POST'
		}
	});
})

.factory('Catalog', function($resource, API_URL_BASE) {

	return $resource(API_URL_BASE + '/catalog/:keyword', {
		keyword: '@keyword'
	}, {
		query: {
			method: 'GET',
			params: {
				sizePage: '@sizePage',
				numPage: '@numPage',
				token: '@token'
			}
		},
		save: {
			method: 'POST'
		}
	});
});