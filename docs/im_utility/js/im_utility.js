/**
 * IDをタイムスタンプにする
 */
function idToTimestamp(id) {
  
  if (!id || id.length < 11) {
    throw new Error("入力値はIDではありません");
  }
  
  var s = String(parseInt(id.substring(0, 11), 36));
  
  if (s === "NaN") {
    throw new Error("入力値はIDではありません");
  }
  
  return s.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{3})$/, "$1/$2/$3 $4:$5:$6.$7");
}

// パスワードの暗号化/復号
// https://code.google.com/p/crypto-js/#DES,_Triple_DES
// https://groups.google.com/forum/#!topic/crypto-js/I378fq3esK8

function getKeyHex(key) {
  var keyHex = CryptoJS.enc.Utf8.parse(key);
  
  if (keyHex.sigBytes < 8) {
    // キーが8バイト未満の場合にパディング
    var s = CryptoJS.enc.Hex.stringify(keyHex) + "0102030405060708".substring(keyHex.sigBytes * 2);
    keyHex = CryptoJS.enc.Hex.parse(s);
  }
  
  return keyHex;
}

function getCryptoCfg() {
  return {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  };
}

/**
 * 暗号化する
 */
function encrypt(plain, key) {

  return CryptoJS.DES.encrypt(plain, getKeyHex(key), getCryptoCfg()).toString();
}

/**
 * 復号する
 */
function decrypt(secret, key) {
  
  var ciphertext = CryptoJS.enc.Base64.parse(secret);
  
  if (CryptoJS.enc.Base64.stringify(ciphertext) !== secret) {
    throw new Error("Base64として不正な値です");
  }  

  var decrypted = CryptoJS.DES.decrypt(
                                { ciphertext: ciphertext },
                                getKeyHex(key),
                                getCryptoCfg());

  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * FAQのURLを単純化する
 */
function simplifyFaqUrl(arg) {
  var url = arg.split("?");
  
  if (url.length !== 2 || url[0] !== 'http://imfaq.intra-mart.jp/imqa/faq/detail.asp') {
    throw new Error("URLが不正です");
  }
  
  return 'http://imfaq.intra-mart.jp/imqa/faq/search_direct01Detail.asp?id=' +
  	       url[1].toUpperCase().replace(/.+FAQID=(\d+).*/, '$1');
}