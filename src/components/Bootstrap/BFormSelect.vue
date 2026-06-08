<template>
  <select
    :class="['form-select', stateClass]"
    :value="modelValue"
    @change="onChange"
  >
    <option
      v-for="(opt, idx) in normalizedOptions"
      :key="idx"
      :value="opt.value"
      :disabled="opt.disabled"
    >
      {{ opt.text }}
    </option>
    <slot />
  </select>
</template>

<script>
export default {
  name: 'BFormSelect',
  props: {
    modelValue: { type: [String, Number, Boolean, Object, Array], default: null },
    options: { type: Array, default: () => [] },
    valueField: { type: String, default: 'value' },
    textField: { type: String, default: 'text' },
    disabledField: { type: String, default: 'disabled' },
    state: { type: Boolean, default: null },
  },
  emits: ['update:modelValue', 'change'],
  computed: {
    stateClass() {
      if (this.state === true) return 'is-valid';
      if (this.state === false) return 'is-invalid';
      return null;
    },
    normalizedOptions() {
      return this.options.map((opt) => {
        if (opt == null || typeof opt !== 'object') {
          return { value: opt, text: String(opt), disabled: false };
        }
        return {
          value: opt[this.valueField],
          text: opt[this.textField] ?? opt.label ?? '',
          disabled: !!opt[this.disabledField],
        };
      });
    },
  },
  methods: {
    onChange(event) {
      // Resolve the selected option's real value (preserves non-string values)
      const idx = event.target.selectedIndex;
      const opt = this.normalizedOptions[idx];
      const value = opt ? opt.value : event.target.value;
      this.$emit('update:modelValue', value);
      this.$emit('change', value);
    },
  },
};
</script>
