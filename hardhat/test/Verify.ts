import { ethers } from "hardhat";
import hre from "hardhat";
import chai from "chai";
import EthersSigner from "../../backend/src/EthersSigner";

describe("SigTest", () => {
  beforeEach(async () => {});

  describe("test", async () => {
    it("test basic signing from client", async () => {
      // Get eth signers
      const signers = await ethers.getSigners();
      // prepare the contract for deployment
      const counterFactory = await ethers.getContractFactory(
        "SigTest",
        signers[0]
      );

      // DEPLOY
      const sigTest = await counterFactory.deploy(signers[0].address);
      await sigTest.deployed();

      const [adminWallet, userWallet] = await ethers.getSigners();
      console.log("Admin:", adminWallet.address);
      const timestamp = Date.now();

      let wallet = EthersSigner.getWalletFromString("a");
      let governmentWallet = EthersSigner.getWalletFromString("Government");
      let adr = wallet.address;
      let year = 2000;

      // STEP 1:
      // building hash has to come from system address
      // 32 bytes of data
      let messageHash = ethers.utils.solidityKeccak256(
        ["address", "uint16"],
        [adr, year]
      );

      // STEP 2: 32 bytes of data in Uint8Array
      let messageHashBinary = ethers.utils.arrayify(messageHash);

      // STEP 3: To sign the 32 bytes of data, make sure you pass in the data
      let signature = await governmentWallet.signMessage(messageHashBinary);
      console.log(signature);
      // STEP 4: Fire off the transaction with the adminWallet signed data
      await sigTest.connect(userWallet).isDataValid(adr, year, signature);
      let secret = "THIS IS A SECRET";
      let hash = ethers.utils.solidityKeccak256(["string"], [secret]);
      hash = ethers.utils.solidityKeccak256(["bytes"], [hash]);
      await sigTest.compareHash(hash, secret);

      let secret2 = "ABCD";
      let age = 18;
      let ageToProve = 18;
      hash = ethers.utils.solidityKeccak256(["string"], [secret2]);
      let startingHash;
      for (let i = 0; i < age; i++) {
        if (age - ageToProve == i) startingHash = hash;
        hash = ethers.utils.solidityKeccak256(["bytes"], [hash]);
      }

      await sigTest.VerifyOldEnough(
        startingHash as string,
        hash,
        999,
        ageToProve,
        signature
      );
    });

    it("KYC and ZK", async () => {
      // Get eth signers
      const signers = await ethers.getSigners();

      // prepare the contract for deployment
      const counterFactory = await ethers.getContractFactory(
        "SigTest",
        signers[0]
      );

      // DEPLOY
      const sigTest = await counterFactory.deploy(signers[0].address);
      await sigTest.deployed();

      let wallet = EthersSigner.getWalletFromString("a", signers[0].provider);
      await signers[0].sendTransaction({
        to: wallet.address,
        value: ethers.utils.parseEther("10.0"),
      });

      let walletWrapper = new EthersSigner(wallet);
      // await walletWrapper.doKYC();
      // let cer = walletWrapper.getCertificate();
      // let yearsToProve = 18;
      // await sigTest
      //   .connect(walletWrapper)
      //   .VerifyOldEnoughAndKYC(
      //     walletWrapper.getStartingHashForAge(yearsToProve),
      //     cer.hash,
      //     cer.issuingYear,
      //     yearsToProve,
      //     cer.messageSignature
      //   );
    });
  });
});
