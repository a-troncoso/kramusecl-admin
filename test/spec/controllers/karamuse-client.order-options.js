'use strict';

describe('Controller: KaramuseClientOrderOptionsCtrl', function () {

  // load the controller's module
  beforeEach(module('karamuseDjApp'));

  var KaramuseClientOrderOptionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    KaramuseClientOrderOptionsCtrl = $controller('KaramuseClientOrderOptionsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(KaramuseClientOrderOptionsCtrl.awesomeThings.length).toBe(3);
  });
});
