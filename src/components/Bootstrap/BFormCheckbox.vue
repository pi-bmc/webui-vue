<template>
  <div class="form-check" :class="{ 'form-switch': switchStyle }">
    <input
      :id="inputId"
      ref="input"
      type="checkbox"
      class="form-check-input"
      :class="{ 'is-invalid': state === false }"
      :checked="isChecked"
      :disabled="disabled"
      @change="onChange"
    />
    <label v-if="$slots.default" class="form-check-label" :for="inputId">
      <slot />
    </label>
  </div>
</template>

<script>
import { CHECKBOX_GROUP_KEY, uid } from './groupKeys';

export default {
  name: 'BFormCheckbox',
  inject: {
    checkboxGroup: { from: CHECKBOX_GROUP_KEY, default: null },
  },
  props: {
    modelValue: {
      type: [Boolean, Array, String, Number, Object],
      default: undefined,
    },
    value: { type: [Boolean, String, Number, Object], default: undefined },
    uncheckedValue: { type: [Boolean, String, Number, Object], default: false },
    indeterminate: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    state: { type: Boolean, default: null },
    switch: { type: Boolean, default: false },
    id: { type: String, default: null },
  },
  emits: ['update:modelValue', 'change'],
  data() {
    return { generatedId: uid('checkbox') };
  },
  computed: {
    switchStyle() {
      return this.switch;
    },
    inputId() {
      return this.id || this.generatedId;
    },
    trueValue() {
      return this.value !== undefined ? this.value : true;
    },
    isChecked() {
      if (this.checkboxGroup) {
        return this.checkboxGroup.modelValue.includes(this.value);
      }
      if (Array.isArray(this.modelValue)) {
        return this.modelValue.includes(this.trueValue);
      }
      return this.modelValue === this.trueValue;
    },
  },
  watch: {
    indeterminate: {
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          if (this.$refs.input) this.$refs.input.indeterminate = val;
        });
      },
    },
  },
  methods: {
    onChange(event) {
      const checked = event.target.checked;
      if (this.checkboxGroup) {
        this.checkboxGroup.toggle(this.value, checked);
        this.$emit('change', checked);
        return;
      }
      if (Array.isArray(this.modelValue)) {
        const next = this.modelValue.slice();
        const idx = next.indexOf(this.trueValue);
        if (checked && idx === -1) next.push(this.trueValue);
        if (!checked && idx !== -1) next.splice(idx, 1);
        this.$emit('update:modelValue', next);
        this.$emit('change', next);
        return;
      }
      const value = checked ? this.trueValue : this.uncheckedValue;
      this.$emit('update:modelValue', value);
      this.$emit('change', value);
    },
  },
};
</script>
