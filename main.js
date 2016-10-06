var db = require('./db.js');

/*
 *   INSERT
 */
// db.insert("documents",[{question : "q2",answer : "a2",tag : "t2"}]);

/*
 *   SELECT
 */
// var result = db.select("documents",
//     {question : "q1",answer : "a1",tag : "t1"}, function(documents){
//       console.log("!!!!!!"+JSON.stringify(documents));
//     });

/*
 *   DELETE
 */
// db.delete("documents",{question : "q1",answer : "a1",tag : "t1"});

/*
 *   UPDATE
 */
db.update("documents", {question : "q2",answer : "a2",tag : "t2"}, {question : "q2",answer : "a2",tag : "t222"});
