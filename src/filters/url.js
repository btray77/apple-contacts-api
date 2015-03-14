var _ = require('lodash');

exports.visit = function (results, obj) {
  if (!_.isUndefined(obj.url)) {
    results.url = obj.url.map(function (e) {
      var eUrl = {
        address: e.value
      };

      if (!_.isUndefined(e.type[0])) {
        if (e.type[0] === 'pref') {
          eUrl.primary = true;
        } else {
          eUrl.type = e.type[0];
        }
      }
      return eUrl;
    });
  }
};
