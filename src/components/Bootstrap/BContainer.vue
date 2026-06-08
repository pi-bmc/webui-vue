<template>
  <div :class="classes"><slot /></div>
</template>

<script>
export default {
  name: 'BContainer',
  props: {
    fluid: { type: [Boolean, String], default: false },
  },
  computed: {
    classes() {
      if (this.fluid === true || this.fluid === '') return 'container-fluid';
      if (typeof this.fluid === 'string' && this.fluid)
        return `container-${this.fluid}`;
      return 'container';
    },
  },
};
</script>
