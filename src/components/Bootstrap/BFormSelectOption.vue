<template>
  <option :value="value" :disabled="disabled"><slot /></option>
</template>

<script>
export default {
  name: 'BFormSelectOption',
  props: {
    value: { type: [String, Number, Boolean, Object], default: null },
    disabled: { type: Boolean, default: false },
  },
};
</script>
