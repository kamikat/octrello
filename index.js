#!/usr/bin/env node

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(function (req, res, next) {
  console.log('%s - %s', req.method, req.url);
  if (+req.body) {
    console.log('----------------------------------');
    console.log(JSON.stringify(req.body, null, '  '));
  }
  console.log();
  return res.sendStatus(204);
});

var server = app.listen(process.env.PORT || 8033, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at %s:%s...\n', host, port);
});

