const chilkat = require('./chilkat').default;

function signFromCardString(strToSign: string, deterministic: boolean = true, saveAsFile: string = '', pin?: string): string {
    // This example requires the Chilkat API to have been previously unlocked.
    // See Global Unlock Sample for sample code.

    var crypt = new chilkat.Crypt2();

    // This example will use the certificate + private key currently inserted into a smartcard reader.
    var cert = new chilkat.Cert();

    // If we wish to provide the smartcard PIN (otherwise the user will be prompted by the operating system).
    cert.SmartCardPin = pin;
    var success = cert.LoadFromSmartcard('');
    if (success !== true) {
        console.log(cert.LastErrorText);
        throw new Error('Could not read cert from smartcard - ' + cert.LastErrorText);
    }

    // Note: It is also possible to use certs from .pfx/.p12, .pem, or other sources such as
    // pre-installed Windows certificates.

    success = crypt.SetSigningCert(cert);

    crypt.Charset = 'utf-8';

    // Use SHA-256 rather than the default of SHA-1
    crypt.HashAlgorithm = 'sha512';

    // Create JSON that tells Chilkat what signing attributes to include:
    var attrs = new chilkat.JsonObject();
    attrs.UpdateBool('contentType', true);
    attrs.UpdateBool('signingTime', !deterministic);
    attrs.UpdateBool('messageDigest', true);
    attrs.UpdateBool('signingCertificateV2', true);

    if (!deterministic) {
        // A CAdES-T signature is one that includes a timestampToken created by an online TSA (time stamping authority).
        // We must include the TSA's URL, as well as a few options to indicate what is desired.
        // Except for the TSA URL, the options shown here are typically what you would need.
        attrs.UpdateBool('timestampToken.enabled', true);
        attrs.UpdateString('timestampToken.tsaUrl', 'https://freetsa.org/tsr');
        attrs.UpdateBool('timestampToken.addNonce', false);
        attrs.UpdateBool('timestampToken.requestTsaCert', true);
        attrs.UpdateString('timestampToken.hashAlg', 'sha512');
    }

    crypt.SigningAttributes = attrs.Emit();

    var bd = new chilkat.BinData();
    bd.AppendString(strToSign, 'utf-8');

    // This creates the CAdES-T signature.  During the signature creation, it
    // communicates with the TSA to get a timestampToken.
    // The contents of bd are signed and replaced with the CAdES-T signature (which embeds the original content).
    success = crypt.OpaqueSignBd(bd);
    if (success !== true) {
        console.log(crypt.LastErrorText);
        throw new Error('Could not sign from smartcard - ' + cert.LastErrorText);
    }

    if (saveAsFile !== '') bd.WriteFile(saveAsFile);

    // Get the signature in base64 format:
    return bd.GetEncoded('base64_mime');
}

export default signFromCardString;
