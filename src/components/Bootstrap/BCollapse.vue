<template>
  <component :is="tag" v-show="isOpen" :id="id" class="collapse-content">
    <slot />
  </component>
</template>

<script>
import { registerCollapse, unregisterCollapse } from './collapseRegistry';

export default {
  name: 'BCollapse',
  props: {
    id: { type: String, default: null },
    modelValue: { type: Boolean, default: undefined },
    visible: { type: Boolean, default: false },
    tag: { type: String, default: 'div' },
  },
  emits: ['update:modelValue', 'show', 'hidden'],
  data() {
    return { internalOpen: this.visible };
  },
  computed: {
    isOpen() {
      return this.modelValue !== undefined ? this.modelValue : this.internalOpen;
    },
  },
  mounted() {
    registerCollapse(this.id, {
      toggle: () => this.setOpen(!this.isOpen),
      show: () => this.setOpen(true),
      hide: () => this.setOpen(false),
    });
  },
  beforeUnmount() {
    unregisterCollapse(this.id);
  },
  methods: {
    setOpen(val) {
      if (this.modelValue !== undefined) {
        this.$emit('update:modelValue', val);
      } else {
        this.internalOpen = val;
      }
      this.$emit(val ? 'show' : 'hidden');
    },
  },
};
</script>
