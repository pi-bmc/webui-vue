<template>
  <button
    type="button"
    class="navbar-toggler"
    :aria-label="label"
    @click="$emit('click', $event)"
  >
    <slot><span class="navbar-toggler-icon"></span></slot>
  </button>
</template>

<script>
export default {
  name: 'BNavbarToggle',
  props: { label: { type: String, default: 'Toggle navigation' } },
  emits: ['click'],
};
</script>
