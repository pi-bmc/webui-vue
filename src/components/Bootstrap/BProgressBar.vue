<template>
  <div
    class="progress-bar"
    :class="variant ? `bg-${variant}` : null"
    role="progressbar"
    :style="{ width: percent + '%' }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BProgressBar',
  props: {
    value: { type: [Number, String], default: 0 },
    min: { type: [Number, String], default: 0 },
    max: { type: [Number, String], default: 100 },
    variant: { type: String, default: '' },
  },
  computed: {
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
