var Promise = require('bluebird');
var request = require('request');
var type = require('type-of');
var _ = require('lodash');


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
      var statusCode = response.statusCode;

      if (err) return reject(err);

      statusCode = response.statusCode;
      if (statusCode >= 400 || data.error_description) {
        return reject(new Error(data.error_description));
      }

      if (_.has(response.headers, 'set-cookie'))
        // Get response cookies for future use.
        _this._cookies = response.headers['set-cookie'];

      resolve(data);
    });
  };
  return new Promise(resolver).nodeify(callback);
};


module.exports = AppleContact;