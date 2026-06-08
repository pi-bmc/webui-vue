<template>
  <span class="badge" :class="classes"><slot /></span>
</template>

<script>
export default {
  name: 'BBadge',
  props: {
    variant: { type: String, default: 'secondary' },
    pill: { type: Boolean, default: false },
  },
  computed: {
    classes() {
      return [
        this.variant ? `bg-${this.variant}` : null,
        this.pill ? 'rounded-pill' : null,
      ];
    },
  },
};
</script>
