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

  describe('#fetchAllVCards', function () {

    it('throws error when principal argument is invalid', function () {
      assert.throws(function () { appleContact.fetchAllVCards(); }, /invalid principal argument/i);
      assert.throws(function () { appleContact.fetchAllVCards(123); }, /invalid principal argument/i);
      assert.throws(function () { appleContact.fetchAllVCards(true); }, /invalid principal argument/i);
      assert.throws(function () { appleContact.fetchAllVCards(null); }, /invalid principal argument/i);
      assert.throws(function () { appleContact.fetchAllVCards(new Date()); }, /invalid principal argument/i);
    });
  });

  describe('#deleteContact', function () {

    it('throws error when href argument is invalid', function () {
      assert.throws(function () { appleContact.deleteContact(); }, /invalid href argument/i);
      assert.throws(function () { appleContact.deleteContact(123); }, /invalid href argument/i);
      assert.throws(function () { appleContact.deleteContact(true); }, /invalid href argument/i);
      assert.throws(function () { appleContact.deleteContact(null); }, /invalid href argument/i);
      assert.throws(function () { appleContact.deleteContact(new Date()); }, /invalid href argument/i);
    });

    it('throws error when etag is invalid', function () {
      assert.throws(function () { appleContact.deleteContact('contactId', 123); }, /invalid etag argument/i);
      assert.throws(function () { appleContact.deleteContact('contactId', true); }, /invalid etag argument/i);
      assert.throws(function () { appleContact.deleteContact('contactId', null); }, /invalid etag argument/i);
      assert.throws(function () { appleContact.deleteContact('contactId', new Date()); }, /invalid etag argument/i);
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
        Promise.join(appleContact.getContactEndpoints(principal), appleContact.fetchAllVCards(principal), function (vcfCards, cards) {
          assert.isArray(vcfCards);
          Promise.map(vcfCards, function (card) {
            return appleContact.getSingleCard(card);
          })
          .then(function (contacts) {
            console.log('Contacts: ' + contacts);
          });
        });
      })
      .then(done, done);
  });
});
            // It works but leave it out, not to delete all remaining contacts
//          return [contacts[0].href, contacts[0].etag];
//        })
//        .spread(function(href, etag) {
//          return appleContact.deleteContact(href, etag)
//            .then(function (response) {
//              assert.isUndefined(response);
//            })
//            .return();
//        });
