'use strict';

/**
 * @ngdoc function
 * @name karamuseClientApp.controller:SearchKaraokeCtrl
 * @description
 * # SearchKaraokeCtrl
 * Controller of the karamuseClientApp
 */
angular.module('karamuseClientApp')
	.controller('SearchKaraokeCtrl', function(Utils) {

		var self = this;

		this.bar = {
			info: Utils.getInStorage('bar')
		};

		this.form = {
			search: {
				text: ''
			},
			buttons: {
				search: {
					disabled: false
				}
			}
		};


	});