<template>
  <button
    type="button"
    class="btn-close"
    :disabled="disabled"
    :aria-label="ariaLabel"
    @click="$emit('click', $event)"
  ></button>
</template>

<script>
export default {
  name: 'BCloseButton',
  props: {
    disabled: { type: Boolean, default: false },
    ariaLabel: { type: String, default: 'Close' },
  },
  emits: ['click'],
};
</script>
