const chilkat = require("./chilkat").default;

function getPubkeyFromCard(pin?: string): string {

    var cert = new chilkat.Cert();

    // If you know the smart card PIN, set it prior to loading from the smartcard/USB token.
    cert.SmartCardPin = pin;

    // Pass an empty string to allow Chilkat to discover the smart card or USB token automatically.
    var success = cert.LoadFromSmartcard("");
    if (success == false) {
        console.log(cert.LastErrorText);
        throw new Error("Could not read pubkey from smartcard - " + cert.LastErrorText);
    }

    var myPublicKey = cert.ExportPublicKey();
    var myPublicKeyBase64 = myPublicKey.GetEncoded(false, "base64")

    // var myPrivateKey = cert.ExportPrivateKey();
    // var myPrivateKeyBase64 = myPrivateKey.GetPkcs8ENC("base64")

    return myPublicKeyBase64;
}

export default getPubkeyFromCard;