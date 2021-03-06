import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { chai } from 'meteor/practicalmeteor:chai';
import { expect } from 'meteor/practicalmeteor:chai';

describe('clinical:hl7-resource-consent', function () {
  beforeEach(function () {
    //console.log('beforeEach');
  });
  afterEach(function () {
    //console.log('afterEach');
  });
  it('exists globally', function () {
    expect(Consents).to.exist;
  });
  it('can generate a default scope request', function () {
    expect(Consents).to.exist;
  });
  it('can encode a url', function () {
    expect(Consents).to.exist;
  });

});