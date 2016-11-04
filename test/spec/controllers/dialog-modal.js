'use strict';

describe('Controller: DialogModalCtrl', function () {

  // load the controller's module
  beforeEach(module('karamuseDjApp'));

  var DialogModalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DialogModalCtrl = $controller('DialogModalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DialogModalCtrl.awesomeThings.length).toBe(3);
  });
});
