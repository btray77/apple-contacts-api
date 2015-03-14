var _ = require('lodash');

exports.visit = function (results, obj) {
  if (!_.isUndefined(obj.adr)) {
    results.address = obj.adr.map(function (e) {
      var addr = {};
      var address = {};

      if (!_.isUndefined(e.value.street)) address.street = e.value.street;
      if (!_.isUndefined(e.value.city)) address.city = e.value.city;
      if (!_.isUndefined(e.value.region)) address.region = e.value.region;
      if (!_.isUndefined(e.value.zip)) address.zip = e.value.zip;
      if (!_.isUndefined(e.value.country)) address.country = e.value.country;

      if (!_.isEmpty(address)) addr.address = address;

      if (!_.isUndefined(e.type[0])) addr.type = e.type[0];
      if (e.type.indexOf('pref') !== -1) addr.primary = true;

      return addr;
    });
  }
};
