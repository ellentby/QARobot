var db = require('./db.js');

/*
 *   INSERT
 */
 db.insert("document",[{question : "私はあなたが好き",
 date : Date()}]);
 db.insert("documents",[{question : "私はあなたが嫌い",
 date : Date()}]);
 //
 // db.insert("dictionary",[{question : "【mBaaS】プッシュ通知：株式会社ちえラボ：開封通知について",
 // description : "ドキュメント等に記載の開封通知機能ですが、こちらは管理コンソールからその機能が確認できないのですが、BASICプランに含まれていないというものでしょうか、その場合はいずれのプランから利用可能となりますでしょうか？",
 // answer : "プッシュの開封通知機能はいずれのプランでもご利用いただけます。開封通知機能を利用いただけるためには、アプリでの実装が必要であり、コンソールからの開封通知の確認は以下のURLで説明となります。http://mb.cloud.nifty.com/doc/dashboard/push.html#tocAnchor-1-8実装に関して、Android,iOSのそれぞれ実装方法をご参考の上、ご検討して頂ければと思います。http://mb.cloud.nifty.com/doc/sdkguide/ios/push.html#tocAnchor-1-10http://mb.cloud.nifty.com/doc/sdkguide/android/push.html#tocAnchor-1-15",
 // tag : "t2",
 // date: Date()}]);
/*
 *   SELECT
 */
// var result = db.select("documents",
//     {question : "q2",tag : "t2"}, function(documents){
//       console.log("callback function "+JSON.stringify(documents));
//     });

/*
 *   DELETE
 */
// db.delete("documents",{question : "q1",answer : "a1",tag : "t1"});

/*
 *   UPDATE
 */
//db.update("documents", {question : "q2",answer : "a2"}, {question : "q2",answer : "a2",tag : "tttt222"});
/*
 *   If object exists(confirm by identifier),
 *  UPDATE it, or,
 *  INSERT it
 ** This operation can only be done to one document once.
 */
//db.insertOrUpdate("documents",{question : "q9",answer : "a2"}, {question : "q9",answer : "a2",tag : "--!!--"});

db.close();
