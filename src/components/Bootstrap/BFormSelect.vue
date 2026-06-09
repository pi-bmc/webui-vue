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
        <!-- Optional leading option (e.g. a disabled placeholder). Registers
             itself with this Listbox so its label shows when selected. -->
        <slot name="first" />
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
      if (match) return match.text;
      // Nothing matched (e.g. placeholder value). The #first slot is only
      // mounted/registered while the dropdown is open, so fall back to its
      // rendered text to keep the placeholder label visible when closed.
      return this.firstSlotText;
    },
    firstSlotText() {
      const slot = this.$slots.first;
      if (!slot) return '';
      const text = (nodes) =>
        (nodes || [])
          .map((n) => {
            if (n == null || typeof n === 'boolean') return '';
            if (typeof n === 'string') return n;
            if (typeof n.children === 'string') return n.children;
            if (Array.isArray(n.children)) return text(n.children);
            // Component vnode (e.g. <b-form-select-option>): recurse into its
            // default slot to reach the label text.
            if (n.children && typeof n.children.default === 'function') {
              try {
                return text(n.children.default());
              } catch {
                return '';
              }
            }
            return '';
          })
          .join('');
      try {
        return text(slot()).trim();
      } catch {
        return '';
      }
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

<style lang="scss">
// Not scoped: HeadlessUI's Listbox renders its root (as="div") without Vue's
// scoped data-v attribute, so a scoped `.b-form-select` selector would not
// match — leaving the root `position: static` and the absolutely-positioned
// dropdown anchored to the page instead of the button. The class names below
// are specific to this component, so global scope is safe.
.b-form-select {
  position: relative;
  display: block;
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
  // Reserve one line so the button keeps a native <select>'s height even when
  // nothing is selected (empty text would otherwise collapse the button).
  min-height: 1.5em;
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
