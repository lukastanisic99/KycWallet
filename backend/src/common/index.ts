import { sha256 } from 'ethers/lib/utils';

const getPubkeyFromCard = require('./getPubkeyFromCard').default;
const saveCert = require('./saveCert').default;
const signFromCardString = require('./signFromCardString').default;
const EthersSigner = require('../EthersSigner').default;
const { addNewLines } = require('./helper');

const chalk = require('chalk');
const boxen = require('boxen');
const figlet = require('figlet');

const main = () => {
    const argv = process.argv.slice(2);

    // console.log(argv)

    const subcommand = argv[0];

    switch (subcommand) {
        case 'read-pubkey':
            handleReadPubkey();
            break;
        case 'save-cert':
            handleSaveCert();
            break;
        case 'generate-kyc-wallet':
            const seed: string | undefined = argv[1];
            if (!seed) errorGenerateKYCWallet();
            else handleGenerateKYCWallet(seed!);
            break;
        case 'sign-wallet':
            const address: string | undefined = argv[1];
            if (!address) errorSignWallet();
            else handleSignWallet(address!);
            break;
        case undefined:
        case '--help':
        default:
            nicePrint(helpText);
            break;
    }
};
const helpText = `
${chalk.white.bold('kycwallet 1.0.0')}

USAGE:
    kycwallet <SUBCOMMAND>

SUBCOMMANDS:
    read-pubkey                     Displays pubkey from smartcard
    save-cert                       Saves smartcard certificate to local storage
    sign-wallet <address>           Signs wallet address with smartcard
    generate-kyc-wallet <seed>      Generates KYC wallet with signed seed
`;
const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'green',
};
const nicePrint = (text) => {
    console.log(boxen(text, boxenOptions));
};

main();

function handleReadPubkey() {
    console.log(chalk.white.bold('Smartcard certificate public key:'));
    console.log(addNewLines(getPubkeyFromCard(), 64));
}

function handleSaveCert() {
    saveCert('cer');
    console.log(chalk.white.bold('Smartcard certificate saved as file: ') + 'smartCardCert.cer');
}

function errorSignWallet() {
    nicePrint(`
USAGE:
    kycwallet sign-wallet <address>

Signs wallet address with smartcard
    `);
}

function handleSignWallet(address: string) {
    console.log(chalk.white.bold('Wallet address:'));
    console.log(address);
    const filename = 'walletCert';
    const signedWalletAddress = signFromCardString(address, false, filename);
    console.log(chalk.white.bold('Signed wallet address:'));
    console.log(signedWalletAddress);
    console.log(chalk.white.bold('Signed wallet address file (signature): ') + filename);
    console.log(chalk.yellow.bold('You use this signature and your wallet address to submit for KYC compliance'));
}

function errorGenerateKYCWallet() {
    nicePrint(`
USAGE:
    kycwallet generate-kyc-wallet <seed>

Generates KYC wallet with signed seed
    `);
}

function handleGenerateKYCWallet(seed: string) {
    console.log(chalk.white.bold('Seed:'));
    console.log(seed);
    const signedSeed = signFromCardString(seed, true);
    console.log(chalk.white.bold('Signed seed:'));
    console.log(signedSeed);
    const wallet = EthersSigner.getWalletFromString(signedSeed);
    console.log(chalk.white.bold('Wallet private key (') + chalk.red.bold('DO NOT SHARE') + chalk.white.bold('):'));
    console.log(wallet.privateKey);
    console.log(chalk.white.bold('Wallet public key (address):'));
    console.log(wallet.address);
}
