var _ = require('lodash');
var request = require('superagent');

var trello = function (key, token) {
  var rpc = function (method, path) {
    return request(method, 'https://api.trello.com/1' + path).query({
      key: key, token: token
    });
  };
  _.extend(rpc, {
    req: {
      getCard: function (boardId, cardId, callback) {
        rpc('GET', '/boards/' + boardId + '/cards/' + cardId).end(function (err, res) {
          if (err) return callback(err);
          return callback(null, res.body);
        });
      },
    },
    res: {
      addCommentToCard: function (card, text, callback) {
        rpc('POST', '/cards/' + card.id + '/actions/comments').send({ text: text }).end(callback);
      },
      setLabelsOnCard: function (card, labels, callback) {
        rpc('PUT', '/cards/' + card.id + '/labels').send({ value: labels.join(',') }).end(callback);
      },
      addLabelsOnCard: function (card, labels, callback) {
        rpc.res.setLabelsOnCard(card, _.union(_.pluck(card.labels, 'color'), labels), callback);
      },
      delLabelsOnCard: function (card, labels, callback) {
        rpc.res.setLabelsOnCard(card, _.difference(_.pluck(card.labels, 'color'), labels), callback);
      }
    }
  });
  return rpc;
};

module.exports = function (req, res, next) {
  var rpc = trello(req.query.key, req.query.token);
  _.extend(req, rpc.req);
  _.extend(res, rpc.res);
  req.trello = res.trello = rpc;
  return next();
};

