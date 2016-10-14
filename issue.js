/*
 * This file is to get issues from github and save them in mongodb
 */
var fs = require("fs");
var request = require("request");
var db = require('./db.js');
var moment = require('moment-timezone');

//var token = 'e9f856c32c9fcc25a37ebae2c1a89508b0770948';
//var token = "9a404e9131c9374ee93683338be0dd8b6720f8b0";
var token = "1e2cea47428201ef460ba6e53ac4fc5c5625bfbc";
var jsonFile = "";
var collection = "";

exports.updateLocalIssues = function(from/*resporistory of issues*/, to/*collection name in DB*/){
  collection = to;
  //var root = "https://api.github.com/repos/NIFTYCloud-mbaas/SupportFAQ/issues";
  var root = "https://api.github.com/repos/NIFTYCloud-mbaas/"+from+"/issues";
  jsonFile = from+'Flag.json';
  if(!fs.existsSync(jsonFile)){
    var lastUpdated = "2000-01-01T00:00:00+09:00";
  }else{
    var lastUpdated = JSON.parse(fs.readFileSync(from+'Flag.json')).lastUpdated;
  }

  request({
      url: root,
      qs: {
        page: '0',
        per_page: '1000',
        access_token: token,
        since: lastUpdated,
        state: "all",
      }, //Query string data
      method: 'GET',
      headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'ellentby',
          'Time-Zone': 'Japan',
          'If-Modified-Since': lastUpdated
      }
  }, function(error, response, body){
      if(error) {
        console.log(error);
      }else if(response.statusCode != 200){
        console.log("Request ERROR: "+response.statusCode);
        console.log(body);
      }else {
          //get issue title and basic info
          var result = JSON.parse(body);
          var comments = Array();
          for(var i=0; i<result.length; i++){
            var document = {};
            document.issueId = result[i].number;
            document.question = result[i].title;
            document.description = result[i].body;
            document.labels = Array();
            for(var j=0; j<result[i].labels.length; j++){
              document.labels[j] = result[i].labels[j]["name"];
            }
            document.url = JSON.stringify(result[i].url);
            //save comment url and request them after this callback function
            comments[i] = Array();
            comments[i]["issueId"] = document.issueId;
            comments[i]["comments_url"] = result[i].comments_url;
            db.insertOrUpdate(collection, {issueId:document["issueId"]}, document);
          }
          console.log((i)+" issues updated!");
      }
      return updateComment(comments);
  });
}
var updateComment = function(array){
  for(var i=0; i<array.length; i++){
    request({
        url: array[i]["comments_url"],
        qs: {access_token: token}, //Query string data
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'ellentby'
        }
    }, function(error2, response2, body2){
          if(error2) {
              console.log(error2);
          } else {
            var result2 = JSON.parse(body2);
            var commentArray = Array();
            var issueId = 0;
            for(var n=0; n<result2.length; n++){
              commentArray[n] = result2[n].body;
              if(n == 0){
                issueId = parseInt(
                  result2[n].issue_url.substring(
                    result2[n].issue_url.indexOf("issues/")+7, result2[n].issue_url.length
                  )
                );
              }
            }
            if(issueId != 0){
              db.update(collection, {issueId: issueId}, {comment: commentArray});
            }
          }
      });
  }
  console.log("comments updated!");
  return refreshUpdateTime();
}

var refreshUpdateTime = function(){
  var now = moment().tz("Asia/Tokyo").format();
  fs.writeFile(jsonFile , "{\"lastUpdated\":\""+ now +"\"}", function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("updating finished! Flag refreshed! Now is " + now);
    });
}

function parseSymbols(string) {
  return string.replace(/%[\da-f]{2}%/gi,function(m) {
    return String.fromCharCode(parseInt(m.substr(1,2), 16));
  });
}
function arrayToJson(array){
  var str = "{";
  for(index in array){
    str = str + index + ":" + "\"" + array[index] + "\"" + ",";
  }
  str = str.substring(0, str.length - 2);
  str = str + "}";
  console.log(str);
  return JSON.parse(str);
}
