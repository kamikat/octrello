var _ = require('lodash');
var request = require('superagent');

var trello = function (key, token) {
  var rpc = function (method, path) {
    if (path) {
      return request(method, 'https://api.trello.com', '/1' + path).query({
        key: key, token: token
      });
    } else {
      return rpc('GET', path = method);
    }
  };
  _.extend(rpc, {
    get: function (path) {
      return rpc('GET', path);
    },
    post: function (path) {
      return rpc('GET', path);
    },
    del: function (path) {
      return rpc('DELETE', path);
    }
  });
  return rpc;
};

module.exports = function () {
  return function (req, res, next) {
    res.trello = trello(req.query.key, req.query.token)
    return next();
  };
};

