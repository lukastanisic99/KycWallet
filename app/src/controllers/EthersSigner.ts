import { ethers } from 'ethers';
import { TextEncoder } from 'util';
import { defineReadOnly } from '@ethersproject/properties';
import axios, { AxiosError } from 'axios';
import AgeZKP from '@/types/AgeZKP';

//Extended Ethers.js wallet
class EthersSigner extends ethers.Signer {
    private signer: ethers.Signer; // a concrete signer (Wallet, JsonRpcSigner....)
    private ageZKP: AgeZKP | undefined;

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

    public async doKYC(smartCardSignature: string): Promise<AgeZKP> {
        const walletAddress = await this.getAddress();

        let allData = {
            strToVerify: walletAddress,
            signature: smartCardSignature,
        };
        let allDataJsonString = JSON.stringify(allData);

        // let messageHash = ethers.utils.solidityKeccak256(['string'], [allDataJsonString]);
        // let messageHashBinary = ethers.utils.arrayify(messageHash);
        let messageSignature = await this.signer.signMessage(allDataJsonString);

        const config = {
            baseURL: 'http://localhost:4000/',
            headers: {
                'Content-Type': 'application/json',
            }
        }
        const requestJsonBody = {
            allDataJsonString,
            walletAddress,
            signature: messageSignature
        }
        // console.log(requestJsonBody)

        this.ageZKP = (await axios.post('/', requestJsonBody, config)).data as AgeZKP

        console.log(this.ageZKP);

        return this.ageZKP;
    }

    public getCertificate() {
        return this.ageZKP;
    }
    public static getWalletFromString(data: string, provider?: ethers.providers.Provider): ethers.Wallet {
        let enc = new TextEncoder();
        let dataArr = enc.encode(data);
        let pk = ethers.utils.sha256(dataArr);
        let wallet = new ethers.Wallet(pk, provider);
        return wallet;
    }

    public getStartingHashForAge(yearsToProve: number): string | null {
        let iterations = this.ageZKP!.age - yearsToProve + new Date().getFullYear() - this.ageZKP!.issuingYear;
        if (iterations < 0) return null;
        let hash = ethers.utils.solidityKeccak256(['string'], [this.ageZKP!.secret]);
        for (let i = 0; i < iterations; i++) hash = ethers.utils.solidityKeccak256(['bytes'], [hash]);
        return hash;
    }

    public static getSignerFromProvider(provider: ethers.providers.Web3Provider): ethers.providers.JsonRpcSigner {
        return provider.getSigner();
    }
}

export default EthersSigner;