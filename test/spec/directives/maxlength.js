'use strict';

describe('Directive: maxLength', function () {

  // load the directive's module
  beforeEach(module('karamuseclAdminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<max-length></max-length>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the maxLength directive');
  }));
});
