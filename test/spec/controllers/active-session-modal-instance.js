'use strict';

describe('Controller: ActiveSessionModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('karamuseApp'));

  var ActiveSessionModalInstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActiveSessionModalInstanceCtrl = $controller('ActiveSessionModalInstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ActiveSessionModalInstanceCtrl.awesomeThings.length).toBe(3);
  });
});
