"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chilkat = require('./chilkat').default;
var resolve = require('path').resolve;
function verifySignature(signature, strToVerify) {
    // This example requires the Chilkat API to have been previously unlocked.
    // See Global Unlock Sample for sample code.
    var crypt = new chilkat.Crypt2();
    crypt.Charset = 'utf-8';
    crypt.EncodingMode = 'base64';
    // Verify and restore the original file:
    var success = crypt.VerifyStringENC(strToVerify, signature);
    if (success == false) {
        console.log(crypt.LastErrorText);
        return null;
    }
    var cert = crypt.GetSignerCert(0);
    // console.log(cert)
    var myPublicKey = cert.ExportPublicKey();
    var myPublicKeyBase64 = myPublicKey.GetEncoded(false, 'base64');
    console.log(myPublicKeyBase64);
    console.log('Success!');
    let walletAddress = strToVerify;
    return { cert, myPublicKeyBase64, walletAddress };
}
exports.default = verifySignature;
