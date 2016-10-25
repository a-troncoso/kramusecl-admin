'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:GenerateCodesModalInstanceCtrl
 * @description
 * # GenerateCodesModalInstanceCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
  .controller('GenerateCodesModalInstanceCtrl', function($rootScope, $log, $q, $uibModal, $uibModalInstance, $timeout, $auth, $state, $interval, Codes, data, Session, deviceDetector) {

    var self = this;

    this.modal = {
      title: {
        text: '¿Cuántos códigos quieres?',
        show: true
      },
      subtitle: {
        text: '',
        danger: true,
        show: false
      },
      buttons: {
        send: {
          disabled: false
        }
      },
      form: {
        codes: {
          value: 1,
          max: 20 - parseInt(data.value),
          min: 1,
          step: 5
        }
      }
    };

    var timer;

    this.keyDown = function(action, value) {
      self.modal.form.codes.value = value;
      if (self.modal.subtitle.show) {
        $timeout(function() {
          self.modal.subtitle.show = false;
        }, 800);
      }

      if (timer) {
        return;
      }

      if (action === 'dec') {
        timer = $interval(function() {
          if (!isNaN(self.modal.form.codes.value)) {
            if (self.modal.form.codes.value > self.modal.form.codes.min) {
              self.modal.form.codes.value--;
            } else {
              $interval.cancel(timer);
            }
          }
        }, 60);
      } else if (action === 'inc') {
        timer = $interval(function() {
          if (!isNaN(self.modal.form.codes.value)) {
            if (self.modal.form.codes.value < self.modal.form.codes.max) {
              self.modal.form.codes.value++;
            } else {
              $interval.cancel(timer);
            }
          }
        }, 60);
      }
    };

    this.keyUp = function() {
      $interval.cancel(timer);
      timer = null;
    };

    this.generateCodes = function() {
      $rootScope.loader.show = true;
      self.modal.subtitle.show = false;
      self.modal.buttons.send.disabled = true;

      Codes.generate({
        action: self.modal.form.codes.value,
        token: $auth.getToken()
      }, function(success) {
        // $log.log(success);
        $rootScope.loader.show = false;
        self.modal.buttons.send.disabled = false;
        self.modal.subtitle.text = '';
        self.modal.subtitle.show = true;
        if (success.status === 200) {
          $uibModalInstance.close();
          $state.go('home');
        } else if (success.status === 201) {
          self.modal.subtitle.text = '¡Esos son muchos códigos!, pueden ser máximo ' + self.modal.form.codes.max;
        } else if (success.status === 400) {
          self.modal.subtitle.text = '¡Pst!, debes indicar un número en el cajón del medio';
        } else if (success.status === 402) {
          self.openModalDialog({
            title: '¡Vaya, vaya!',
            subtitle: 'No tienes una sesión abierta',
            submit: {
              text: 'Abrir sesión',
              function: function() {
                return self.openSession();
              },
              show: true
            },
            cancel: {
              text: 'Cancelar',
              function: null,
              show: false
            }
          });
        } else {
          self.modal.subtitle.text = '¡Ups!, ocurrió un problema al generar los códigos';
        }
      }, function(error) {
        $log.error(error);
        $rootScope.loader.show = false;
        self.modal.subtitle.text = 'Mmm.. parece que tienes que recargar la página';
        self.modal.subtitle.show = true;
      });
    };

    this.cancel = function() {
      $uibModalInstance.dismiss();
    };

    this.openModalDialog = function(data) {
      var modalInstance = $uibModal.open({
        animation: true,
        backdrop: 'static',
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'dialog.html',
        controller: 'DialogModalInstanceCtrl',
        controllerAs: 'dialogModal',
        size: 'md',
        resolve: {
          data: function() {
            return data;
          }
        }
      });

      modalInstance.result.then(function() {}, function() {});
    };

    this.openSession = function() {

      var deferred = $q.defer();

      Session.save({
        action: 'open',
        origin: deviceDetector.os + '/' + deviceDetector.browser + '/' + deviceDetector.browser_version,
        token: $auth.getToken()
      }, function(success) {
        // $log.log(success);
        if (success.status === 200 || success.status === 201) {
          deferred.resolve({
            status: success.status
          });
        } else {
          deferred.reject({
            status: success.status
          });
        }
        // llamar a servicio codigos
      }, function(error) {
        $log.error(error);
        deferred.reject({
          status: 400
        });
      });
      return deferred.promise;
    };

    if (this.modal.form.codes.max > 0) {
      this.modal.title.text = '¿Cuántos códigos quieres?';
    } else {
      this.modal.title.text = 'No puedes generar más códigos';
    }

  });