<template>
  <div class="invalid-feedback" :class="{ 'd-block': forceShow || state === false }">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BFormInvalidFeedback',
  props: {
    state: { type: Boolean, default: null },
    forceShow: { type: Boolean, default: false },
  },
};
</script>
