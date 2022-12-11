<template>
  <div id="nav">
    <router-link to="/">
      <button>Home</button>
    </router-link>
    <button v-if="!signer" class="orange" @click="connectToMetamask">
      Connect to metamask
    </button>
    <div class="text-pill" v-else-if="walletAddres">{{ walletAddres.substring(0,5) + "..." + walletAddres.substring(walletAddres.length - 5) }}</div>
  </div>
</template>

<script lang="ts">
import { computed } from '@vue/runtime-core'
import { provider, signer, walletAddres, connectToMetamask } from '../controllers/ethersController'

export default {
  methods: {
    connectToMetamask,
  },
  setup() {
    return {
      provider,
      signer,
      walletAddres
    }
  }
}
</script>

<style>
#nav {
  height: 4rem;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  column-gap: 1rem;
}
</style>