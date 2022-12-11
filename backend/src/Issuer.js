"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const EthersSigner_1 = __importDefault(require("./EthersSigner"));
const verifySignature_1 = __importDefault(require("./common/verifySignature"));
//Extended Ethers.js wallet
class Issuer {
    constructor() {
        this.signer = EthersSigner_1.default.getWalletFromString('Government');
    }
    async KYC(allDataJsonString, walletAddress, signature) {
        // console.log(await this.signer.getAddress());
        let adr = ethers_1.ethers.utils.verifyMessage(allDataJsonString, signature);
        if (adr != walletAddress)
            throw new Error('Incorrect Wallet Signature');
        let data = JSON.parse(allDataJsonString);
        //CHECK CERTIFICATE SIGNATURE and ADDRESS
        let certificateObj = (0, verifySignature_1.default)(data.signature, data.strToVerify);
        console.log(certificateObj.cert);
        if (!certificateObj)
            throw new Error('Incorrect ID signature');
        if (certificateObj.walletAddress != walletAddress)
            throw new Error('Incorrect wallet address signed');
        //Asume everything passed
        let secret = Math.random().toString(36).slice(2, 13);
        let age = 23; // This should be fetched from the certificate
        let hash = ethers_1.ethers.utils.solidityKeccak256(['string'], [secret]);
        for (let i = 0; i < age; i++) {
            hash = ethers_1.ethers.utils.solidityKeccak256(['bytes'], [hash]);
        }
        let issuingYear = new Date().getFullYear();
        //Sign message [adr,hash,year];
        let messageHash = ethers_1.ethers.utils.solidityKeccak256(['address', 'bytes32', 'uint16'], [walletAddress, hash, issuingYear]);
        let messageHashBinary = ethers_1.ethers.utils.arrayify(messageHash);
        let messageSignature = await this.signer.signMessage(messageHashBinary);
        return { secret, hash, walletAddress, age, issuingYear, messageSignature };
    }
}
exports.default = Issuer;
