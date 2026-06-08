<template>
  <div class="tabs">
    <ul class="nav nav-tabs" role="tablist">
      <li
        v-for="(tab, i) in tabs"
        :key="tab.uid"
        class="nav-item"
        role="presentation"
      >
        <button
          type="button"
          class="nav-link"
          :class="[
            { active: i === activeIndex },
            i === activeIndex ? activeNavItemClass : navItemClass,
          ]"
          role="tab"
          :aria-selected="i === activeIndex ? 'true' : 'false'"
          @click="setIndex(i)"
        >
          {{ tab.title }}
        </button>
      </li>
    </ul>
    <div class="tab-content" :class="contentClass">
      <slot />
    </div>
  </div>
</template>

<script>
import { TABS_KEY } from './groupKeys';

export default {
  name: 'BTabs',
  provide() {
    const vm = this;
    return {
      [TABS_KEY]: {
        register: (tab) => vm.register(tab),
        unregister: (uid) => vm.unregister(uid),
        isActive: (uid) => vm.isActive(uid),
        get lazy() {
          return vm.lazy;
        },
      },
    };
  },
  props: {
    index: { type: Number, default: 0 },
    modelValue: { type: Number, default: undefined },
    lazy: { type: Boolean, default: false },
    activeNavItemClass: { type: [String, Array, Object], default: '' },
    navItemClass: { type: [String, Array, Object], default: '' },
    contentClass: { type: [String, Array, Object], default: '' },
  },
  emits: ['update:index', 'update:modelValue', 'activate-tab'],
  data() {
    return { tabs: [], internalIndex: this.index || this.modelValue || 0 };
  },
  computed: {
    activeIndex() {
      if (this.modelValue !== undefined) return this.modelValue;
      if (this.index !== undefined && this.index !== null) return this.index;
      return this.internalIndex;
    },
  },
  methods: {
    register(tab) {
      this.tabs.push(tab);
      return this.tabs.length - 1;
    },
    unregister(uid) {
      this.tabs = this.tabs.filter((t) => t.uid !== uid);
    },
    isActive(uid) {
      const idx = this.tabs.findIndex((t) => t.uid === uid);
      return idx === this.activeIndex;
    },
    setIndex(i) {
      this.internalIndex = i;
      this.$emit('update:index', i);
      this.$emit('update:modelValue', i);
      this.$emit('activate-tab', i);
    },
  },
};
</script>
