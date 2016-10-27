# QARobot
#### 自動的にQ＆Aを整理＆分析し、新しい質問に回答を予測する自動回答ロボット（基本バージョン）。

## デモ
質問入力　=>　「Ask」をクリック　=>　適合な三つの質問回答の一つをクリック　=>　詳細が見える

![画像1](/readme-img/DEMO.gif)
<br/><br/>


## 実装環境
* Mac OS X 10.10.5
* Node.js v6.7.0
  * Chrome の V8 JavaScript エンジン で動作する JavaScript 環境。
* npm 3.10.7
  * Node.js のパッケージ管理ツール。
* Node Modules
  `````
  ├── macab-lite
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

####Node.jsとMecabのインストールは<a href="https://github.com/ellentby/QARobot/blob/master/Mecab%E3%80%81Node.js%E3%81%AE%E7%92%B0%E5%A2%83%E8%A8%AD%E5%AE%9A.pptx">「Mecab、Node.jsの環境設定.pptx」</a>をご参照ください。
<br/><br/>
  
  
## 動作確認

* スクリプト`````db.js`````の変数DATABASEのヴァリューを自分のデータベース名に変更してください。
  ``````js
  var DATABASE = "QA";
  ``````

* Q＆AをGithub issueから取得し、ローカルに保存
 * issue.jsの中の以下の変数バリューを変更します。
   * `````root`````は<b>github API</b>のルートディレクトリーです（例として：このrepositoryのルートディレクトリーは`````https://api.github.com/repos/ellentby`````です）。
 Githubに接続するため、`````ACCESS TOKEN`````が必要です。<br/>
   * トークンを取得する方法は<a href="https://help.github.com/articles/creating-an-access-token-for-command-line-use/">こちら</a>を参照ください。
    * `````res1`````はキーワード抽出の正確度を高めるための参考用issueのResiporitoryで、`````res2`````は実際に利用するResiporitoryです。
 
  `````js
  var root = ROOT_URL_OF_YOUR_REPOSITORIES;
  var token = YOUR_GITHUB_ACCESS_TOKEN;
  var col1 = COLLECTION_OF_SUPPORT_MATERIALS_TO_MAKE_TFIDF_MORE_ACCURATE;
  var col2 = COLLECTION_OF_Q&A_YOU_ACTUALLY_USE_TO_PROVIDE_AN_ANSWER;
  var res1 = GITHUB_REPOSITORY_OF_COL1;
  var res2 = GITHUB_REPOSITORY_OF_COL2;
  `````
  * 【command line】 `````node issue`````
  * 実行完成後、データベース中に新しいCollection&Documentが生成します。
  
  ![画像2](/readme-img/node-issue.gif)
  
* Q&Aのキーワード辞書をコマンドで作成。
  * nbestForDic.jsの変数を下記の通り変更します。
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
<br/><br/> 
 
 
## 構造＆ファイル説明
  
![画像1](/readme-img/flow.png)

#### データの準備

* 手動でQ&Aを整理し、Github repositoryのIssueに保存します。<br/>＊　キーワード抽出の精度を高めるため、もう１つのrepositoryも用意する必要があります。このrepositoryへの要求は2つあります：（１）内容は関連性があること（２）データ量が多いこと（最低500個以上）
  * 上記の手順は`````Github Issue`````で行います。
 
* GithubのAPIを使って、２つのrepositoryのissueを取得し、ローカルMongoDBに保存します。このステップについて、下記の内容にご注意ください：
 * issueを更新した後、「{REPOSITORY_NAME}Flag.json」というJSONファイルが生成します。中身は更新する時間で、毎回issueを更新する際、この時間の後に更新されたissueだけをGithubから取得します。
 * Github APIは、毎回100個以下のissueを取得する制限が設定されています。100以上のissueを取得したい場合、issue.jsの下記の部分を変更し、取得するissueの数を指定してください。
 `````js
  updateLocalIssues(REPOSITORY, COLLECTION, ISSUE_NUMBER);
 `````
 * 上記の手順は`````issue.js`````で行います。
 
* MongoDBに更新したQ&AをMecabで単語化にして、単語のTF-IDFを計算し、キーワード辞書（MongoDBの`````KeyWordDictionary`````）を生成します。
  * Mecabについて<br/>
   Mecabとは京都大学情報学研究科−日本電信電話株式会社コミュニケーション科学基礎研究所 共同研究ユニットプロジェクトを通じて開発されたオープンソース 形態素解析エンジンです。インプットは文書で、アウトプットは単語の配列です。ここでは、Mecab本体とNode.jsに対応する<a href="https://github.com/kujirahand/node-mecab-lite">バインディング</a>を利用します。
  * TF-IDFについて<br/>
   TF-IDFとは、情報検索や文書推薦などで幅広く利用される特徴量の指標です。単語のTF-IDFは、ある文書に出現した単語の回数と単語が含まれている文書の数で決めます。詳しくは<a href="http://qiita.com/ynakayama/items/300460aa718363abc85c">こちら</a>を参照ください。
  * 上記の手順は`````nbestForDic.js`````で行います。
<br/>

####ユーザー質問の処理

* Mecabで質問を単語化して、助詞と記号などを消します。
* 抽出した単語をキーワード辞書とマッチングすることで、３つのベストQ&Aを探し出す。
  * Q&Aの特徴量の計算方法：単語wが含まれている文書の数の逆数の総合。（単語wはQ&Aと質問単語がかぶっている単語）
* 上記の手順は`````match.js`````で行います。
<br/>

####UI

* フロントエンド言語はJadeです。コードは`````views/index.jade`````にあります。Jadeについて、こちらをご<a href="http://naltatis.github.io/jade-syntax-docs/">参照</a>ください。

####サーバー設定

* サーバーの設定はexpressで行います。コードは`````app.js`````にあります。


## やり残すこと
#### Github Access Tokenの自動更新
access tokenは場合により失効する可能性があります。もし`````node issue`````が失敗したら、新しいaccess tokenを生成し、使ってみてください。access tokenによるエラーを防止するため、自動的にaccess tokenをチェックし、更新する機能を追加してみてください。

#### Mecabのユーザー辞書追加
自分のサービスで使われる専門用語辞書を追加することで、キーワード辞書生成の正確率は高くなります。

#### キーワード辞書生成アルゴリズムとマッチングする際のQ&A特徴量計算方法を改善

#### issueのQ&Aの改善
言葉使いをより自然になれるよう改善します。（より客観的な用語を使う）

####　データ量の増加
2つのrepositoryのissue数を増加します。

…

<br/><br/>


## 参考
<a href="https://datumstudio.jp/backstage/643">さぁ、自然言語処理を始めよう！</a><br/>
<a href="http://qiita.com/ynakayama/items/300460aa718363abc85c">特徴抽出と TF-IDF</a><br/>
<a href="https://github.com/ellentby/QARobot/blob/master/Mecab%E3%80%81Node.js%E3%81%AE%E7%92%B0%E5%A2%83%E8%A8%AD%E5%AE%9A.pptx">Mecab、Node.jsの環境設定</a>
