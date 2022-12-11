import VueMetamask from "vue-metamask";
import { ethers } from "ethers";
import { ref, computed } from "vue";
import EthersSigner from "./EthersSigner";
import AgeZKP from "@/types/AgeZKP";
const contractsJson = require("../../contracts.json");

const provider = ref<ethers.providers.Web3Provider | null>(null);
const signer = ref<ethers.providers.JsonRpcSigner | null>(null);
const kycSigner = computed<EthersSigner | null>(() => {
  if (!signer.value) return null;
  return new EthersSigner(signer.value);
});
const walletAddres = ref<string | null>(null);

const connectToMetamask = async () => {
  try {
    // Get the provider and signer from the browser window
    provider.value = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    await provider.value.send("eth_requestAccounts", []);
    signer.value = await provider.value.getSigner();

    walletAddres.value = await signer.value.getAddress();
  } catch (err) {
    console.log("Metamask error.", err);
  }
};

const proveAge = async (ageZKP: AgeZKP, age: number) => {
  if (!kycSigner.value || !signer.value || !provider.value) return;

  const startingHashForAge = kycSigner.value.getStartingHashForAge(age);

  const contract = new ethers.Contract(
    contractsJson.address,
    contractsJson.abi,
    provider.value
  );

  const providerX = new ethers.providers.Web3Provider((window as any).ethereum);
  const signerX = await providerX.getSigner();

  let res = null;
  console.log(signerX.provider);
  res = await contract
    .connect(signerX)
    .VerifyOldEnoughAndKYC(
      startingHashForAge,
      ageZKP.hash,
      ageZKP.issuingYear,
      age,
      ageZKP.messageSignature
    );
  //   await signer.sendTransaction({
  //     to: "0x8F0fB9Aa5d99218747A9DF13e8BBB0e28DC75B42",
  //     value: ethers.utils.parseEther("3.0"),
  //   });
  console.log("good");
  return res;
};

export {
  provider,
  signer,
  kycSigner,
  walletAddres,
  connectToMetamask,
  proveAge,
};
