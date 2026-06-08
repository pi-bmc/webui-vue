<template>
  <!-- HeadlessUI Menu handles open/close, keyboard nav (↑↓ Enter Esc Tab), and
       ARIA aria-expanded/aria-haspopup automatically. -->
  <h-menu v-slot="{ open }" as="div" class="dropdown">
    <h-menu-button
      as="button"
      :class="toggleClasses"
      :type="'button'"
      @click="open ? $emit('hide') : $emit('show')"
    >
      <slot name="button-content">{{ text }}</slot>
      <span v-if="!noCaret" class="dropdown-caret" aria-hidden="true"></span>
    </h-menu-button>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <h-menu-items
        as="ul"
        class="dropdown-menu"
        :class="{ 'dropdown-menu-end': right }"
      >
        <slot />
      </h-menu-items>
    </transition>
  </h-menu>
</template>

<script>
import { Menu as HMenu, MenuButton as HMenuButton, MenuItems as HMenuItems } from '@headlessui/vue';
import { DROPDOWN_KEY } from './groupKeys';

export default {
  name: 'BDropdown',
  components: { HMenu, HMenuButton, HMenuItems },
  provide() {
    return {
      [DROPDOWN_KEY]: {
        closeOnItemClick: () => this.autoClose === true || this.autoClose === 'inside',
        // HMenu handles close automatically; this is a no-op for programmatic use
        close: () => {},
      },
    };
  },
  props: {
    text: { type: String, default: '' },
    variant: { type: String, default: 'secondary' },
    size: { type: String, default: '' },
    right: { type: Boolean, default: false },
    noCaret: { type: Boolean, default: false },
    toggleClass: { type: [String, Array, Object], default: '' },
    autoClose: { type: [Boolean, String], default: true },
  },
  emits: ['show', 'hide'],
  computed: {
    toggleClasses() {
      return [
        'btn',
        this.variant ? `btn-${this.variant}` : null,
        this.size ? `btn-${this.size}` : null,
        'dropdown-toggle',
        this.toggleClass,
      ];
    },
  },
};
</script>
