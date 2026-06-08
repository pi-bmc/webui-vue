<template>
  <h-menu-item v-slot="{ close }" as="li">
    <component
      :is="tag"
      class="dropdown-item"
      :to="to || undefined"
      :href="to ? undefined : href || '#'"
      @click="onClick($event, close)"
    >
      <slot />
    </component>
  </h-menu-item>
</template>

<script>
import { MenuItem as HMenuItem } from '@headlessui/vue';
import { DROPDOWN_KEY } from './groupKeys';

export default {
  name: 'BDropdownItem',
  components: { HMenuItem },
  inject: { dropdown: { from: DROPDOWN_KEY, default: null } },
  props: {
    to: { type: [String, Object], default: null },
    href: { type: String, default: null },
  },
  emits: ['click'],
  computed: {
    tag() {
      return this.to ? 'router-link' : 'a';
    },
  },
  methods: {
    onClick(event, close) {
      this.$emit('click', event);
      // HMenu closes on item click automatically via HMenuItem;
      // call close() explicitly only when autoClose logic requires it.
      if (this.to || (this.dropdown && this.dropdown.closeOnItemClick())) {
        close();
      }
    },
  },
};
</script>
