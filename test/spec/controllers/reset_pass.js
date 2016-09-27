'use strict';

describe('Controller: ResetPassCtrl', function () {

  // load the controller's module
  beforeEach(module('karamuseclAdminApp'));

  var ResetPassCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ResetPassCtrl = $controller('ResetPassCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ResetPassCtrl.awesomeThings.length).toBe(3);
  });
});
