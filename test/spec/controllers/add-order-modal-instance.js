'use strict';

describe('Controller: AddOrderModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('karamuseDjApp'));

  var AddOrderModalInstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddOrderModalInstanceCtrl = $controller('AddOrderModalInstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AddOrderModalInstanceCtrl.awesomeThings.length).toBe(3);
  });
});
