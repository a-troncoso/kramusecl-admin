'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:AddOrderModalInstanceCtrl
 * @description
 * # AddOrderModalInstanceCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
	.controller('AddOrderModalInstanceCtrl', function($log, Catalog, deviceDetector) {

		var self = this,
			i = 0,
			temporalOrder = [];

		this.modal = {};

		this.catalog = {
			list: [],
			show: false,
			criterion: ''
		};

		this.displayC1atalog = function(field) {
			self.catalog.list = [];

			Catalog.query({
				field: field
			}, function(success) {
				$log.log(success);
				for (i = 0; i < success.length; i++) {
					if (success[i].active === '1') {
						self.catalog.list.push({
							id: success[i].id,
							title: success[i].title,
							url: success[i].url,
							active: success[i].active
						});
					}
				}
			}, function(error) {
				$log.log(error);
			});
		};

		this.addTemporalOrder = function(idKaraoke) {
			temporalOrder.push({
				id_karaoke: idKaraoke,
				origin: deviceDetector.os
			});
			$log.log(temporalOrder);
		};

	});