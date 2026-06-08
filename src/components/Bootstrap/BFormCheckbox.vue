<template>
  <!-- Switch variant: HeadlessUI Switch toggle -->
  <h-switch-group
    v-if="switchStyle"
    as="div"
    class="form-check form-switch hswitch-group"
  >
    <h-switch
      :id="inputId"
      :model-value="isChecked"
      :disabled="disabled"
      class="hswitch"
      :class="{ 'hswitch-on': isChecked }"
      @update:model-value="onSwitchChange"
    >
      <span class="hswitch-thumb" />
    </h-switch>
    <h-switch-label v-if="$slots.default" class="form-check-label hswitch-label">
      <slot />
    </h-switch-label>
  </h-switch-group>

  <!-- Checkbox variant -->
  <div v-else class="form-check">
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
import {
  Switch as HSwitch,
  SwitchGroup as HSwitchGroup,
  SwitchLabel as HSwitchLabel,
} from '@headlessui/vue';
import { CHECKBOX_GROUP_KEY, uid } from './groupKeys';

export default {
  name: 'BFormCheckbox',
  components: { HSwitch, HSwitchGroup, HSwitchLabel },
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
    onSwitchChange(value) {
      // HeadlessUI Switch emits a boolean; map to value/unchecked-value.
      const out = value ? this.trueValue : this.uncheckedValue;
      this.$emit('update:modelValue', out);
      this.$emit('change', out);
    },
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

<style lang="scss">
// HeadlessUI Switch styled as a Bootstrap-style toggle.
// Not scoped: Vue does not apply the scoped data-v attribute to the HeadlessUI
// Switch's rendered root element, so scoped selectors would not match it.
.hswitch-group {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding-inline-start: 0;
  min-height: auto;
}
.hswitch {
  position: relative;
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  width: 2.25rem;
  height: 1.25rem;
  padding: 0;
  border: 0;
  border-radius: 1rem;
  background-color: var(--bmc-border-strong, #b3b3b3);
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
  &:focus-visible {
    outline: 2px solid var(--color-primary, #2d60e5);
    outline-offset: 2px;
  }
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
}
.hswitch-on {
  background-color: var(--color-primary, #2d60e5);
}
.hswitch-thumb {
  display: block;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: #fff;
  transform: translateX(0.15rem);
  transition: transform 0.15s ease-in-out;
}
.hswitch-on .hswitch-thumb {
  transform: translateX(1.1rem);
}
.hswitch-label {
  cursor: pointer;
  margin-bottom: 0;
}
</style>
