'use strict';

describe('Controller: OrdersLimitModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('karamuseDjApp'));

  var OrdersLimitModalInstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrdersLimitModalInstanceCtrl = $controller('OrdersLimitModalInstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OrdersLimitModalInstanceCtrl.awesomeThings.length).toBe(3);
  });
});
