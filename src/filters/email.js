var _ = require('lodash');

exports.visit = function (results, obj) {
  if (!_.isUndefined(obj.email)) {
    results.email = obj.email.map(function (e) {
      return {address: e.value, type: e.type[1]};
    });
  }
};
