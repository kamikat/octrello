#!/usr/bin/env node

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var debug = require('debug');
var debug_traffic = debug('debug_traffic');

app.use(bodyParser.json());
app.use(function (req, res, next) {
  debug_traffic('%s - %s', req.method, req.url);
  if (req.body) {
    debug_traffic('----------------------------------');
    debug_traffic(JSON.stringify(req.body, null, '  '));
  }
  debug_traffic();
  return next();
});
app.use('/hooks/github-trello', require('./index'));
app.use(function (req, res, next) {
  return res.sendStatus(204);
});

var server = app.listen(process.env.PORT || 8033, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at %s:%s...\n', host, port);
});

