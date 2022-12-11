const chilkat = require("./chilkat").default;

function saveCert(format: "pem" | "cer", pin?: string) {

    var cert = new chilkat.Cert();

    // If you know the smart card PIN, set it prior to loading from the smartcard/USB token.
    cert.SmartCardPin = pin;

    // Pass an empty string to allow Chilkat to discover the smart card or USB token automatically.
    var success = cert.LoadFromSmartcard("");
    if (success == false) {
        console.log(cert.LastErrorText);
        return;
    }
    // console.log(cert)
    // console.log('HasPrivateKey', cert.HasPrivateKey())
    // console.log('PrivateKeyExportable', cert.PrivateKeyExportable)

    // console.log("Cert loaded from smartcard: " + cert.SubjectCN);

    //success = cert.SaveToFile("smartCardCert.cer")
    success = cert.SaveToFile("smartCardCert." + format)
}

export default saveCert;