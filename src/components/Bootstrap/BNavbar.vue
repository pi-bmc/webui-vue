<template>
  <nav class="navbar" :class="[type ? `navbar-${type}` : null, variant ? `bg-${variant}` : null]">
    <slot />
  </nav>
</template>

<script>
export default {
  name: 'BNavbar',
  props: {
    type: { type: String, default: 'light' },
    variant: { type: String, default: '' },
  },
};
</script>
