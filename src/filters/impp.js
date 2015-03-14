var _ = require('lodash');


var serviceNames = {
  'skype': 'Skype',
  'xmpp': 'Google Talk',
  'msnim': 'MSN Messenger',
  'aim': 'AIM',
  'ymsgr': 'Yahoo! Messenger'
};


exports.visit = function (results, obj) {
  if (!_.isUndefined(obj.impp)) {
    results.impp = obj.impp.map(function (e) {
      var eImpp = {
        address: e.value,
        service: serviceNames[e.value.split(':')[0]]
      };

      if (!_.isUndefined(e.type[0])) eImpp.type = e.type[0];
      if (!_.isUndefined(e.type[1]) && e.type[1] === 'pref') {
        eImpp.primary = true;
      }
      return eImpp;
    });
  }
};
