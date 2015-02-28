// load environmental variables
require('dotenv').load();

var assert = require('chai').assert;
var AppleContacts = require('../');


describe('AppleContacts API', function () {

  var appleContact = new AppleContacts({
    appleId: process.env.APPLE_ID,
    password: process.env.PASSWORD
  });

  describe('constructor', function () {

    it('throws error when props is invalid', function () {
      assert.throws(function () { new AppleContacts(); }, /invalid props argument/i);
      assert.throws(function () { new AppleContacts('string'); }, /invalid props argument/i);
      assert.throws(function () { new AppleContacts(123); }, /invalid props argument/i);
      assert.throws(function () { new AppleContacts(true); }, /invalid props argument/i);
      assert.throws(function () { new AppleContacts(null); }, /invalid props argument/i);
      assert.throws(function () { new AppleContacts(new Date()); }, /invalid props argument/i);
    });

    it('throws error when appleId property is invalid', function () {
      assert.throws(function () { new AppleContacts({}); }, /invalid appleId property/i);
      assert.throws(function () { new AppleContacts({appleId: 123}); }, /invalid appleId property/i);
      assert.throws(function () { new AppleContacts({appleId: true}); }, /invalid appleId property/i);
      assert.throws(function () { new AppleContacts({appleId: null}); }, /invalid appleId property/i);
      assert.throws(function () { new AppleContacts({appleId: new Date()}); }, /invalid appleId property/i);
    });

    it('throws error when password property is invalid', function () {
      assert.throws(function () { new AppleContacts({appleId: 'valid'}); }, /invalid password property/i);
      assert.throws(function () { new AppleContacts({appleId: 'valid', password: 123}); }, /invalid password property/i);
      assert.throws(function () { new AppleContacts({appleId: 'valid', password: true}); }, /invalid password property/i);
      assert.throws(function () { new AppleContacts({appleId: 'valid', password: null}); }, /invalid password property/i);
      assert.throws(function () { new AppleContacts({appleId: 'valid', password: new Date()}); }, /invalid password property/i);
    });

  });

});
