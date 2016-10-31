'use strict';

describe('Controller: ForgotPassCtrl', function () {

  // load the controller's module
  beforeEach(module('karamuseApp'));

  var ForgotPassCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ForgotPassCtrl = $controller('ForgotPassCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ForgotPassCtrl.awesomeThings.length).toBe(3);
  });
});
