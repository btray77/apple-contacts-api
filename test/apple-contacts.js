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

  describe('#getContacts', function () {

    it('throws error when principal argument is invalid', function () {
      assert.throws(function () { appleContact.getContacts(); }, /invalid principal argument/i);
      assert.throws(function () { appleContact.getContacts(123); }, /invalid principal argument/i);
      assert.throws(function () { appleContact.getContacts(true); }, /invalid principal argument/i);
      assert.throws(function () { appleContact.getContacts(null); }, /invalid principal argument/i);
      assert.throws(function () { appleContact.getContacts(new Date()); }, /invalid principal argument/i);
    });
  });

  it('successfully fetches user contacts', function (done) {
    // first login, to obtain the required headers.
    appleContact.login()
      .then(function (response) {
        assert.property(response, 'webservices');
        assert.deepProperty(response, 'webservices.contacts');
        assert.deepProperty(response, 'webservices.contacts.url');
      })
      // fetch user's principal
      .then(function () {
        return appleContact.getUserPrincipal();
      })
      .then(function (response) {
        assert.isString(response);
        return response.split('/')[1];
      })
      .then(function (principal) {
        return appleContact.getContacts(principal);
      })
      .then(function (response) {
        console.log(response);
      })
      .then(done, done);
  });

});
