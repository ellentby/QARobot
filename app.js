var express = require('express');
var app = express();
var path = require("path");
var md = require('markdown-it')
var marked = require('marked');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'statics')));


app.get('/qarobot', function (req, res) {
  if(req.query.question === undefined){
    if(req.query.issueId === undefined){
      res.render('index', { });
    }else{
      console.log("issueid "+ req.query.issueId);
      var select = require('./selectIssue.js');
      select.selectIssue(parseInt(req.query.issueId), function(result){
        res.render('index', {issue:result.comment, marked: marked});
      });
    }
  }else {
    var match = require('./match.js');
    match.findAnswerList(req.query.question,function(result){
      var urls = Array();
      var quetion = Array();
      var questions = Array();
      for(i in result){
        questions.push({url: result[i].url, question: result[i].question, issueId: result[i].issueId});
      }
      res.render('index', { urls: urls, questions: questions});
    });
  }
});

app.listen(3000, function () {
  console.log('QARobot listening on port 3000!');
});
