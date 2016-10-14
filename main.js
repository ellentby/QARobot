var db = require('./db.js');
var Mecab = require('./node-mecab/lib/mecab-lite.js');
var issue = require('./issue.js');

var collection = "dictionary";
var nbest = 10;//how many key words do we find from each faq

//issue.updateLocalIssues(respName,collectionName);

updateTFIDF("userCommunity");


function updateTFIDF(collection){
  db.select(collection,
    {}, function(documents){
      console.log("Find "+documents.length+" documents in DB, start calculating TF-IDF...");

      var mecab = new Mecab();
      var wordsInAllDocs = Array();//how many documents does the word appears in, index is the word
      var docs = Array();//every row is a record show the frequency of every word in a question
      var wordsCount = Array();//how many words in a doc, index is the id of the question record
      for(var i=0; i<documents.length; i++){
        //find out key words from questions,descriptions,comments
        var target = documents[i].question + documents[i].description;
        if(documents[i].comment != null){
          for(var ii=0; ii<documents[i].comment.length; ii++){
            target += documents[i].comment[ii];
          }
        }
        var result = mecab.wakatigakiSync(target);
        var words = Array();
        for(var j=0; j<result.length; j++){
          if(words[result[j]] == null){
            words[result[j]] = 1;
            if(wordsInAllDocs[result[j]] == null){
              wordsInAllDocs[result[j]] = 1;
            }else{
              wordsInAllDocs[result[j]]++;
            }
          }else{
            words[result[j]] ++;
          }
        }
        docs[documents[i]._id] = words;
        wordsCount[documents[i]._id] = result.length;
      }

      for(i in docs){
        var tfidf = Array();
        var count = 0;
        //calculate tf-idf of words in each document
        for(j in docs[i]){
          var tf = docs[i][j] / wordsCount[i];
          var idf = Math.log(documents.length / wordsInAllDocs[j]) + 1;
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
        }
        var ObjectId = require('mongodb').ObjectID;
        db.update(collection, {"_id": new ObjectId(i)}, {key:keywords});

        console.log(i);
      }
      console.log("Done! Find "+ nbest + " keywords for each document!");
    });
  }

function sortFunction(a,b){
  return b[1] - a[1];
}
