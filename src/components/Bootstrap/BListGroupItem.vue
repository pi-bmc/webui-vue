<template>
  <component
    :is="tag"
    class="list-group-item"
    :class="{ 'list-group-item-action': action }"
    :to="to || undefined"
  >
    <slot />
  </component>
</template>

<script>
export default {
  name: 'BListGroupItem',
  props: {
    to: { type: [String, Object], default: null },
    action: { type: Boolean, default: false },
  },
  computed: {
    tag() {
      return this.to ? 'router-link' : 'div';
    },
  },
};
</script>
