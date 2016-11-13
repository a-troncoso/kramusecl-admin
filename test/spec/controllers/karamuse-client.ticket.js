'use strict';

describe('Controller: KaramuseClientTicketCtrl', function () {

  // load the controller's module
  beforeEach(module('karamuseDjApp'));

  var KaramuseClientTicketCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    KaramuseClientTicketCtrl = $controller('KaramuseClientTicketCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(KaramuseClientTicketCtrl.awesomeThings.length).toBe(3);
  });
});
