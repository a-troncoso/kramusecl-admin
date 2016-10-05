'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:ActiveSessionModalInstanceCtrl
 * @description
 * # ActiveSessionModalInstanceCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
	.controller('ActiveSessionModalInstanceCtrl', function($log, $q, $uibModalInstance, $state, $auth, success, deviceDetector, Session
		) {

		var self = this, data = {};

		this.modal = {
			session: {
				data: {
					createdAt: new Date(success.data.data.session.created_at)
				}
			}
		};

		this.follow = function() {
			$uibModalInstance.close();
			//$state.go('home');

			// llamar a servicio codigos
		};

		this.openCloseSession = function() {

		};

		this.openSession = function() {
			//$uibModalInstance.dismiss('cancel');
			$log.log('openSession');

			var closeSession = self.closeSession();

			if (closeSession) {
				$log.log('voy a abrir una sesion');
				
				data = {
					action: 'open',
					origin: deviceDetector.os + '/' + deviceDetector.browser + '/' + deviceDetector.browser_version,
					token: $auth.getToken()
				};

				Session.save(data, function(success){
					$log.log(success);
					// llamar a servicio codigos
				}, function(error){
					$log.log(error);
				});
			} else {
				$log.log('hubo un error al cerrar sesion');
			}

		};
		
		this.closeSession = function() {

			var deferred = $q.defer();
			
			data = {
				action: 'close',
				token: $auth.getToken()
			};

			Session.save(data, function(success){
				if (success.status === 200) {
					deferred.resolve(true);
				} else {
					deferred.resolve(false);
				}
			}, function(error){
				$log.log(error);
				deferred.resolve(false);
			});
			return deferred.promise;
		};

	});