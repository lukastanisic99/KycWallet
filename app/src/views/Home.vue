<template>
  <div class="home">
    <Modal :modalActive="modalActive" @close="() => (modalActive = false)">
      <h3>Choose age to prove</h3>
      <p class="inputLabel">Age:</p>
      <input type="number" v-model="ageToProve" style="margin-bottom: 1rem" />
      <div
        class="btn"
        style="margin-right: 1rem"
        @click="
          () => {
            modalActive = false;
          }
        "
      >
        Close
      </div>
      <div
        class="btn green"
        @click="
          () => {
            modalActive = false;
            handleProve();
          }
        "
      >
        Confirm
      </div>
    </Modal>
    <div class="formWrapper">
      <form @submit.prevent="handleSubmit">
        <h2>Authorize wallet for KYC</h2>
        <hr />
        <p>
          Governing body (Issuer) will add your wallet entry to the database and
          compute your age ZK proof - which you can use to prove your age is
          above
          <b>N</b> without revealing your information or even your concrete age!
        </p>
        <hr />
        <!-- <div class="flex-row">
          <p class="inputLabel">Wallet address:</p>
          <p
            v-if="signer !== null"
            style="
              text-decoration: underline;
              margin-left: auto;
              cursor: pointer;
            "
            class="inputLabel"
            @click="setFromSigner"
          >
            get from metamask
          </p>
        </div>
        <input type="text" v-model="address" /> -->
        <p class="inputLabel">Wallet signature file:</p>
        <label class="custom-file-upload">
          <span style="text-decoration: underline" v-if="!file"
            >Select your signature file (probably walletCert)</span
          >
          <span v-else>{{ file.name }}</span>
          <input type="file" accept="*" @change="handleChange" />
        </label>
        <div v-if="fileError">
          <p class="error">
            {{ fileError }}
          </p>
        </div>
        <hr />
        <button>Authorize</button>
        <div v-if="error">
          <hr />
          <p class="error">
            {{ error }}
          </p>
        </div>
      </form>
    </div>
    <div v-if="ageZKP" class="formWrapper">
      <form @submit.prevent="() => (modalActive = true)">
        <h2>ZK Proof</h2>
        <hr />
        <p style="color: rgb(230, 125, 45)">
          Try tampering with the proof to see the effect
        </p>
        <hr />
        <div class="flex-row">
          <div class="w-100">
            <p class="inputLabel">Age:</p>
            <input type="text" v-model="ageZKP.age" />
          </div>
          <div class="w-100">
            <p class="inputLabel">Proof issuing year:</p>
            <input type="text" v-model="ageZKP.issuingYear" />
          </div>
        </div>
        <p class="inputLabel">Hash:</p>
        <input type="text" v-model="ageZKP.hash" />
        <p class="inputLabel">Message signature:</p>
        <input type="text" v-model="ageZKP.messageSignature" />
        <p class="inputLabel">Secret:</p>
        <input type="text" v-model="ageZKP.secret" />
        <p class="inputLabel">Wallet address:</p>
        <input type="text" v-model="ageZKP.walletAddress" />
        <hr />
        <button>Prove</button>
        <hr v-if="proofResult" />
        <p v-if="proofResult === 'good'" style="color: green">
          Proof successfull
        </p>
        <p v-if="proofResult === 'bad'" style="color: red">Proof failed</p>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import EthersSigner from '../controllers/EthersSigner';
import { defineComponent, onMounted, Ref, ref, watch } from 'vue';
import { provider, signer, kycSigner, walletAddres, connectToMetamask, proveAge } from '../controllers/ethersController'
import AgeZKP from '../types/AgeZKP';
import Modal from '../components/Modal.vue';

export default defineComponent({
  name: 'Home',
  components: {
    Modal
  },
  setup() {

    const error: Ref<string | null> = ref(null);
    // const address = ref('');
    const signedAddress = ref('');

    const file = ref<File | null>(null);
    const localFileUrl = ref<string | null>(null);
    const fileError = ref<string | null>(null);

    const toBase64 = (file: File) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    const handleChange = (e: Event) => {
      if (!e || !e.target) return;
      const selected = (e.target as HTMLInputElement).files![0]
      if (selected) {
        file.value = selected;
        fileError.value = null;
        localFileUrl.value = URL.createObjectURL(file.value);
      } else {
        file.value = null;
        fileError.value = "File error, try again";
      }
    };

    const handleSubmit = async () => {
      error.value = null;
      // if (address.value === '') {
      //   error.value = "Please enter your wallet address.";
      //   return;
      // }
      if (!file.value) {
        error.value = "Please choose your signature file (probably walletCert).";
        return;
      }
      console.log("ok")
      const cardSignature = (await toBase64(file.value) as string).split(',')[1];

      // console.log({
      //   cardSignature,
      //   walletAddress: address.value
      // })
      if (!kycSigner.value) return;

      ageZKP.value = await kycSigner.value.doKYC(cardSignature)
    }

    const ageZKP = ref<AgeZKP | null>();
    const ageToProve = ref<number>(18);
    const proofResult = ref<'good' | 'bad' | null>(null);

    // const setFromSigner = async () => {
    //   if (walletAddres.value && address.value === '')
    //     address.value = walletAddres.value
    // }

    // watch(walletAddres, setFromSigner)
    onMounted(() => {
      connectToMetamask()
    })

    const modalActive = ref<boolean>(false)

    const handleProve = async () => {
      proofResult.value = null;
      if (!ageZKP.value) return;

      try {
        await proveAge(ageZKP.value!, ageToProve.value)

        proofResult.value = "good"
      } catch (error) {
        console.log("ERROR CATCHED:",error);
        proofResult.value = "bad"
      }


    }

    return {
      handleSubmit,
      error,
      // address,
      handleChange,
      file,
      fileError,
      localFileUrl,
      provider,
      signer,
      connectToMetamask,
      // setFromSigner,
      ageZKP,
      handleProve,
      modalActive,
      ageToProve,
      proofResult
    }
  }
});
</script>

<style>
.home {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 4rem);
}
.formWrapper {
  max-width: 100%;
  width: 30rem;
  margin: 1rem;
  margin-top: 0;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 1px 2px 3px rgba(50, 50, 50, 0.05);
  border: 1px solid var(--secondary);
  background: white;
  z-index: 1;
}
.formWrapper {
  margin-bottom: 10%;
}
.custom-file-upload {
  border-radius: 0.5rem;
  border: 1px solid var(--secondary);
  padding: 0.2rem 0.4rem;
  outline: none;
  display: block;
  width: 100%;
  box-sizing: border-box;
  font-size: 1rem;
  cursor: pointer;
  text-align: left;
}
</style>