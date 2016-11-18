'use strict';

describe('Filter: cutWord', function () {

  // load the filter's module
  beforeEach(module('karamuseDjApp'));

  // initialize a new instance of the filter before each test
  var cutWord;
  beforeEach(inject(function ($filter) {
    cutWord = $filter('cutWord');
  }));

  it('should return the input prefixed with "cutWord filter:"', function () {
    var text = 'angularjs';
    expect(cutWord(text)).toBe('cutWord filter: ' + text);
  });

});
