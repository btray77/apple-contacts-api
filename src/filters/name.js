var _ = require('lodash');

exports.visit = function (results, obj) {
  if (!_.isUndefined(obj.n)) {
    results.name = {};
    if (!_.isUndefined(obj.n.last)) results.name.familyName = obj.n.last;
    if (!_.isUndefined(obj.n.first)) results.name.givenName = obj.n.first;
    if (!_.isUndefined(obj.n.middle)) results.name.middleName = obj.n.middle;
    if (!_.isUndefined(obj.n.prefix)) results.name.prefix = obj.n.prefix;
    if (!_.isUndefined(obj.n.suffix)) results.name.suffix = obj.n.suffix;
  }

  if (_.isUndefined(results.name)) {
    results.name = {};
  }

  if (!_.isUndefined(obj.fn)) {
    results.name.fullName = obj.fn;
  }
};
