<template>
  <li>
    <component
      :is="tag"
      class="dropdown-item"
      :to="to || undefined"
      :href="to ? undefined : href || '#'"
      @click="onClick"
    >
      <slot />
    </component>
  </li>
</template>

<script>
import { DROPDOWN_KEY } from './groupKeys';

export default {
  name: 'BDropdownItem',
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
    onClick(event) {
      this.$emit('click', event);
      // Navigation items always dismiss; otherwise honor autoClose.
      if (this.to || (this.dropdown && this.dropdown.closeOnItemClick())) {
        this.dropdown && this.dropdown.close();
      }
    },
  },
};
</script>
