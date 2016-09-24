'use strict';

var API_URL_BASE = 'http://dev.karamuse.cl/public/api';
// var API_URL_BASE = 'http://192.168.1.194/public/api';

angular
	.module('karamuseclAdminApp')

.factory('Signup', function($resource) {

	return $resource(API_URL_BASE + '/register', {}, {
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
		}
	});
})

.factory('Login', function($resource) {

	return $resource(API_URL_BASE + '/login', {}, {
		save: {
			method: 'POST',
			headers: {
				'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
			}
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
});