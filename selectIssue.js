var db = require('./db.js');
var collection = "dictionary";

exports.selectIssue = function(issueId, callback){
  var result = db.select(collection,
      {issueId: issueId}, function(documents){
        if(callback != null){
          callback(documents[0]);
        }
      });
}
