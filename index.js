var _ = require('lodash');
var async = require('async');
var express = require('express');
var router = express.Router();

var parser = require('./lib/message-parser');

router.use(require('./lib/trello-agent')());
router.post('/label-card-in-board/:board', function (req, res, next) {
  var trello = res.trello;
  async.each(
    _(req.body.commits).map(parser.parse).flatten().value(),
    function (action, callback) {

      var commit = action.commit, revert = action.revert;
      var commit_text = '[' + commit.id + '](' + commit.url + ').\n> ' + commit.message.split('\n').join('\n> ');

      return trello.get('/boards/' + req.params.board + '/cards/' + action.cardId).end(function (err, res) {
        if (err) return callback(err);

        var card = res.body;
        var labels = _.pluck(card.labels, 'color');

        switch (action.symbol) {
          case 'mention': {
            if (!revert) {
              trello.post('/cards/' + card.id + '/actions/comments').send({ text: 'Mentioned by ' + commit_text }).end(callback);
            }
          } break;
          case 'fulfill': {
            if (!revert) {
              async.parallel({
                comment: function (callback) {
                  trello.post('/cards/' + card.id + '/actions/comments').send({ text: 'Fulfilled by ' + commit_text }).end(callback);
                },
                label: function (callback) {
                  trello.put('/cards/' + card.id + '/labels').send({ value: _.union(labels, [ 'green' ]).join(',') }).end(callback);
                }
              }, callback);
            } else {
              async.parallel({
                comment: function (callback) {
                  trello.post('/cards/' + card.id + '/actions/comments').send({ text: 'Reverted ' + commit_text }).end(callback);
                },
                label: function (callback) {
                  trello.put('/cards/' + card.id + '/labels').send({ value: _.difference(labels, [ 'green' ]).join(',') }).end(callback);
                }
              }, callback);
            }
          } break;
          default: {
            callback();
          } break;
        }

      });
    }, next);
});

module.exports = router;

