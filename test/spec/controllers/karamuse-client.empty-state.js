'use strict';

describe('Controller: KaramuseClientEmptyStateCtrl', function () {

  // load the controller's module
  beforeEach(module('karamuseDjApp'));

  var KaramuseClientEmptyStateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    KaramuseClientEmptyStateCtrl = $controller('KaramuseClientEmptyStateCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(KaramuseClientEmptyStateCtrl.awesomeThings.length).toBe(3);
  });
});
