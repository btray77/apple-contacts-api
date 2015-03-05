var _ = require('lodash');

exports.visit = function (results, obj) {
  if (!_.isUndefined(obj.tel)) {
    results.phone = obj.tel.map(function (t) {
      return {number: t.value, type: t.type[0]};
    });
  }
};
