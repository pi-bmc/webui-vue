<template>
  <h-menu-item v-slot="{ close }" as="li">
    <button type="button" class="dropdown-item" @click="onClick($event, close)">
      <slot />
    </button>
  </h-menu-item>
</template>

<script>
import { MenuItem as HMenuItem } from '@headlessui/vue';
import { DROPDOWN_KEY } from './groupKeys';

export default {
  name: 'BDropdownItemButton',
  components: { HMenuItem },
  inject: { dropdown: { from: DROPDOWN_KEY, default: null } },
  props: { variant: { type: String, default: '' } },
  emits: ['click'],
  methods: {
    onClick(event, close) {
      this.$emit('click', event);
      if (this.dropdown && this.dropdown.closeOnItemClick()) {
        close();
      }
    },
  },
};
</script>
