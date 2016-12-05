'use strict';

describe('Controller: ClientHomeCtrl', function () {

  // load the controller's module
  beforeEach(module('karamuseDjApp'));

  var ClientHomeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClientHomeCtrl = $controller('ClientHomeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ClientHomeCtrl.awesomeThings.length).toBe(3);
  });
});
