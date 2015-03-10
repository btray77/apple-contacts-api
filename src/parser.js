var url = require('url');
var xml2js = require('xml2js');
var _ = require('lodash');
var filters = require('./filters');
var vcardparser = require('vcardparser');

var parser = new xml2js.Parser({explicitArray: false});


module.exports.parsePrincipal = function (xml) {
  var target;

  parser.parseString(xml, function (err, data) {
    // dirty for now.
    target = data.multistatus.response.propstat.prop['current-user-principal'].href;

  });

  return target;
};

/**
 * Parses all seperate .vcf uls for each non-addresbook object in this calendar.
 */
module.exports.parseSingleContactEndpoints = function (xml) {
  var cards = [];
  parser.parseString(xml, function (err, data) {
    if (err) return err;
    data.multistatus.response.forEach(function (entry) {
      if (_.isEmpty(entry.propstat.prop.resourcetype)) {
        cards.push(entry.href);
      }
    });
  });

  return cards;
};


module.exports.parseVcfCard = function (vcard, headers, uri) {
  var card;
  var results = {};
  vcardparser.parseString(vcard, function (err, data) {
    if (err) return err;

    _.forOwn(filters, function (filter) {
      filter.visit(results, data);
    });
    card = results;
  });
  card.etag = headers.etag;
  card.href = url.parse(uri).pathname;
  return card;
};
