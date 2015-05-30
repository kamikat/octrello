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
      if (key) {
        signals.push({ symbol: key, card: match[2] });
      }
      last_symbol = key;
    }
    return signals;
  };
})({
  'mention': [ 'see', 'refers? to' ],
  'fulfill': [ 'completes?', 'fulfills?', 'implements?', 'finish(?:es)?' ],
  '_': [ 'and', ', ?' ],
});

router.use(require('./lib/trello-agent')());
router.post('/label-card-in-board/:board', function (req, res, next) {
  var body = req.body;
  var board = req.params.board;
  var label_success = req.query.label_success || 'green';
  var trello = res.trello;
  _.each(body.commits, function (commit) {
    var actions = analyze(commit.message);
    var reverts = /^reverts?\b/i.test(commit.message);
    _.each(actions, function (act) {
      console.log(act);
      trello.get('/boards/' + board + '/cards/' + act.card).end(function (err, res) {
        var card = res.body;
        switch (act.symbol) {
          case 'mention': {
            trello.post('/cards/' + card.id + '/actions/comments')
            .send({ text: 'Mentioned at commit [' + commit.id + '](' + commit.url + ').\n>' + commit.message.split('\n').join('\n>') })
            .end(function (err, res) { console.log(err, res.body); });
          } break;
          case 'fulfill': {
            var labels = _.pluck(card.labels, 'color');
            if (!reverts) {
              trello.post('/cards/' + card.id + '/actions/comments')
              .send({ text: 'Fulfilled by commit [' + commit.id + '](' + commit.url + ').\n> ' + commit.message.split('\n').join('\n> ') })
              .end(function (err, res) { console.log(err, res.body); });
              trello.put('/cards/' + card.id + '/labels')
              .send({ value: _.uniq(labels.concat([ label_success ])).join(',') })
              .end(function (err, res) { console.log(err, res.body); });
            } else {
              trello.put('/cards/' + card.id + '/labels')
              .send({ value: _.filter(labels, function (v) { return v != label_success; }).join(',') })
              .end(function (err, res) { console.log(err, res.body); });
            }
            res
          } break;
        }
      });
    });
  });
  return next();
});

module.exports = router;

