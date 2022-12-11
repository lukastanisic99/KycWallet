const chilkat = require("./chilkat");

var resolve = require('path').resolve

function getPubkeyFromFile(path: string): string {

    // for example path = "smartCardCert.pem"

    var crypt = new chilkat.Crypt2();
    crypt.Charset = "utf-8";
    crypt.EncodingMode = "base64";

    var inFile = resolve(path);

    var publicKey = new chilkat.PublicKey();
    publicKey.LoadFromFile(inFile)
    var str = publicKey.GetEncoded(true, "base64")
    //console.log(str)

    return str
}

export default getPubkeyFromFile;