// load environmental variables
require('dotenv').load();

var assert = require('chai').assert;
var Promise = require('bluebird');
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

  describe('#getContactEndpoints', function () {

    it('throws error when principal argument is invalid', function () {
      assert.throws(function () { appleContact.getContactEndpoints(); }, /invalid principal argument/i);
      assert.throws(function () { appleContact.getContactEndpoints(123); }, /invalid principal argument/i);
      assert.throws(function () { appleContact.getContactEndpoints(true); }, /invalid principal argument/i);
      assert.throws(function () { appleContact.getContactEndpoints(null); }, /invalid principal argument/i);
      assert.throws(function () { appleContact.getContactEndpoints(new Date()); }, /invalid principal argument/i);
    });
  });

  describe('#getSingleCard', function () {

    it('throws error when vcfEndpoint argument is invalid', function () {
      assert.throws(function () { appleContact.getSingleCard(); }, /invalid vcfEndpoint argument/i);
      assert.throws(function () { appleContact.getSingleCard(123); }, /invalid vcfEndpoint argument/i);
      assert.throws(function () { appleContact.getSingleCard(true); }, /invalid vcfEndpoint argument/i);
      assert.throws(function () { appleContact.getSingleCard(null); }, /invalid vcfEndpoint argument/i);
      assert.throws(function () { appleContact.getSingleCard(new Date()); }, /invalid vcfEndpoint argument/i);
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
        return appleContact.getContactEndpoints(principal);
      })
      .then(function (vcfCards) {
        assert.isArray(vcfCards);
        Promise.map(vcfCards, function (card) {
          return appleContact.getSingleCard(card);
        })
        .then(function (contacts) {
          console.log('Conacts: ' + contacts);
        });
      })
      .then(done, done);
  });

});
