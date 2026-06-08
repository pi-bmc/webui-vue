<template>
  <component :is="tag" class="list-group"><slot /></component>
</template>

<script>
export default {
  name: 'BListGroup',
  props: { tag: { type: String, default: 'div' } },
};
</script>
