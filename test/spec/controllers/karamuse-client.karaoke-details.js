'use strict';

describe('Controller: KaramuseClientKaraokeDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('karamuseDjApp'));

  var KaramuseClientKaraokeDetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    KaramuseClientKaraokeDetailsCtrl = $controller('KaramuseClientKaraokeDetailsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(KaramuseClientKaraokeDetailsCtrl.awesomeThings.length).toBe(3);
  });
});
