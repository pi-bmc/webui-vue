<template>
  <div
    v-if="visible"
    class="alert"
    :class="[variant ? `alert-${variant}` : null, { 'alert-dismissible': dismissible }]"
    role="alert"
  >
    <slot />
    <button
      v-if="dismissible"
      type="button"
      class="btn-close"
      aria-label="Close"
      @click="dismiss"
    ></button>
  </div>
</template>

<script>
export default {
  name: 'BAlert',
  props: {
    // Boolean visibility, or a number of seconds for a self-dismissing alert.
    show: { type: [Boolean, Number], default: false },
    modelValue: { type: [Boolean, Number], default: undefined },
    variant: { type: String, default: 'info' },
    dismissible: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'dismissed'],
  computed: {
    visible() {
      if (this.modelValue !== undefined) return !!this.modelValue;
      return !!this.show;
    },
  },
  methods: {
    dismiss() {
      this.$emit('update:modelValue', false);
      this.$emit('dismissed');
    },
  },
};
</script>
