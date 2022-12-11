const chilkat = require("./chilkat").default;
var resolve = require('path').resolve

function extractData(path: string, pin?: string): string {

    var crypt = new chilkat.Crypt2();
    crypt.Charset = "utf-8";
    crypt.EncodingMode = "base64";

    var cert = new chilkat.Cert();
    cert.SmartCardPin = pin;
    var success = cert.LoadFromSmartcard("");
    if (success !== true) {
        console.log(cert.LastErrorText);
        throw new Error("Could not read cert from smartcard - " + cert.LastErrorText);
    }

    var bd = new chilkat.BinData();
    var inFile = resolve(path);
    bd.LoadFile(inFile);
    var opaqueSig = bd.GetEncoded("base64_mime");

    // We only need the certificate to verify a signature (and extract the data from
    // an opaque signature).  The public key is always embedded within a certificate.
    success = crypt.SetVerifyCert(cert);
    if (success !== true) {
        console.log(crypt.LastErrorText);
        throw new Error("Could not set cert from smartcard - " + cert.LastErrorText);
    }

    var extractedData = crypt.OpaqueVerifyStringENC(opaqueSig);
    if (crypt.LastMethodSuccess !== true) {
        console.log(crypt.LastErrorText);
        throw new Error("Could not verify signature - " + cert.LastErrorText);
    }

    return extractedData
}

export default extractData;