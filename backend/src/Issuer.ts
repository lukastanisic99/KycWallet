import { ethers } from 'ethers';
import { TextEncoder } from 'util';
import EthersSigner from './EthersSigner';
import verifySignature from './common/verifySignature';
//Extended Ethers.js wallet
class Issuer {
    private signer: ethers.Signer;

    public constructor() {
        this.signer = EthersSigner.getWalletFromString('Government');
    }
    public async KYC(allDataJsonString: string, walletAddress: string, signature: string) {
        // console.log(await this.signer.getAddress());
        let adr = ethers.utils.verifyMessage(allDataJsonString, signature);
        if (adr != walletAddress) throw new Error('Incorrect Wallet Signature');
        let data = JSON.parse(allDataJsonString);
        //CHECK CERTIFICATE SIGNATURE and ADDRESS
        let certificateObj = verifySignature(data.signature, data.strToVerify);
        console.log(certificateObj.cert);
        if (!certificateObj) throw new Error('Incorrect ID signature');
        if (certificateObj.walletAddress != walletAddress) throw new Error('Incorrect wallet address signed');
        //Asume everything passed
        let secret = Math.random().toString(36).slice(2, 13);
        let age = 23; // This should be fetched from the certificate
        let hash = ethers.utils.solidityKeccak256(['string'], [secret]);
        for (let i = 0; i < age; i++) {
            hash = ethers.utils.solidityKeccak256(['bytes'], [hash]);
        }
        let issuingYear = new Date().getFullYear();

        //Sign message [adr,hash,year];
        let messageHash = ethers.utils.solidityKeccak256(['address', 'bytes32', 'uint16'], [walletAddress, hash, issuingYear]);
        let messageHashBinary = ethers.utils.arrayify(messageHash);
        let messageSignature = await this.signer.signMessage(messageHashBinary);

        return { secret, hash, walletAddress, age, issuingYear, messageSignature };
    }
}

export default Issuer;
