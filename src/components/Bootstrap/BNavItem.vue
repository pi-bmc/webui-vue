<template>
  <li class="nav-item">
    <component
      :is="to ? 'router-link' : 'a'"
      class="nav-link"
      :to="to || undefined"
      :href="to ? undefined : href || '#'"
      :active-class="to ? 'active' : undefined"
    >
      <slot />
    </component>
  </li>
</template>

<script>
export default {
  name: 'BNavItem',
  props: {
    to: { type: [String, Object], default: null },
    href: { type: String, default: null },
  },
};
</script>
