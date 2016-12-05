'use strict';

describe('Controller: KaramuseClientOrderResultsCtrl', function () {

  // load the controller's module
  beforeEach(module('karamuseDjApp'));

  var KaramuseClientOrderResultsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    KaramuseClientOrderResultsCtrl = $controller('KaramuseClientOrderResultsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(KaramuseClientOrderResultsCtrl.awesomeThings.length).toBe(3);
  });
});
