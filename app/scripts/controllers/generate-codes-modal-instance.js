'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:GenerateCodesModalInstanceCtrl
 * @description
 * # GenerateCodesModalInstanceCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
  .controller('GenerateCodesModalInstanceCtrl', function ($log, $interval) {
    
    var self = this;

    this.modal = {
    	buttons: {

    	},
    	form: {
    		codes: {
    			value: 30,
    			max: 200,
    			min: 1,
    			step: 5
    		}
    	}
    };

    var timer;

    this.keyDown = function(action, value){
    	self.modal.form.codes.value = value;

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
    	$log.log('voy a generar codigos');
    };

  });
