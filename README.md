# QARobot
#### 自動的にQ＆Aを整理＆分析し、新しい質問に回答を予測する自動回答ロボット（基本バージョン）。

### デモ
質問入力　=>　「Ask」をクリック　=>　適合な三つの回答の一つをクリック　=>　詳細が見える

![画像1](/readme-img/DEMO.gif)

### 実装環境
* Mac OS X 10.10.5
* Node.js v6.7.0
  * Chrome の V8 JavaScript エンジン で動作する JavaScript 環境。
* npm 3.10.7
  * Node.js のパッケージ管理ツール。
* Node Modules
  `````
  ├── express@4.14.0
  ├── express-jade@0.0.3
  ├── fs@0.0.1-security
  ├── marked@0.3.6
  ├── moment-timezone@0.5.7
  ├── mongo@0.1.0
  ├── mongodb@2.2.10
  ├── path@0.12.7
  └── request@2.75.0
  
  `````
* MongoDB 3.2.10
  * ドキュメント指向データベース。
* Mecab 0.996
  * 自然言語処理エンジン
* Github issue
  * GithubのissueでQ＆Aを整理し、ローカルデータベースに更新します。（<a href='https://github.com/NIFTYCloud-mbaas/UserCommunity/issues'>issueの例</a>）
  
### 動作確認

* スクリプト`````db.js`````の変数DATABASEのヴァリューを自分のデータベース名に変更してください。
  ``````js
  var DATABASE = "QA";
  ``````

* Q＆AをGithub issueから取得し、ローカルに保存
  * issue.jsの中の以下の変数バリューを変更。`````res1`````はキーワード抽出の正確度を高めるための参考用issueのResiporitoryで、`````res2`````は実際に利用するResiporitoryです。
  `````js
  var col1 = COLLECTION_OF_SUPPORT_MATERIALS_TO_MAKE_TFIDF_MORE_ACCURATE;
  var col2 = COLLECTION_OF_Q&A_YOU_ACTUALLY_USE_TO_PROVIDE_AN_ANSWER;
  var res1 = GITHUB_REPOSITORY_OF_COL1;
  var res2 = GITHUB_REPOSITORY_OF_COL2;
  `````
  * 【command line】 `````node issue`````
  * 実行完成後、データベース中に新しいCollection&Documentが生成します。
  
  ![画像2](/readme-img/node-issue.gif)
  
* Q&Aのキーワード辞書をコマンドで作成
  * 上記と同様、`````res1`````、`````res2`````、`````col1`````、`````col2`````のバリューを変更してください。
  * 【command line】 `````node nbestForDic`````
  * 実行完成後、`````KeyWordDocument`````という新しいColletionが生成します。
  
* サーバープロセスを起動
  * 【command line】 `````node app`````
  * 起動成功：
  ``````
    QARobot listening on port 3000!
  ``````
  * ブラウザーで`````http://localhost:3000/qarobot`````を訪問して、結果を確認ください。
  
### 構造＆ファイル説明
  


### やり残すこと

### 参考
