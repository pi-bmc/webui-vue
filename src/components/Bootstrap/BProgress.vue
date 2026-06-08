<template>
  <div class="progress" :style="heightStyle">
    <div
      v-if="value !== null"
      class="progress-bar"
      :class="variant ? `bg-${variant}` : null"
      role="progressbar"
      :style="{ width: percent + '%' }"
      :aria-valuenow="value"
      :aria-valuemin="min"
      :aria-valuemax="max"
    ></div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BProgress',
  props: {
    value: { type: [Number, String], default: null },
    min: { type: [Number, String], default: 0 },
    max: { type: [Number, String], default: 100 },
    height: { type: String, default: '' },
    variant: { type: String, default: '' },
  },
  computed: {
    heightStyle() {
      return this.height ? { height: this.height } : {};
    },
    percent() {
      const min = Number(this.min);
      const max = Number(this.max);
      const val = Number(this.value);
      if (max === min) return 0;
      return Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100));
    },
  },
};
</script>
