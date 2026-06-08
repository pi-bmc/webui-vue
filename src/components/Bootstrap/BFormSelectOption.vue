<template>
  <h-listbox-option
    v-if="select && select.isListbox"
    v-slot="{ active, selected }"
    :value="value"
    :disabled="disabled"
    as="template"
  >
    <li
      class="dropdown-item listbox-option"
      :class="{ active, selected, disabled }"
    >
      <slot />
    </li>
  </h-listbox-option>
  <option v-else :value="value" :disabled="disabled"><slot /></option>
</template>

<script>
import { ListboxOption as HListboxOption } from '@headlessui/vue';
import { SELECT_KEY } from './groupKeys';

export default {
  name: 'BFormSelectOption',
  components: { HListboxOption },
  inject: { select: { from: SELECT_KEY, default: null } },
  props: {
    value: { type: [String, Number, Boolean, Object], default: null },
    disabled: { type: Boolean, default: false },
  },
  mounted() {
    // Register with the parent Listbox so it can resolve the selected label.
    if (this.select && this.select.isListbox) {
      const text = this.$el?.textContent?.trim() || '';
      this.select.register({ value: this.value, text, disabled: this.disabled });
    }
  },
  beforeUnmount() {
    if (this.select && this.select.isListbox) {
      this.select.unregister(this.value);
    }
  },
};
</script>
