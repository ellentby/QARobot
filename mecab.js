// mecab test sync
var Mecab = require('./node-mecab/lib/mecab-lite.js');
var mecab = new Mecab();

// parse
var text = "すもももももももものうち";
//var items = mecab.parseSync(text);
//console.log(items);
var text = "InvalidTokenは、「デバイストークンが不正である」ということを示しております。ただし、アプリの削除や再インストールに伴って無効となったデバイストークンはカウントされません。なお、InvalidTokenエラーが発生する事象としては以下の内容が考えられます。APNsから発行されたトークンではなく、適当な文字列を使った場合debugビルドしたアプリで入手したデバイストークン宛に、production証明書を使って送信した場合";
// wakatigaki
var items2 = mecab.wakatigakiSync(text);
console.log(items2);

/*
var termTable = new Array();

for(index in items2){
  if(termTable[items2[index]] == null){
    termTable[items2[index]] = 1;
  }else{
    termTable[items2[index]]++;
  }
}

for(index in termTable){
  console.log(index+" "+termTable[index]);
}
*/
