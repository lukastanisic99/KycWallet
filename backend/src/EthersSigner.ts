import { ethers } from 'ethers';
import { TextEncoder } from 'util';
import Issuer from './Issuer';
import { defineReadOnly } from '@ethersproject/properties';
//Extended Ethers.js wallet
class EthersSigner extends ethers.Signer {
    private signer: ethers.Signer; // a concrete signer (Wallet, JsonRpcSigner....)
    private digitalCertificate: any;

    public constructor(signer: ethers.Signer) {
        super();
        this.signer = signer;
        defineReadOnly(this, 'provider', signer.provider);
        defineReadOnly(this, '_isSigner', true);
    }
    getAddress(): Promise<string> {
        return this.signer.getAddress();
    }
    signMessage(message: string | ethers.utils.Bytes): Promise<string> {
        return this.signer.signMessage(message);
    }
    signTransaction(transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>): Promise<string> {
        return this.signer.signTransaction(transaction);
    }
    connect(provider: ethers.providers.Provider): ethers.Signer {
        return this.signer.connect(provider);
    }

    public async doKYC(walletAddress: string, smartCardSignature: string) {
        let signedCerData = 'certificate data'; // = call cer(signer.address)
        let allData = {
            strToVerify: walletAddress,
            signature: smartCardSignature,
        };
        let allDataJsonString = JSON.stringify(allData);

        // let messageHash = ethers.utils.solidityKeccak256(['string'], [allDataJsonString]);
        // let messageHashBinary = ethers.utils.arrayify(messageHash);
        let messageSignature = await this.signer.signMessage(allDataJsonString);

        let issuer = new Issuer();
        let addr = await this.signer.getAddress();
        this.digitalCertificate = await issuer.KYC(allDataJsonString, addr, messageSignature);
        console.log(this.digitalCertificate);
    }

    public getCertificate() {
        return this.digitalCertificate;
    }
    public static getWalletFromString(data: string, provider?: ethers.providers.Provider): ethers.Wallet {
        let enc = new TextEncoder();
        let dataArr = enc.encode(data);
        let pk = ethers.utils.sha256(dataArr);
        let wallet = new ethers.Wallet(pk, provider);
        return wallet;
    }

    public getStartingHashForAge(yearsToProve: number): string | null {
        let iterations = this.digitalCertificate.age - yearsToProve + new Date().getFullYear() - this.digitalCertificate.issuingYear;
        if (iterations < 0) return null;
        let hash = ethers.utils.solidityKeccak256(['string'], [this.digitalCertificate.secret]);
        for (let i = 0; i < iterations; i++) hash = ethers.utils.solidityKeccak256(['bytes'], [hash]);
        return hash;
    }

    public static getSignerFromProvider(provider: ethers.providers.Web3Provider): ethers.providers.JsonRpcSigner {
        return provider.getSigner();
    }
}

export default EthersSigner;

// let main = async () => {
//     let wallet = EthersSigner.getWalletFromString('user');
//     let signer = new EthersSigner(wallet);
//     await signer.doKYC();
// };

// if (require.main === module) {
//     main();
// }
