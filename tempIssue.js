var request = require('sync-request');
var fs = require("fs");
var db = require('./db.js');

var res = request('POST', 'https://baidu.com', {
  json: { username: 'ForbesLindesay' }
});
var user = JSON.parse(res.getBody('utf8'));
