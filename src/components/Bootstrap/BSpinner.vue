<template>
  <span
    class="spinner-border"
    :class="[small ? 'spinner-border-sm' : null, variant ? `text-${variant}` : null]"
    role="status"
  >
    <span class="visually-hidden">{{ label }}</span>
  </span>
</template>

<script>
export default {
  name: 'BSpinner',
  props: {
    small: { type: Boolean, default: false },
    variant: { type: String, default: '' },
    label: { type: String, default: 'Loading...' },
  },
};
</script>
