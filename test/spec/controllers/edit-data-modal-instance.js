'use strict';

describe('Controller: EditDataModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('karamuseApp'));

  var EditDataModalInstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditDataModalInstanceCtrl = $controller('EditDataModalInstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EditDataModalInstanceCtrl.awesomeThings.length).toBe(3);
  });
});
