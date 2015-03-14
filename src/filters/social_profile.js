var url = require('url');
var _ = require('lodash');

exports.visit = function (results, obj) {
  if (!_.isUndefined(obj['x-socialprofile'])) {
    results['social-profiles'] = obj['x-socialprofile'].map(function (e) {
      var hostname = url.parse(e).hostname;
      var parts = hostname.split('.');

      if (parts.length === 2) service = parts[0];
      if (parts.length === 3) service = parts[1];
      return {service: service, address: e};
    });
  }
};
