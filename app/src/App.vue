<template>
  <div>
    <div id="cornflower" />
    <div id="cinnabar" />
    <div id="goldsand" />
    <TopNavbar />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import TopNavbar from "./components/TopNavbar.vue"

export default defineComponent({
  components: {
    TopNavbar
  },
  setup() {
    return {};
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #32302f;
}
#cornflower {
  background: radial-gradient(#7c55f440 10%, transparent 60%);
  width: max(75vw, 600px);
  height: max(65vw, 500px);
  top: calc(-10vw + 30px);
  left: 0;
  right: 0;
  margin: 0 auto;
  position: fixed;
  z-index: 0;
}
#cinnabar {
  background: radial-gradient(#e1393040 10%, transparent 60%);
  width: max(75vw, 600px);
  height: max(65vw, 500px);
  top: calc(-10vw + 550px);
  left: calc(-10vw - 80px);
  position: fixed;
  z-index: 0;
}
#goldsand {
  background: radial-gradient(#e9b78440 10%, transparent 60%);
  width: max(70vw, 650px);
  height: max(60vw, 550px);
  top: calc(-10vw + 320px);
  right: calc(-10vw - 80px);
  position: fixed;
  z-index: 0;
}
</style>
