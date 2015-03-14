var _ = require('lodash');

exports.visit = function (results, obj) {
  if (!_.isUndefined(obj.email)) {
    results.email = obj.email.map(function (e) {
      var eEmail = {
        address: e.value
      };
      if (!_.isUndefined(e.type[1])) eEmail.type = e.type[1];

      if (e.type.indexOf('pref') > 1) eEmail.primary = true;
      return eEmail;
    });
  }
};
