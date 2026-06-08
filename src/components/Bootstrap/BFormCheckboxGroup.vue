<template>
  <div class="b-form-checkbox-group" role="group">
    <b-form-checkbox
      v-for="(opt, idx) in normalizedOptions"
      :key="idx"
      :value="opt.value"
      :disabled="opt.disabled"
    >
      {{ opt.text }}
    </b-form-checkbox>
    <slot />
  </div>
</template>

<script>
import BFormCheckbox from './BFormCheckbox.vue';
import { CHECKBOX_GROUP_KEY } from './groupKeys';

export default {
  name: 'BFormCheckboxGroup',
  components: { BFormCheckbox },
  provide() {
    const vm = this;
    return {
      [CHECKBOX_GROUP_KEY]: {
        get modelValue() {
          return vm.currentModel;
        },
        toggle: (value, checked) => vm.toggle(value, checked),
      },
    };
  },
  props: {
    modelValue: { type: Array, default: () => [] },
    options: { type: Array, default: () => [] },
  },
  emits: ['update:modelValue', 'change'],
  computed: {
    currentModel() {
      return this.modelValue || [];
    },
    normalizedOptions() {
      return this.options.map((opt) =>
        opt != null && typeof opt === 'object'
          ? {
              value: opt.value,
              text: opt.text ?? opt.label,
              disabled: !!opt.disabled,
            }
          : { value: opt, text: String(opt), disabled: false },
      );
    },
  },
  methods: {
    toggle(value, checked) {
      const next = this.currentModel.slice();
      const idx = next.indexOf(value);
      if (checked && idx === -1) next.push(value);
      if (!checked && idx !== -1) next.splice(idx, 1);
      this.$emit('update:modelValue', next);
      this.$emit('change', next);
    },
  },
};
</script>
