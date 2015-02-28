var xml2js = require('xml2js');

var parser = new xml2js.Parser({explicitArray: false});


module.exports = function (xml) {
  var target;

  parser.parseString(xml, function (err, data) {
    // dirty for now.
    target = data.multistatus.response.propstat.prop['current-user-principal'].href;

  });

  return target;
};
