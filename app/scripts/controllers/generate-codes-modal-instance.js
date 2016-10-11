'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:GenerateCodesModalInstanceCtrl
 * @description
 * # GenerateCodesModalInstanceCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
  .controller('GenerateCodesModalInstanceCtrl', function ($rootScope, $log, $uibModalInstance, $timeout, $auth, $state, $interval, Codes) {
    
    var self = this, data = {};

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
    			value: 20,
    			max: 30,
    			min: 1,
    			step: 5
    		}
    	}
    };

    var timer;

    this.keyDown = function(action, value){
    	self.modal.form.codes.value = value;
      if ( self.modal.subtitle.show ) {
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
    	} else if(action === 'inc'){
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

      data = {
        action: self.modal.form.codes.value,
        token: $auth.getToken()
      };

      self.modal.buttons.send.disabled = true;

      Codes.generate(data, function(success) {
        $log.log(success);
        $rootScope.loader.show = false;
        if (success.status === 200) {
          $uibModalInstance.close();
          $state.go('home');
        } else if(success.status === 201) {
          self.modal.buttons.send.disabled = false;
          self.modal.subtitle.text = '¡Esos son muchos códigos!, pueden ser máximo ' + self.modal.form.codes.max ;
          self.modal.subtitle.show = true;
        } else if(success.status === 400) {
          self.modal.buttons.send.disabled = false;
          self.modal.subtitle.text = '¡Pst!, debes indicar un número en el cajón del medio' ;
          self.modal.subtitle.show = true;
        } else {
          self.modal.buttons.send.disabled = false;
          self.modal.subtitle.text = '¡Ups!, ocurrió un problema al generar los códigos' ;
          self.modal.subtitle.show = true;
        }
      }, function(error) {
        $log.log(error);
        $rootScope.loader.show = false;
        self.modal.subtitle.text = 'Mmm.. parece que tienes que recargar la página' ;
        self.modal.subtitle.show = true;
      });
    };

  });
