#!/usr/bin/env node

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var debug = require('debug').debug('trello:webhook');

app.use(bodyParser.json());

app.use(function (req, res, next) {
  debug('%s - %s', req.method, req.url);
  if (req.body) {
    debug('----------------------------------');
    debug(JSON.stringify(req.body, null, '  '));
  }
  debug();
  return next();
});

app.use('/hooks/octrello', require('./lib'));

var server = app.listen(process.env.PORT || 8033, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at %s:%s...\n', host, port);
});

