var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var SERVER = "mongodb://localhost:27017/";
var DATABASE = "QA";
var db = null;
var timer = 10;
var timerOn = true;
var deltaTime = 10;//10 seconds

exports.insert = function(collection, documents){
  if(db == null){
    connect(function(){
      InsertSelectDelete(collection, documents, insertDocuments);
    });
  }else{
    InsertSelectDelete(collection, documents, insertDocuments);
  }
}

exports.select = function(collection, documents, outercall){
  if(db == null){
    connect(function(){
      InsertSelectDelete(collection, documents, findDocuments,outercall);
    });
  }else{
    InsertSelectDelete(collection, documents, findDocuments,outercall);
  }
}

exports.delete = function(collection, documents){
  if(db == null){
    connect(function(){
      InsertSelectDelete(collection, documents, findDocuments,outercall);
    });
  }else{
    InsertSelectDelete(collection, documents, findDocuments,outercall);
  }
}

exports.update = function(collection, origin, newdata, callback){
  if(db == null){
    connect(function(){
      update(collection, origin, newdata,callback);
    });
  }else{
    update(collection, origin, newdata,callback);
  }
}
exports.connect = function(callback){
  connect(callback);
}

exports.close = function(){
  if(db != null){
    db.close();
    db = null;
    console.log("DB connection is closed");
    timerOn = false;
  }
}

/*
 *   If object exists(confirm by identifier),
 *  UPDATE it, or,
 *  INSERT it
 ** This operation can only be done to one document once.
 */
exports.insertOrUpdate = function(collection, identifier, newData, outercall){
  if(db == null){
    connect(function(){
      InsertSelectDelete(collection, identifier, findDocuments, function(document){
          if(document.length == 0){
            //document do not exist, INSERT it
            InsertSelectDelete(collection, new Array(newData), insertDocuments, outercall);
          }else{
            //document exists, UPDATE it
            update(collection, identifier, newData, outercall);
          }
      });
    });
  }else{
    InsertSelectDelete(collection, identifier, findDocuments, function(document){
        if(document.length == 0){
          //document do not exist, INSERT it
          InsertSelectDelete(collection, new Array(newData), insertDocuments, outercall);
        }else{
          //document exists, UPDATE it
          update(collection, identifier, newData, outercall);
        }
      });
  }
}

var connect = function(callback = null) {
  var url = SERVER + DATABASE;
  timer = deltaTime;
  MongoClient.connect(url, function(err, database) {
    if( err ) throw err;
    db = database;
    console.log("connect to database ")+DATABASE;
    if(callback != null){
      callback();
    }
  });
}

var InsertSelectDelete = function(collection, documents, callback, outercall = null){
  callback(collection, documents, function(result){
    if(outercall != null){
      outercall(result);
    }
  });
}

var insertDocuments = function(collection,documents, callback) {
  timer = deltaTime;
  // Get the documents collection
  var collection = db.collection(collection);
  // Insert some documents
  collection.insertMany(documents, function(err, result) {
    assert.equal(err, null);
    //console.log("Inserted ["+JSON.stringify(documents)+"] into ["+collection+"]");
    callback(result);
  });
}

var findDocuments = function(collection, documents, callback, result) {
  timer = deltaTime;
  // Get the documents collection
  var collection = db.collection(collection);
  // Find some documents
  collection.find(documents).toArray(function(err, docs) {
    assert.equal(err, null);
    //console.log("Found "+docs.length+" records");
    //console.log(docs);
    callback(docs);
  });
}

var update = function(collection, origin, newdata, callback = null){
  updateDocument(collection, origin, newdata, db, function(result){
    if(callback != null){
      callback();
    }
    //console.log("update " + JSON.stringify(origin)+" to "+JSON.stringify(newdata));
  });
}

var updateDocument = function(collection, origin, newdata, db, callback) {
  timer = deltaTime;
  // Get the documents collection
  var collection = db.collection(collection);
  // Update document where a is 2, set b equal to 1
  collection.updateOne(origin
    , { $set: newdata }, function(err, result) {
    assert.equal(err, null);
    //console.log("Updated to "+JSON.stringify(newdata)+" where "+JSON.stringify(origin));
    callback(result);
  });
}

var removeDocument = function(collection, document, callback) {
  timer = deltaTime;
  // Get the documents collection
  var collection = db.collection(collection);
  // Insert some documents
  collection.deleteOne(document, function(err, result) {
    assert.equal(err, null);
    console.log("Removed "+JSON.stringify(result));
    callback(result);
  });
}

if(timerOn){
setInterval(function() {
  if(timer > 0){
    timer--;
    if(timer <= 3 && timer >0){
      console.log("DB connection will be closed in "+timer+" s");
    }else if(timer == 0){
      console.log("DB connection is closed");
      console.log("Done!");
    }
  }else{
    timerOn = false;
    if(db != null){
      db.close(function(){
        db = null;
      });
    }else{
    }
  }
}, 1000);
}
