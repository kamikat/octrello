var _ = require('lodash');

var analyze = (function (symbols) {
  var pattern_message = new RegExp('\\b(' + _(symbols).values().flatten().value().join('|') + ') #card-([0-9]+)\\b', 'gi');
  var pattern_symbols = _.transform(symbols, function (object, v, k) {
    object[k] = new RegExp('^(' + v.join('|') + ')$', 'i');
  });
  var pattern_reverts = /^reverts?\b/i;
  return function (commit) {
    var message = commit.message;
    var results = [];
    var match, last_symbol;
    while (match = pattern_message.exec(message)) {
      var symbol = _.findKey(pattern_symbols, function (exp) { return exp.test(match[1]); });
      if (symbol == '_') {
        symbol = last_symbol;
      }
      if (symbol) {
        results.push({
          symbol: symbol,
          cardId: match[2],
          revert: pattern_reverts.test(message),
          commit: commit });
      }
      last_symbol = symbol;
    }
    return results;
  };
})({
  'mention': [ 'see', 'refers? to' ],
  'fulfill': [ 'completes?', 'fulfills?', 'implements?', 'finish(?:es)?', 'fix(?:es)?' ],
  '_': [ 'and', ', ?' ],
});

module.exports = {
  parse: analyze,
};

