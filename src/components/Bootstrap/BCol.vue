<template>
  <div :class="classes"><slot /></div>
</template>

<script>
export default {
  name: 'BCol',
  props: {
    col: { type: Boolean, default: false },
    cols: { type: [String, Number], default: null },
    sm: { type: [String, Number, Boolean], default: null },
    md: { type: [String, Number, Boolean], default: null },
    lg: { type: [String, Number, Boolean], default: null },
    xl: { type: [String, Number, Boolean], default: null },
    xxl: { type: [String, Number, Boolean], default: null },
    offset: { type: [String, Number], default: null },
    order: { type: [String, Number], default: null },
    alignSelf: { type: String, default: '' },
  },
  computed: {
    classes() {
      const classes = [];
      let hasWidth = false;

      if (this.cols != null) {
        classes.push(`col-${this.cols}`);
        hasWidth = true;
      }

      for (const bp of ['sm', 'md', 'lg', 'xl', 'xxl']) {
        const val = this[bp];
        if (val == null || val === false) continue;
        hasWidth = true;
        classes.push(val === true ? `col-${bp}` : `col-${bp}-${val}`);
      }

      if (!hasWidth || this.col) classes.push('col');

      if (this.offset != null) classes.push(`offset-${this.offset}`);
      if (this.order != null) classes.push(`order-${this.order}`);
      if (this.alignSelf) classes.push(`align-self-${this.alignSelf}`);

      return classes;
    },
  },
};
</script>
