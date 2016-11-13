'use strict';

describe('Controller: KaramuseClientResultsCtrl', function () {

  // load the controller's module
  beforeEach(module('karamuseDjApp'));

  var KaramuseClientResultsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    KaramuseClientResultsCtrl = $controller('KaramuseClientResultsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(KaramuseClientResultsCtrl.awesomeThings.length).toBe(3);
  });
});
