<template>
  <div class="card-group" :class="{ 'd-flex flex-column': deck }"><slot /></div>
</template>

<script>
export default {
  name: 'BCardGroup',
  props: { deck: { type: Boolean, default: false } },
};
</script>
