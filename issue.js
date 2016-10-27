/*
 * This file is to get issues from github and save them in mongodb
 */
var fs = require("fs");
var request = require("request");
var db = require('./db.js');
var moment = require('moment-timezone');
var simuDBOpr = 0;

var token = YOUR_GITHUB_ACCESS_TOKEN;
var jsonFile = "";
var collection = "";
var root = "";
var lastUpdated = "";
var col1 = COLLECTION_OF_SUPPORT_MATERIALS_TO_MAKE_TFIDF_MORE_ACCURATE;
var col2 = COLLECTION_OF_Q&A_YOU_ACTUALLY_USE_TO_PROVIDE_AN_ANSWER;
var res1 = GITHUB_REPOSITORY_OF_COL1;
var res2 = GITHUB_REPOSITORY_OF_COL2;

  updateLocalIssues(res1, col1);

function updateLocalIssues(from/*respository of issues*/,
  to/*collection name in DB*/,
  issueNumber = 100/*How many issues are to be refreshed, no need to be defined if under 100*/){
  console.log("Start to download data from repository "+from+" to collection "+to+"...");
  collection = to;
  //var root = "https://api.github.com/repos/NIFTYCloud-mbaas/SupportFAQ/issues";
  root = "https://api.github.com/repos/NIFTYCloud-mbaas/"+from+"/issues";
  jsonFile = from+'Flag.json';
  if(!fs.existsSync(jsonFile)){
    lastUpdated = "2000-01-01T00:00:00+09:00";
  }else{
    lastUpdated = JSON.parse(fs.readFileSync(from+'Flag.json')).lastUpdated;
  }
  var pages = Math.ceil(issueNumber/100);

  db.connect(function(){
    for(var i=1; i<=pages; i++){
      updateIssueMeta(i,100);
    }
  });
  refreshUpdateTime();
}

var updateIssueMeta = function(pageNo,perPage){
    request({
        url: root,
        qs: {
          page: pageNo,
          per_page: perPage,
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
              document.url = result[i].url;
              //save comment url and request them after this callback function
              comments[i] = Array();
              comments[i]["issueId"] = document.issueId;
              comments[i]["comments_url"] = result[i].comments_url;
              db.insertOrUpdate(collection, {issueId:document["issueId"]}, document);
            }
            console.log("page "+pageNo+": "+(i)+" issues updating...");
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
              //console.log(error2);
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
  console.log("comments updating...");
}

function refreshUpdateTime(){
  var now = moment().tz("Asia/Tokyo").format();
  fs.writeFile(jsonFile , "{\"lastUpdated\":\""+ now +"\"}", function(err) {
      if(err) {
          return console.log(err);
      }else{
        console.log("Write update time to local: "+now);
      }
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
