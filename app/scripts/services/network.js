'use strict';

angular
	.module('karamuseclAdminApp')

.factory('Signup', function($resource, API_URL_BASE) {

	return $resource(API_URL_BASE + '/register/:action', {
		action: '@action'
	}, {
		save: {
			method: 'POST',
			headers: {
				'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
			transformRequest: function(obj) {
				var str = [];
				for (var p in obj) {
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				}
				return str.join("&");
			}
		},
		validateToken: {
			method: 'POST',
			headers: {
				'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
			transformRequest: function(obj) {
				var str = [];
				for (var p in obj) {
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				}
				return str.join("&");
			}
		}
	});
})

.factory('RenewPass', function($resource, API_URL_BASE) {

	return $resource(API_URL_BASE + '/register/renewpass/:step', {
		step: '@step'
	}, {
		query: {
			method: 'POST'
		},
		transformRequest: function(obj) {
			var str = [];
			for (var p in obj) {
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			}
			return str.join("&");
		}
	});
})

.factory('ChileRegions', function($resource) {

	return $resource('https://apis.modernizacion.cl/dpa/regiones', {}, {
		query: {
			method: 'GET',
			isArray: true
		}
	});
})

.factory('ChileProvinces', function($resource) {

	return $resource('https://apis.modernizacion.cl/dpa/regiones/:regionId/provincias', {
		regionId: '@regionId'
	}, {
		query: {
			method: 'GET',
			isArray: true
		}
	});
})

.factory('ChileCommunes', function($resource) {

	return $resource('https://apis.modernizacion.cl/dpa/regiones/:regionId/provincias/:provinceId/comunas', {
		regionId: '@regionId',
		provinceId: '@provinceId'
	}, {
		query: {
			method: 'GET',
			isArray: true
		}
	});
})

.factory('Session', function($resource, API_URL_BASE) {

	return $resource(API_URL_BASE + '/sessions/:action', {
		action: '@action'
	}, {
		save: {
			method: 'POST'
		}
	});
})

.factory('Codes', function($resource, API_URL_BASE) {

	return $resource(API_URL_BASE + '/codes/:action', {
		action: '@action'
	}, {
		verify: {
			method: 'GET',
			params: {
				token: '@token'
			}
		},
		generate: {
			method: 'POST'
		}
	});
})

.factory('CodeState', function($resource, API_URL_BASE) {

	return $resource(API_URL_BASE + '/codes/:code/state/:state', {
		code: '@code',
		state: '@state'
	}, {
		set: {
			method: 'PUT'
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
			}
		},
		update: {
			method: 'PUT'
		}
	});
})

.factory('Catalog', function($resource, API_URL_BASE) {

	return $resource(API_URL_BASE + '/catalog/:field', {
		field: '@field'
	}, {
		query: {
			method: 'GET',
			isArray: true
		}
	});
});