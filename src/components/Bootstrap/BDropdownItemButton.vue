<template>
  <li>
    <button type="button" class="dropdown-item" @click="onClick">
      <slot />
    </button>
  </li>
</template>

<script>
import { DROPDOWN_KEY } from './groupKeys';

export default {
  name: 'BDropdownItemButton',
  inject: { dropdown: { from: DROPDOWN_KEY, default: null } },
  // `variant` accepted for API compatibility
  props: { variant: { type: String, default: '' } },
  emits: ['click'],
  methods: {
    onClick(event) {
      this.$emit('click', event);
      if (this.dropdown && this.dropdown.closeOnItemClick()) {
        this.dropdown.close();
      }
    },
  },
};
</script>
