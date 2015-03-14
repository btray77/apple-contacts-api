var _ = require('lodash');

exports.visit = function (results, obj) {
  if (!_.isUndefined(obj.nickname)) {
    results.nickame = obj.nickname;
  }
};
