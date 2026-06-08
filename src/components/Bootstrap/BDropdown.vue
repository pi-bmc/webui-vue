<template>
  <div ref="root" class="dropdown" :class="{ show: open }">
    <component
      :is="toggleTag"
      :class="toggleClasses"
      :aria-expanded="open ? 'true' : 'false'"
      :type="toggleTag === 'button' ? 'button' : undefined"
      @click="toggle"
    >
      <slot name="button-content">{{ text }}</slot>
      <span v-if="!noCaret" class="dropdown-caret" aria-hidden="true">▾</span>
    </component>
    <ul
      v-show="open"
      class="dropdown-menu"
      :class="{ show: open, 'dropdown-menu-end': right }"
    >
      <slot />
    </ul>
  </div>
</template>

<script>
import { DROPDOWN_KEY } from './groupKeys';

export default {
  name: 'BDropdown',
  provide() {
    const vm = this;
    return {
      [DROPDOWN_KEY]: {
        closeOnItemClick: () =>
          vm.autoClose === true || vm.autoClose === 'inside',
        close: () => vm.hide(),
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
    // true | false | 'inside' | 'outside'
    autoClose: { type: [Boolean, String], default: true },
  },
  emits: ['show', 'hide'],
  data() {
    return { open: false };
  },
  computed: {
    toggleTag() {
      return 'button';
    },
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
  beforeUnmount() {
    document.removeEventListener('click', this.onDocumentClick, true);
  },
  methods: {
    toggle() {
      this.open ? this.hide() : this.show();
    },
    show() {
      if (this.open) return;
      this.open = true;
      this.$emit('show');
      document.addEventListener('click', this.onDocumentClick, true);
    },
    hide() {
      if (!this.open) return;
      this.open = false;
      this.$emit('hide');
      document.removeEventListener('click', this.onDocumentClick, true);
    },
    onDocumentClick(event) {
      const root = this.$refs.root;
      if (!root) return;
      if (root.contains(event.target)) {
        // Click inside: only close when autoClose is true/'inside'
        return;
      }
      // Click outside: close unless autoClose is explicitly disabled
      if (this.autoClose !== false) this.hide();
    },
  },
};
</script>
