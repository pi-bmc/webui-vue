<template>
  <div class="input-group" :class="size ? `input-group-${size}` : null">
    <span v-if="prepend" class="input-group-text">{{ prepend }}</span>
    <slot name="prepend" />
    <slot />
    <span v-if="append" class="input-group-text">{{ append }}</span>
    <slot name="append" />
  </div>
</template>

<script>
export default {
  name: 'BInputGroup',
  props: {
    size: { type: String, default: '' },
    prepend: { type: String, default: '' },
    append: { type: String, default: '' },
  },
};
</script>
