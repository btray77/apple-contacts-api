var _ = require('lodash');


exports.visit = function (results, obj) {
  if (!_.isUndefined(obj.org)) {
    results.organization = {};

    if (!_.isUndefined(obj.org.name)) results.organization.name = obj.org.name;
    if (!_.isUndefined(obj.org.dept) && !_.isEmpty('')) results.organization.department = obj.org.dept;
  }
};
