"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const util_1 = require("util");
const Issuer_1 = __importDefault(require("./Issuer"));
const properties_1 = require("@ethersproject/properties");
//Extended Ethers.js wallet
class EthersSigner extends ethers_1.ethers.Signer {
    constructor(signer) {
        super();
        this.signer = signer;
        (0, properties_1.defineReadOnly)(this, 'provider', signer.provider);
        (0, properties_1.defineReadOnly)(this, '_isSigner', true);
    }
    getAddress() {
        return this.signer.getAddress();
    }
    signMessage(message) {
        return this.signer.signMessage(message);
    }
    signTransaction(transaction) {
        return this.signer.signTransaction(transaction);
    }
    connect(provider) {
        return this.signer.connect(provider);
    }
    async doKYC(walletAddress, smartCardSignature) {
        let signedCerData = 'certificate data'; // = call cer(signer.address)
        let allData = {
            strToVerify: walletAddress,
            signature: smartCardSignature,
        };
        let allDataJsonString = JSON.stringify(allData);
        // let messageHash = ethers.utils.solidityKeccak256(['string'], [allDataJsonString]);
        // let messageHashBinary = ethers.utils.arrayify(messageHash);
        let messageSignature = await this.signer.signMessage(allDataJsonString);
        let issuer = new Issuer_1.default();
        let addr = await this.signer.getAddress();
        this.digitalCertificate = await issuer.KYC(allDataJsonString, addr, messageSignature);
        console.log(this.digitalCertificate);
    }
    getCertificate() {
        return this.digitalCertificate;
    }
    static getWalletFromString(data, provider) {
        let enc = new util_1.TextEncoder();
        let dataArr = enc.encode(data);
        let pk = ethers_1.ethers.utils.sha256(dataArr);
        let wallet = new ethers_1.ethers.Wallet(pk, provider);
        return wallet;
    }
    getStartingHashForAge(yearsToProve) {
        let iterations = this.digitalCertificate.age - yearsToProve + new Date().getFullYear() - this.digitalCertificate.issuingYear;
        if (iterations < 0)
            return null;
        let hash = ethers_1.ethers.utils.solidityKeccak256(['string'], [this.digitalCertificate.secret]);
        for (let i = 0; i < iterations; i++)
            hash = ethers_1.ethers.utils.solidityKeccak256(['bytes'], [hash]);
        return hash;
    }
    static getSignerFromProvider(provider) {
        return provider.getSigner();
    }
}
exports.default = EthersSigner;
// let main = async () => {
//     let wallet = EthersSigner.getWalletFromString('user');
//     let signer = new EthersSigner(wallet);
//     await signer.doKYC();
// };
// if (require.main === module) {
//     main();
// }
