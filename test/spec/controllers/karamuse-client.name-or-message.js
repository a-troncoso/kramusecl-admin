'use strict';

describe('Controller: KaramuseClientNameOrMessageCtrl', function () {

  // load the controller's module
  beforeEach(module('karamuseDjApp'));

  var KaramuseClientNameOrMessageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    KaramuseClientNameOrMessageCtrl = $controller('KaramuseClientNameOrMessageCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(KaramuseClientNameOrMessageCtrl.awesomeThings.length).toBe(3);
  });
});
