'use strict';

/**
 * @ngdoc function
 * @name karamuseApp.controller:DialogModalModalInstanceCtrl
 * @description
 * # DialogModalModalInstanceCtrl
 * Controller of the karamuseApp
 */
angular.module('karamuseApp')
  .controller('DialogModalInstanceCtrl', function($log, $uibModalInstance, data) {

    var self = this;

    this.submit = function() {
      self.modal.loader.show = true;

      var result = data.submit.function();
      result.then(function() {
        self.modal.loader.show = false;
      }, function(error) {
        $log.log(error);
      });
    };

    this.modal = {
      loader: {
        show: false
      },
      title: {
        text: data.title || null,
        show: true
      },
      subtitle: {
        text: data.subtitle || null,
        show: true
      },
      paragraph1: {
        text: null,
        show: false
      },
      paragraph2: {
        text: null,
        show: false
      },
      paragraph3: {
        text: null,
        show: false
      },
      buttons: {
        submit: {
          function: self.submit || null,
          text: data.submit.text || null,
          show: data.submit.show
        },
        cancel: {
          function: data.cancel.function || function() {
            return self.cancel();
          },
          text: data.cancel.text || null,
          show: data.cancel.show || false
        }
      }
    };


    this.cancel = function() {
      $uibModalInstance.dismiss();
    };

  });