<template>
  <transition name="my-modal-animation">
    <div class="my-modal" v-show="modalActive">
      <transition name="my-modal-animation-inner">
        <div class="my-modal-inner" v-show="modalActive">
          <i class="nav-icon bi bi-x-lg icon-button" @click="close"></i>
          <!-- Modal Content -->
          <slot />
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, PropType, ref, watch } from 'vue'

export default defineComponent({
  props: {
    modalActive: {
      required: true,
      type: Boolean
    }
  },
  setup(props, { emit }) {
    watch(props, () => {
      const body = document.getElementsByTagName('body')[0];
      if (props.modalActive) body?.classList.add('disabled-scrolling')
      else body?.classList.remove('disabled-scrolling');
    })
    
    const close = () => {
      emit('close')
    };

    return {
      close
    }
  }
})
</script>

<style>
.my-modal-content {
  display: flex;
  flex-direction: column;
}
.my-modal-content h2,
.my-modal-content p {
  margin-bottom: 1.4rem
}
.my-modal {
  text-align: start;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 1021; /* ili 99 */
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
}
.my-modal-inner {
  position: relative;
  width: 35rem;
  max-width: 80%;
  box-shadow: 1px 2px 3px rgba(50, 50, 50, 0.05);
  padding: 1.5rem;
  border-radius: 1rem;
  background: #fff;
  margin-bottom: 20vh;
  box-sizing: border-box;
}
.my-modal-inner .icon-button {
  position: absolute;
  top: 1.4rem;
  right: 1.4rem;
  cursor: pointer;
  z-index: 2;
  font-size: 1.4rem;
}
.my-modal-inner .icon-button:hover {
  color: crimson;
}

.my-modal-animation-enter-active,
.my-modal-animation-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.my-modal-animation-enter-from,
.my-modal-animation-leave-to {
  opacity: 0;
}
.my-modal-animation-enter-to,
.my-modal-animation-leave-from {
  opacity: 1;
}

.my-modal-animation-inner-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}
.my-modal-animation-inner-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.my-modal-animation-inner-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
.my-modal-animation-inner-leave-to {
  transform: scale(0.8);
}
</style>
