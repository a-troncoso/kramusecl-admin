'use strict';

describe('Directive: showHeaderOnTop', function () {

  // load the directive's module
  beforeEach(module('karamuseApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<show-header-on-top></show-header-on-top>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the showHeaderOnTop directive');
  }));
});
