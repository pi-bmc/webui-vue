<template>
  <div
    class="b-form-radio-group"
    :class="{ 'd-flex flex-column': stacked }"
    role="radiogroup"
  >
    <b-form-radio
      v-for="(opt, idx) in normalizedOptions"
      :key="idx"
      :value="opt.value"
      :disabled="opt.disabled"
    >
      {{ opt.text }}
    </b-form-radio>
    <slot />
  </div>
</template>

<script>
import BFormRadio from './BFormRadio.vue';
import { RADIO_GROUP_KEY, uid } from './groupKeys';

export default {
  name: 'BFormRadioGroup',
  components: { BFormRadio },
  provide() {
    const vm = this;
    return {
      [RADIO_GROUP_KEY]: {
        name: this.name || uid('radio-group'),
        get modelValue() {
          return vm.modelValue;
        },
        select: (value) => vm.select(value),
      },
    };
  },
  props: {
    modelValue: { type: [Boolean, String, Number, Object], default: null },
    options: { type: Array, default: () => [] },
    name: { type: String, default: null },
    stacked: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'change'],
  computed: {
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
    select(value) {
      this.$emit('update:modelValue', value);
      this.$emit('change', value);
    },
  },
};
</script>
