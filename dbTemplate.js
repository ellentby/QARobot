var db = require('./db.js');

/*
 *   INSERT
 */
 // db.insert("dictionary",[{question : "【mBaaS】データストア：株式会社ちえラボ：データストアにCSVアップロードした場合の仕様",
 // description : "弊社クライアントへ御社サービスの利用を検討しており、NiftyCloud mobilebackendの管理画面についてお尋ねします。・データストアにCSVアップロードした場合、列順がランダムに決まるようなのですが、変更する方法はありますでしょうか？（アプリ側からデータ登録した際も同様）・データストアにCSVをアップロードした場合は、一旦テーブルは削除されるようですが、追記する方法はありますでしょうか。（RDBでいうところのテーブルをドロップせずにインサートしたい）・データストアからエクスポートした際のファイル形式にCSVを加えることはできますでしょうか？以上、ご回答の程よろしくおねがいします。",
 // answer : "・データストアにCSVアップロードした場合、列順がランダムに決まるようなのですが、変更する方法はありますでしょうか？（アプリ側からデータ登録した際も同様）->列順の変更は不可能となります・データストにCSVをアップロードした場合は、一旦テーブルは削除されるようですが、追記する方法はありますでしょうか。（RDBでいうところのテーブルをドロップせずにインサートしたい）->現在追加は不可能となります・データストアからエクスポートした際のファイル形式にCSVを加えることはできますでしょうか？以上、ご回答の程よろしくおねがいします->現在追加は不可能となります",
 // tag : "t2",
 // date : Date()}]);
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
db.insertOrUpdate("documents",{question : "q9",answer : "a2"}, {question : "q9",answer : "a2",tag : "--!!--"});
