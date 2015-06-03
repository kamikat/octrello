var _ = require('lodash');
var async = require('async');
var express = require('express');
var router = express.Router();

var parser = require('./lib/message-parser');
var trello = require('./lib/trello-agent');

router.use(trello);

router.all('/label-card-in-board/:board', function (req, res, next) {
  req.actions =  _(req.body.commits).filter(function (commit) {
    return commit.distinct;
  }).map(parser.parse).flatten().value();
  return next();
}, function (req, res, next) {
  async.each(req.actions, function (action, callback) {

    var commit = action.commit, revert = action.revert;
    var commit_text = '[' + commit.id + '](' + commit.url + ').\n> ' + commit.message.split('\n').join('\n> ');

    return req.getCard(req.params.board, action.cardId, function (err, card) {
      if (err) return callback(err);

      switch (action.symbol) {
        case 'mention': {
          if (!revert) {
            res.addCommentToCard(card, 'Mentioned by ' + commit_text, callback);
          }
        } break;
        case 'fulfill': {
          if (!revert) {
            async.parallel({
              comment: function (callback) {
                res.addCommentToCard(card, 'Fulfilled by ' + commit_text, callback);
              },
              label: function (callback) {
                res.addLabelsOnCard(card, [ 'green' ], callback);
              }
            }, callback);
          } else {
            async.parallel({
              comment: function (callback) {
                res.addCommentToCard(card, 'Reverted ' + commit_text, callback);
              },
              label: function (callback) {
                res.delLabelsOnCard(card, [ 'green' ], callback);
              }
            }, callback);
          }
        } break;
        default: {
          callback();
        } break;
      }
    });

  }, function (err) {
    if (err) {
      return res.status(502).send({
        status: err.status,
        message: err.message,
        body: err.response && err.response.body
      });
    } else {
      return res.sendStatus(204);
    }
  });
});

module.exports = router;

