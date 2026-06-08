<template>
  <ul class="nav" :class="{ 'flex-column': vertical }"><slot /></ul>
</template>

<script>
export default {
  name: 'BNav',
  props: { vertical: { type: Boolean, default: false } },
};
</script>
