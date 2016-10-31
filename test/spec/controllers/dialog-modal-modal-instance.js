'use strict';

describe('Controller: DialogModalModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('karamuseApp'));

  var DialogModalModalInstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DialogModalModalInstanceCtrl = $controller('DialogModalModalInstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DialogModalModalInstanceCtrl.awesomeThings.length).toBe(3);
  });
});
