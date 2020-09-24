<template>
  <div class="notifications-container">
    <transition-group name="slide-fade">
      <div v-for="toast in toasts" :key="toast.id" style="width: 450px">
        <div
          class="d-flex justify-space-between align-center white--text rounded pl-5 pr-2 py-2 mb-1 elevation-4"
          :class="toast.type"
          style="max-height: 100px; overflow: hidden"
        >
          <span>
            {{ toast.message }}
          </span>

          <v-btn dark text @click="removeToast(toast.id)">
            {{ $t('close') }}
          </v-btn>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import useToast from '@/modules/useToast'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Toasts',
  setup() {
    const { toasts, removeToast } = useToast()
    return { toasts, removeToast }
  },
})
</script>

<style>
.notifications-container {
  position: fixed;
  top: 65px;
  right: 25px;
  z-index: 50;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: max-height 0.3s 0.1s ease-out, opacity 0.2s ease,
    transform 0.2s cubic-bezier(1, 0.5, 0.8, 1);
  max-height: 200px;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
  max-height: 0px;
}
</style>
