'use strict';

angular
	.module('karamuseClientApp')

.service('Bars', function($resource, API_URL_BASE, $q, $http) {

	this.getBars = _getBars;

	function _getBars() {

		var deferred = $q.defer();

		$http({
				method: 'get',
				url: API_URL_BASE + '/client/bars',
				headers: {
					'Content-Type': "application/json"
				}
			})
			.then(function(success) {
				deferred.resolve(success);
			})
			.catch(function(error) {
				deferred.reject(error);
			});

		return deferred.promise

	};
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