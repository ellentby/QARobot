var db = require('./db.js');
var Mecab = require('./node-mecab/lib/mecab-lite.js');

//var question = "本番用にpush通知を実施したのですが、iOSについて大多数が失敗してしまいました。下記のこちらこの要因がおおきいでしょうか？invalidTokenが3件でも引っかかってしまうのでしょうか？";

var question = "monacaから条件を指定してデータストアの値を取得する方法";

var keyworddic = "KeyWordDictionary";
var answerdic = "dictionary";
var nbest = 3;
var asyncFlag = 0;
var vote;


exports.findAnswerList = function (question,callback){
  vote = Array();
  asyncFlag = 0;
  
console.log("find answer list");

  var mecab = new Mecab();
  var words = filterMecabResult(mecab.parseSync(question));

  // console.log("================question==============");
  // console.log(question);
  // console.log("================answer====================");

  db.select(keyworddic, {}, function(document){
    console.log("db select in match.js");

    for(var i=0; i<document.length; i++){
      for(var j=0; j<words.length; j++){
        if(document[i].keyword == words[j]){
          //console.log(words[j]+" "+ document[i].issueIDs);
          var point = 1/document[i].issueIDs.length;
          for(t in document[i].issueIDs){
            var issueID = document[i].issueIDs[t];
            var index = findInArrayByIndex(vote,"issueID", issueID);
            if(index == -1){
              var issue = Array();
              issue["issueID"] = issueID;
              issue["point"] = point;
              vote.push(issue);
            }else{
              vote[index]["point"] += point;
            }
          }
        }
      }
    }
    vote.sort(sortVote);

    var answers = Array();

    for(var n=0; n<nbest && vote.length > n; n++){
      db.select(answerdic,{issueId:vote[n]["issueID"]}, function(document){
        answers.push(document[0]);
        return asyncProcess(nbest, answers, callback);
      });
    }
  });
}

function asyncProcess(endFlag, anything, callback){
  asyncFlag++;
  if(asyncFlag == endFlag){
    console.log("callback");
    callback(anything);
    for(var i=0; i<anything.length; i++){
      //console.log(vote[findInArrayByIndex(vote,"issueID",anything[i].issueId)].point);
      //console.log(anything[i]);
    }
  }
}

function findInArrayByIndex(array, index, value){
  for(var i=0; i<array.length; i++){
    if(array[i]!=null){
      if(array[i][index]!=null){
        if(array[i][index] == value){
          return i;
        }
      }
    }
  }
  return -1;
}

//also convert target to a unary
function filterMecabResult(target){
  var result = Array();
  for(var i=0; i<target.length; i++){
    target[i][0] = target[i][0].toUpperCase();
    if(target[i][1] != "助詞" && target[i][1] != "記号" && target[i][2] != "数"){
      result.push(target[i][0]);
    }
  }
  return result;
}

function sortVote(a,b){
  return b["point"] - a["point"];
}
