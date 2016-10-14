var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var SERVER = "mongodb://localhost:27017/";
var DATABASE = "QA";
var connection = null;

exports.insert = function(collection, documents){
  InsertSelectDelete(collection, documents, insertDocuments);
}

exports.select = function(collection, documents, outercall){
  InsertSelectDelete(collection, documents, findDocuments, outercall);
}

exports.delete = function(collection, documents){
  InsertSelectDelete(collection, documents, removeDocument);
}

exports.update = function(collection, origin, newdata){
  update(collection, origin, newdata);

}
/*
 *   If object exists(confirm by identifier),
 *  UPDATE it, or,
 *  INSERT it
 ** This operation can only be done to one document once.
 */
exports.insertOrUpdate = function(collection, identifier, newData){
  InsertSelectDelete(collection, identifier, findDocuments, function(document){
      if(document.length == 0){
        //document do not exist, INSERT it
        InsertSelectDelete(collection, new Array(newData), insertDocuments);
      }else{
        //document exists, UPDATE it
        update(collection, identifier, newData);
      }
  });
}


var InsertSelectDelete = function(collection, documents, callback, outercall = null){
  // Connection URL
  var url = SERVER + DATABASE;
  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
    if(connection == null){
      connection = db; 
    }

    assert.equal(null, err);
    //console.log("Connected successfully to server");
    callback(collection, documents, db, function(result){
      if(outercall != null){
        outercall(result);
      }
      db.close();
    });
  });
}

var insertDocuments = function(collection,documents, db, callback) {
  // Get the documents collection
  var collection = db.collection(collection);
  // Insert some documents
  collection.insertMany(documents, function(err, result) {
    assert.equal(err, null);
    //assert.equal(3, result.result.n);
    //assert.equal(3, result.ops.length);
    //console.log("Inserted ["+JSON.stringify(documents)+"] into ["+collection+"]");
    callback(result);
  });
}

var findDocuments = function(collection, documents, db, callback, result) {
  // Get the documents collection
  var collection = db.collection(collection);
  // Find some documents
  collection.find(documents).toArray(function(err, docs) {
    assert.equal(err, null);
    //console.log("Found the following records");
    //console.log(docs);
    callback(docs);
  });
}

var update = function(collection, origin, newdata){
  // Connection URL
  var url = SERVER + DATABASE;
  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
    //assert.equal(null, err);
    if(err != null){
      console.log(err);
       return;
    }
    //console.log("Connected successfully to server");
    updateDocument(collection, origin, newdata, db, function(result){
      //console.log("update " + JSON.stringify(origin)+" to "+JSON.stringify(newdata));
      db.close();
    });
  });
}

var updateDocument = function(collection, origin, newdata, db, callback) {
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

var removeDocument = function(collection, document, db, callback) {
  // Get the documents collection
  var collection = db.collection(collection);
  // Insert some documents
  collection.deleteOne(document, function(err, result) {
    assert.equal(err, null);
    console.log("Removed "+JSON.stringify(result));
    callback(result);
  });
}
