var _ = require('lodash');
var express = require('express');
var router = express.Router();

var analyze = (function (symbols) {
  var a = _.map(symbols, function (value) { return value.join('|') }).join('|');
  var h = new RegExp('\\b(' + a + ') #card-([0-9]+)\\b', 'gi');
  var c = _.transform(symbols, function (object, v, k) {
    object[k] = new RegExp('^(' + v.join('|') + ')$', 'i');
  });
  return function (message) {
    var match;
    var last_symbol;
    var signals = [];
    while (match = h.exec(message)) {
      var key = _.findKey(c, function (exp) { return exp.test(match[1]); });
      if (key == '_') {
        key = last_symbol;
      }
      signals.push({ symbol: key, card: match[2] });
      last_symbol = key;
    }
    return signals;
  };
})({
  'mention': [ 'see' ],
  'fulfill': [ 'completes?', 'fulfills?'],
  '_': [ 'and', ', ?' ],
});

router.use(require('./lib/trello-agent')());
router.post('/label-card-in-board/:board', function (req, res, next) {
  var body = req.body;
  var board = req.params.board;
  _.each(body.commits, function (commit) {
    var actions = analyze(commit.message);
    var reverts = /^reverts?\b/i.test(commit.message);
    _.each(actions, function (act) {
      console.log(act);
    });
  });
  return next();
});

module.exports = router;

