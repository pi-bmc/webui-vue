<template>
  <div class="b-overlay-wrap position-relative">
    <slot />
    <div
      v-if="show"
      class="b-overlay position-absolute d-flex align-items-center justify-content-center"
      style="inset: 0; background: rgba(255, 255, 255, 0.85); z-index: 10"
    >
      <slot name="overlay">
        <b-spinner :variant="variant" />
      </slot>
    </div>
  </div>
</template>

<script>
import BSpinner from './BSpinner.vue';

export default {
  name: 'BOverlay',
  components: { BSpinner },
  props: {
    show: { type: Boolean, default: false },
    variant: { type: String, default: 'primary' },
  },
};
</script>
