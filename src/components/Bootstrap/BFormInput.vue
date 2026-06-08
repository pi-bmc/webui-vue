<template>
  <input
    :value="modelValue"
    :type="type"
    :class="['form-control', stateClass]"
    @input="onInput"
    @change="onChange"
    @blur="$emit('blur', $event)"
  />
</template>

<script>
export default {
  name: 'BFormInput',
  props: {
    modelValue: { type: [String, Number], default: '' },
    type: { type: String, default: 'text' },
    state: { type: Boolean, default: null },
    number: { type: Boolean, default: false },
    trim: { type: Boolean, default: false },
    lazy: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'input', 'change', 'blur'],
  computed: {
    stateClass() {
      if (this.state === true) return 'is-valid';
      if (this.state === false) return 'is-invalid';
      return null;
    },
  },
  methods: {
    coerce(value) {
      if (this.trim && typeof value === 'string') value = value.trim();
      if (this.number) {
        const n = parseFloat(value);
        return isNaN(n) ? value : n;
      }
      return value;
    },
    onInput(event) {
      const value = this.coerce(event.target.value);
      if (!this.lazy) this.$emit('update:modelValue', value);
      this.$emit('input', value);
    },
    onChange(event) {
      const value = this.coerce(event.target.value);
      if (this.lazy) this.$emit('update:modelValue', value);
      this.$emit('change', value);
    },
  },
};
</script>
