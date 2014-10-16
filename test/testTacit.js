'use strict';

var chai = require('chai');
var expect = chai.expect;
var tacitFactory = require('../lib/index');

function addSpace(str) {
  return ' ' + str + ' ';
}
function concat(strA, strB) {
  return strA + strB;
}
function createSeed() {
  return {
    addSpace: addSpace,
    concat: concat
  };
}

describe('tacit', function () {
  it('should not effect the seed object', function () {
    var seed = createSeed();
    tacitFactory(seed)();

    expect(seed).to.have.keys('addSpace', 'concat');
    expect(seed.addSpace).to.equal(addSpace);
    expect(seed.concat).to.equal(concat);
  });

  it('should create a tacit object with the correct keys', function () {
    var seed = createSeed();
    var tacit = tacitFactory(seed)();

    expect(tacit).to.contain.keys('addSpace', 'concat');
  });

  it('should act as the identity function by default', function () {
    var seed = createSeed();
    var tacit = tacitFactory(seed)();
    var value = tacit('hi');
    expect(value).to.equal('hi');
  });

  it('should compose function calls as expected', function () {
    var seed = createSeed();
    var tacit = tacitFactory(seed)();
    tacit.addSpace().concat('hello');

    var value = tacit('world');
    expect(value).to.equal('hello world ');
  });

  it('should insert arguments where expected', function () {
    var seed = createSeed();
    var tacit = tacitFactory(seed)();
    tacit.addSpace().concat(tacitFactory.$, 'world');

    var value = tacit('hello');
    expect(value).to.equal(' hello world');
  });

  it('should insert arguments specified by the default position', function () {
    var seed = createSeed();
    var tacit = tacitFactory(seed, 0)();
    tacit.addSpace().concat('world');

    var value = tacit('hello');
    expect(value).to.equal(' hello world');
  });

  it('should allow multiple instances to run', function () {
    var seed = createSeed();
    var tacit = tacitFactory(seed);
    var tacit1 = tacit();
    var tacit2 = tacit();

    tacit1.addSpace().concat('hello');
    tacit2.addSpace().concat(tacitFactory.$, 'world');

    var value1 = tacit1('world');
    var value2 = tacit2('hello');

    expect(value1).to.equal('hello world ');
    expect(value2).to.equal(' hello world');
  });
});
