<template>
  <div
    v-show="active"
    class="tab-pane"
    role="tabpanel"
    :class="{ active }"
  >
    <slot v-if="!tabsApi || !tabsApi.lazy || hasShown" />
  </div>
</template>

<script>
import { TABS_KEY, uid } from './groupKeys';

export default {
  name: 'BTab',
  inject: {
    tabsApi: { from: TABS_KEY, default: null },
  },
  props: {
    title: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  },
  data() {
    return { uid: uid('tab'), hasShown: false };
  },
  computed: {
    active() {
      return this.tabsApi ? this.tabsApi.isActive(this.uid) : true;
    },
  },
  watch: {
    active(val) {
      if (val) this.hasShown = true;
    },
  },
  created() {
    if (this.tabsApi) {
      this.tabsApi.register({ uid: this.uid, title: this.title });
    }
    if (this.active) this.hasShown = true;
  },
  beforeUnmount() {
    if (this.tabsApi) this.tabsApi.unregister(this.uid);
  },
};
</script>
