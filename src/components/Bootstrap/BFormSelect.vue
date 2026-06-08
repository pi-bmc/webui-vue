<template>
  <h-listbox
    as="div"
    class="b-form-select"
    :model-value="modelValue"
    :disabled="disabled"
    @update:model-value="onChange"
  >
    <h-listbox-button
      :id="id"
      class="form-select listbox-button"
      :class="stateClass"
    >
      <span class="listbox-value">{{ selectedText }}</span>
    </h-listbox-button>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <h-listbox-options as="ul" class="dropdown-menu listbox-options">
        <h-listbox-option
          v-for="(opt, i) in propOptions"
          :key="i"
          v-slot="{ active, selected }"
          :value="opt.value"
          :disabled="opt.disabled"
          as="template"
        >
          <li
            class="dropdown-item listbox-option"
            :class="{ active, selected, disabled: opt.disabled }"
          >
            {{ opt.text }}
          </li>
        </h-listbox-option>
        <slot />
      </h-listbox-options>
    </transition>
  </h-listbox>
</template>

<script>
import {
  Listbox as HListbox,
  ListboxButton as HListboxButton,
  ListboxOptions as HListboxOptions,
  ListboxOption as HListboxOption,
} from '@headlessui/vue';
import { SELECT_KEY } from './groupKeys';

export default {
  name: 'BFormSelect',
  components: { HListbox, HListboxButton, HListboxOptions, HListboxOption },
  provide() {
    const vm = this;
    return {
      [SELECT_KEY]: {
        isListbox: true,
        register: (opt) => vm.registerOption(opt),
        unregister: (value) => vm.unregisterOption(value),
      },
    };
  },
  props: {
    modelValue: {
      type: [String, Number, Boolean, Object, Array],
      default: null,
    },
    options: { type: Array, default: () => [] },
    valueField: { type: String, default: 'value' },
    textField: { type: String, default: 'text' },
    disabledField: { type: String, default: 'disabled' },
    state: { type: Boolean, default: null },
    disabled: { type: Boolean, default: false },
    id: { type: String, default: null },
  },
  emits: ['update:modelValue', 'change'],
  data() {
    return { registeredOptions: [] };
  },
  computed: {
    stateClass() {
      if (this.state === true) return 'is-valid';
      if (this.state === false) return 'is-invalid';
      return null;
    },
    propOptions() {
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
    allOptions() {
      return [...this.propOptions, ...this.registeredOptions];
    },
    selectedText() {
      const match = this.allOptions.find(
        (o) => o.value === this.modelValue,
      );
      return match ? match.text : '';
    },
  },
  methods: {
    onChange(value) {
      this.$emit('update:modelValue', value);
      this.$emit('change', value);
    },
    registerOption(opt) {
      this.registeredOptions.push(opt);
    },
    unregisterOption(value) {
      this.registeredOptions = this.registeredOptions.filter(
        (o) => o.value !== value,
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.b-form-select {
  position: relative;
}
// The Listbox button replaces a native <select>; keep the select chrome but
// align text to the start and make room for the chevron.
.listbox-button {
  text-align: start;
  cursor: pointer;
  &:focus-visible {
    outline: none;
  }
}
.listbox-value {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.listbox-options {
  width: 100%;
  max-height: 16rem;
  overflow-y: auto;
  // dropdown-menu already provides surface/border + dark-mode styling
}
.listbox-option {
  cursor: pointer;
  &.active {
    background-color: var(--bmc-surface-2, #f4f4f4);
  }
  &.selected {
    font-weight: 600;
  }
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
