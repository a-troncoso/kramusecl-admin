'use strict';

angular
	.module('karamuseClientApp')

.factory('Bars', function($resource, API_URL_BASE) {

	return $resource(API_URL_BASE + '/client/bars', {}, {
		query: {
			method: 'GET',
			isArray: true,
			headers: {
				'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
				Accept:'text/html,application/json,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
			},
			cache: false
		}
	});
})

.factory('Token', function($resource, API_URL_BASE) {

	return $resource(API_URL_BASE + '/client/access_token', {}, {
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			}
		},

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
			},
			isArray: true
		},
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			}
		}
	});
})

.factory('Orders', function($resource, API_URL_BASE) {

	return $resource(API_URL_BASE + '/orders/:idOrder', {
		idOrder: '@idOrder'
	}, {
		query: {
			method: 'GET',
			params: {
				token: '@token'
			},
			isArray: true
		},
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			}
		},
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			}
		}
	});
})

.factory('Codes', function($resource, API_URL_BASE) {

	return $resource(API_URL_BASE + '/codes/validate/:code', {
		code: '@code'
	}, {
		verify: {
			method: 'GET',
			params: {
				token: '@token'
			}
		}
	});
});