<template>
  <teleport to="body">
    <div
      class="toast-container position-fixed"
      style="inset-inline-end: 1rem; z-index: 1090"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="`b-toast-${toast.variant}`"
      >
        <div class="toast" :class="`bg-${toast.variant}`" role="alert">
          <div class="toast-header">
            <component :is="toast.titleRender" v-if="toast.titleRender" />
            <strong v-else class="toast-icon">{{ toast.title }}</strong>
            <button
              type="button"
              class="btn-close close ms-auto"
              aria-label="Close"
              @click="remove(toast.id)"
            ></button>
          </div>
          <div class="toast-body">{{ toast.body }}</div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import { toastState, toastController } from '@/plugins/toastController';

export default {
  name: 'AppToaster',
  computed: {
    toasts() {
      return toastState.toasts;
    },
  },
  methods: {
    remove(id) {
      toastController.remove(id);
    },
  },
};
</script>
