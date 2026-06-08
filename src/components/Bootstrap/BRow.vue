<template>
  <div class="row" :class="classes"><slot /></div>
</template>

<script>
export default {
  name: 'BRow',
  props: {
    alignH: { type: String, default: '' },
    alignV: { type: String, default: '' },
    cols: { type: [String, Number], default: null },
  },
  computed: {
    classes() {
      return [
        this.alignH ? `justify-content-${this.alignH}` : null,
        this.alignV ? `align-items-${this.alignV}` : null,
        this.cols ? `row-cols-${this.cols}` : null,
      ];
    },
  },
};
</script>
