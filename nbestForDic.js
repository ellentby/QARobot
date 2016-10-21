var db = require('./db.js');
var Mecab = require('./node-mecab/lib/mecab-lite.js');
var issue = require('./issue.js');

var col1 = "dictionary";
var col2 = "userCommunity";
var res1 = "SupportFAQ";
var res2 = "UserCommunity";
var ketworddictionary = "KeyWordDictionary";//store in DB
var nbest = 10;//how many key words do we find from each faq

//issue.updateLocalIssues(res2, col2, 700);

updateTFIDF();


function updateTFIDF(){
  db.connect(function(){
    db.select(col1,
      {}, function(document1){
        var documents = Array();
        documents[0] = document1;
        db.select(col2,{},function(document2){
          documents[1] = document2;
          var sum = documents[0].length + documents[1].length;
          console.log("Find "+sum+" documents in database, start calculating TF-IDF...");

          var mecab = new Mecab();
          var wordFreq = Array();//how many documents does the word appears in, index is the word *** wordFreq[word]
          var wordsInFAQ = Array();//wordsInFAQ[word] = array of issueId in SupportFAQ
          var docs = Array();//every row is a record showing the frequency of every word in a question
          docs[0] = Array();//docs[index of collection(int)][collection's ObjectID(string)][word(string)][frequency(int)]
          docs[1] = Array();
          var wordsCount = Array();//how many words in a doc, index is the id of the question record
          for(var t = 0; t<2; t++){
            for(var i=0; i<documents[t].length; i++){
              //find out key words from questions,descriptions,comments
              var target = documents[t][i].question + documents[t][i].description;
              // if(documents[t][i].comment != null){
              //   for(var ii=0; ii<documents[t][i].comment.length; ii++){
              //     target += documents[t][i].comment[ii];
              //   }
              // }
              var result = mecab.wakatigakiSync(target);
              var words = Array();
              for(var j=0; j<result.length; j++){
                //integer will not become keywords
                if(!isNaN(parseInt(result[j]))){
                  continue;
                }
                var word = result[j].toUpperCase();

                //execute when SupportFAQ
                if(t == 0){
                  if(wordsInFAQ[word] == null){
                    wordsInFAQ[word] = Array();
                    wordsInFAQ[word]["issueIDs"] = Array();
                  }
                  if(wordsInFAQ[word]["issueIDs"].indexOf(documents[t][i].issueId) == -1){
                    wordsInFAQ[word]["issueIDs"].push(documents[t][i].issueId);
                  }
                }

                if(wordFreq[word] == null){
                  wordFreq = 1;
                }else{
                  wordFreq[word]++;
                }
                if(words[word] == null){
                  words[word] = 1;
                }else{
                  words[word] ++;
                }
              }
              docs[t][documents[t][i]._id] = words;
              wordsCount[documents[t][i]._id] = result.length;
            }
          }

          for(var foo = 0; foo<2; foo++){
            var collection;
            if(foo == 0){
              collection = col1;
            }else{
              collection = col2;
            }
            //for every record in collection
            for(i in docs[foo]){
              var tfidf = Array();
              var count = 0;
              //calculate tf-idf of words in each document
              //for every word in every record
              for(j in docs[foo][i]){
                var tf = docs[foo][i][j] / wordsCount[i];
                var idf = Math.log(sum/*count of all records in DB*/ / wordFreq[j]) + 1;

                //console.log(j+" "+docs[foo][i][j] + " "+wordsCount[i] + " "+sum + " "+wordsInAllDocs[j]["docs"].length);
                tfidf[count] = Array();
                tfidf[count][0] = j;
                tfidf[count][1] = tf * idf;
                count++;
              }
              tfidf.sort(sortFunction);
              //convert tfidf to key words
              var keywords = Array();
              for(var n = 0; n<nbest/*remain n best words*/; n++){
                if(n >= tfidf.length){
                  break;
                }
                keywords[n] = tfidf[n][0];
                //only save keyword in SupportFAQ to <KeyWordDictionary>
                if(foo == 0){
                  wordsInFAQ[tfidf[n][0]]["nbest"] = true;
                }
              }
              var ObjectId = require('mongodb').ObjectID;
              db.update(collection, {"_id": new ObjectId(i)}, {key:keywords});
            }
          }
          console.log("Refresh KeyWordDictionary...");
          console.log(wordsInFAQ);
          for(idx in wordsInFAQ){
            if(wordsInFAQ[idx]["nbest"] != null && wordsInFAQ[idx]["nbest"]){
              db.insertOrUpdate(ketworddictionary, {keyword:idx},
                {keyword:idx, /*tfidf:wordsInAllDocs[idx]["tfidf"],*/ issueIDs: wordsInFAQ[idx]["issueIDs"]});
            }
          }
          console.log("Done! Find "+ nbest + " keywords for each document!");
        });
      });
    });
  }

function sortFunction(a,b){
  return b[1] - a[1];
}
