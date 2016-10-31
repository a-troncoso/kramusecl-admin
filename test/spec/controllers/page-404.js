'use strict';

describe('Controller: Page404Ctrl', function () {

  // load the controller's module
  beforeEach(module('karamuseApp'));

  var Page404Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Page404Ctrl = $controller('Page404Ctrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(Page404Ctrl.awesomeThings.length).toBe(3);
  });
});
