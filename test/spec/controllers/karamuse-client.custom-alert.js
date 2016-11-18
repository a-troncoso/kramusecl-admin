'use strict';

describe('Controller: KaramuseClientCustomAlertCtrl', function () {

  // load the controller's module
  beforeEach(module('karamuseDjApp'));

  var KaramuseClientCustomAlertCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    KaramuseClientCustomAlertCtrl = $controller('KaramuseClientCustomAlertCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(KaramuseClientCustomAlertCtrl.awesomeThings.length).toBe(3);
  });
});
