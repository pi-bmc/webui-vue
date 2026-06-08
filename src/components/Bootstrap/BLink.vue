<template>
  <component
    :is="to ? 'router-link' : 'a'"
    :to="to || undefined"
    :href="to ? undefined : href || '#'"
  >
    <slot />
  </component>
</template>

<script>
export default {
  name: 'BLink',
  props: {
    to: { type: [String, Object], default: null },
    href: { type: String, default: null },
  },
};
</script>
