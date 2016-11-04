'use strict';

describe('Controller: KaramuseClientSearchKaraokeCtrl', function () {

  // load the controller's module
  beforeEach(module('karamuseDjApp'));

  var KaramuseClientSearchKaraokeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    KaramuseClientSearchKaraokeCtrl = $controller('KaramuseClientSearchKaraokeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(KaramuseClientSearchKaraokeCtrl.awesomeThings.length).toBe(3);
  });
});
