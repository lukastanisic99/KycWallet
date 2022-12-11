# KYCWallet

KYCWallet is a set of 4 tools that help you and the goventment to apply laws such age restriction to web3 space

This repo represents a wallet and SDK implementation for a KYC wallet. It extends the ethers.js library with more functionality, more specifically the ethers Singer. It allows the user to create a deterministic wallet from his SmartCard or use any JsonRpc wallet such as Metamask. Further it allows for KYC-ing that wallet with any third party by obtaining a digital certificate from them. It also supports ZK (zero knowledge) proofs for proving to independent third parties that the wallet is KYC-ed without revealing any other information. On top of that we’ve also implemented proving that the user is older than a certain age and provided a Smart Contract that will check and verify such proof.

![Alt text](./gambling18plus.png?raw=true "Title")

# Documentation

We have 4 components to out solution

1. CLI tool - For signing and wallet generation with a smartcard
2. Smart contract - For ZK proof and KYC signature verification
3. Backend - NodeJS express server
4. Web application - For uploading signatures to governing body

---

## CLI Tool

```
kycwallet

USAGE:
    kycwallet <SUBCOMMAND>

SUBCOMMANDS:
    read-pubkey                     Displays pubkey from smartcard
    save-cert                       Saves smartcard certificate to local storage
    sign-wallet <address>           Signs wallet address with smartcard
    generate-kyc-wallet <seed>      Generates KYC wallet with signed seed
```

Setup:

```
cd backend
npm install
```

Running (All of these require a smartcard to be connected):

```
npm run kycwallet
npm run kycwallet -- read-pubkey
npm run kycwallet -- save-cert
npm run kycwallet -- sign-wallet <address>
npm run kycwallet -- generate-kyc-wallet <seed>
```

Building:

```
npm run build-cli
```

Then you can use it like this

```
node .
node . read-pubkey
node . save-cert
node . sign-wallet <address>
node . generate-kyc-wallet <seed>
```

---

## Smart contracts

Setup (on local devnet):

```
cd hardhat
npm install
```

Run a local node with 0 gas fees in a seperate terminal:

```
npx ganache -d -g 0 --chain.hardfork 'istanbul'
```

This should result in RPC Listening on 127.0.0.1:8545

Also in a parallel console run (To deploy contracts):

```
npx hardhat run scripts/deploy.ts
```

Your contract should be deployed now!

---

## Backend

Setup (on local server):

```
cd backend
npm install
npm run serve
```

You should now see this: Express server running on port 4000

One more step! :)

---

## Web application

For this we will use metamask

You can import your generated wallet using a private key

Set Metamask network to localhost:8545 with chainID 1337 (ganache)

<span style="color:red">NOTE: You may need to reset your Metamask account if it throws errors

Setting -> Advanced -> Reset Account

More details on this error here: https://ethereum.stackexchange.com/questions/89879/error-ethjs-query-while-formatting-outputs-from-rpc-messageinvalid-sende
</span>

Setup:

```
cd app
npm install
```

Running:

```
npm run serve -- --port 3000
```

\- Now we have the app running in the browser
Metamask automatically asks to connect, but you can also do it manually later - just remember to set the network to **localhost:8545**

Building:

```
npm run build
```

---

## Other materials

### PCSC

PC - SmartCard access

WebUSB protocol not allowing smartcard access

WebAuthn has a similar implementation

### Openssl

```
openssl smime -in cades-t_sample.p7m -inform DER -verify -CAfile smartCardCert.pem -out cades-t_sample
openssl asn1parse -in cades-t_sample.p7m -inform der
openssl verify smartCardCert.cer
```

![Alt text](./1.png?raw=true "Title")
![Alt text](./2.png?raw=true "Title")
![Alt text](./3.png?raw=true "Title")
![Alt text](./4.png?raw=true "Title")
![Alt text](./5.png?raw=true "Title")
