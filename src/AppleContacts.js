var url = require('url');
var Promise = require('bluebird');
var request = require('request');
var type = require('type-of');
var _ = require('lodash');
var parser = require('./parser');


function AppleContact(props) {
  if (!_.isPlainObject(props)) {
    throw new Error('Invalid props argument; expected object, received ' + type(props));
  }

  if (!_.isString(props.appleId)) {
    throw new Error('Invalid appleId property; expected string, received ' + type(props.appleId));
  }

  if (!_.isString(props.password)) {
    throw new Error('Invalid password property; expected string, received ' + type(props.password));
  }

  this._appleId = props.appleId;
  this._password = props.password;
  this._origin = 'https://www.icloud.com';
}


AppleContact.prototype.login = function (callback) {
  var _this = this;
  var resolver;

  resolver = function (resolve, reject) {
    var params;

    params = {
      method: 'POST',
      uri: 'https://setup.icloud.com/setup/ws/1/login',
      headers: {'Origin': _this._origin},
      body: {
        apple_id: _this._appleId,
        password: _this._password,
        extended_login: false
      },
      json: true
    };

    request(params, function (err, response, data) {
      var statusCode;
      var uri;

      if (err) return reject(err);

      statusCode = response.statusCode;
      if (statusCode >= 400 || data.error_description) {
        return reject(new Error(data.error_description));
      }

      if (_.has(response.headers, 'set-cookie'))
        // Get response cookies for future use.
        _this._cookies = response.headers['set-cookie'];

      // alternative to pass it from outside..
      if (!_.isUndefined(data.webservices.contacts.url)) {
        uri = url.parse(data.webservices.contacts.url);
        _this._contactsUri = url.format({
          protocol: uri.protocol,
          hostname: uri.hostname.replace('ws', '')
        });
      } else {
        _this._contactsUri = 'https://contacts.icloud.com';
      }

      resolve(data);
    });
  };
  return new Promise(resolver).nodeify(callback);
};


AppleContact.prototype.getUserPrincipal = function (callback) {
  var _this = this;
  var resolver;

  resolver = function (resolve, reject) {
    var params;

    params = {
      method: 'PROPFIND',
      uri: _this._contactsUri,
      headers: {
        'Origin': _this._origin,
        'Depth': 1,
        'Content-Type': 'text/xml; charset=utf-8'
      },
      auth: {
        'user': _this._appleId,
        'pass': _this._password
      },
      body: '<d:propfind xmlns:d="DAV:"><d:prop><d:current-user-principal /></d:prop></d:propfind>'
    };

    request(params, function (err, response, data) {
      var statusCode;

      if (err) return reject(err);

      statusCode = response.statusCode;
      if (statusCode >= 400 || data.error_description) {
        return reject(new Error(data.error_description));
      }

      resolve(parser.parsePrincipal(data));
    });
  };
  return new Promise(resolver).nodeify(callback);
};


// TODO: use this method as hook in order to combine next two methods as childs of this one.
AppleContact.prototype.getContactEndpoints = function (principal, callback) {
  var _this = this;
  var resolver;
  var uri;

  if (!_.isString(principal)) {
    throw new Error('Invalid principal argument; expected string, received ' + type(principal));
  }

  uri = url.resolve(_this._contactsUri, principal + '/carddavhome/card/');
  resolver = function (resolve, reject) {
    var params;

    params = {
      method: 'PROPFIND',
      uri: uri,
      headers: {
        'Origin': _this._origin,
        'Depth': 1,
        'Content-Type': 'text/xml; charset=utf-8'
      },
      auth: {
        'user': _this._appleId,
        'pass': _this._password
      },
      body: '<d:propfind xmlns:d="DAV:"><d:prop><d:resourcetype/></d:prop></d:propfind>'
    };

    request(params, function (err, response, data) {
      var statusCode;

      if (err) return reject(err);

      statusCode = response.statusCode;
      if (statusCode >= 400 || data.error_description) {
        return reject(new Error(data.error_description));
      }

      resolve(parser.parseSingleContactEndpoints(data));
    });
  };

  return new Promise(resolver).nodeify(callback);
};


AppleContact.prototype.getSingleCard = function (vcfEndpoint, callback) {
  var _this = this;
  var resolver;
  var uri;

  if (!_.isString(vcfEndpoint)) {
    throw new Error('Invalid vcfEndpoint argument; expected string, received ' + type(vcfEndpoint));
  }

  uri = url.resolve(_this._contactsUri, vcfEndpoint);
  resolver = function (resolve, reject) {
    var params;

    params = {
      method: 'GET',
      uri: uri,
      headers: {
        'Origin': _this._origin,
        'Depth': 1,
        'Content-Type': 'text/xml; charset=utf-8'
      },
      auth: {
        'user': _this._appleId,
        'pass': _this._password
      }
    };

    request(params, function (err, response, data) {
      var statusCode;

      if (err) return reject(err);

      statusCode = response.statusCode;
      if (statusCode >= 400 || data.error_description) {
        return reject(new Error(data.error_description));
      }

      resolve(parser.parseVcfCard(data));
    });
  };

  return new Promise(resolver).nodeify(callback);
};


AppleContact.prototype.fetchAllVCards = function(principal, callback) {
  var _this = this;
  var resolver;
  var uri;

  if (!_.isString(principal)) {
    throw new Error('Invalid principal argument; expected string, received ' + type(principal));
  }

  uri = url.resolve(_this._contactsUri, principal + '/carddavhome/card/');
  resolver = function (resolve, reject) {
    var params;

    params = {
      method: 'REPORT',
      uri: uri,
      headers: {
        'Origin': _this._origin,
        'Depth': 1,
        'Content-Type': 'text/xml; charset=utf-8'
      },
      auth: {
        'user': _this._appleId,
        'pass': _this._password
      },
      body: '<c:addressbook-multiget xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:carddav"><d:prop><c:address-data /></d:prop></c:addressbook-multiget>'
    };

    request(params, function (err, response, data) {
      var statusCode;

      if (err) return reject(err);

      statusCode = response.statusCode;
      if (statusCode >= 400 || data.error_description) {
        return reject(new Error(data.error_description));
      }

      // now empty cause not data.
      resolve(data);
    });
  };

  return new Promise(resolver).nodeify(callback);
};

module.exports = AppleContact;
