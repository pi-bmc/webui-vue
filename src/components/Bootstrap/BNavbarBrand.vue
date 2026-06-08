<template>
  <component
    :is="to ? 'router-link' : 'a'"
    class="navbar-brand"
    :to="to || undefined"
    :href="to ? undefined : href || '#'"
  >
    <slot />
  </component>
</template>

<script>
export default {
  name: 'BNavbarBrand',
  props: {
    to: { type: [String, Object], default: null },
    href: { type: String, default: null },
  },
};
</script>
