<template>
  <div class="card" :class="variantClasses">
    <div v-if="header || $slots.header" class="card-header">
      <slot name="header">{{ header }}</slot>
    </div>
    <template v-if="noBody">
      <slot />
    </template>
    <div v-else class="card-body">
      <component :is="titleTag" v-if="title" class="card-title">
        {{ title }}
      </component>
      <slot />
    </div>
    <div v-if="footer || $slots.footer" class="card-footer">
      <slot name="footer">{{ footer }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BCard',
  props: {
    noBody: { type: Boolean, default: false },
    title: { type: String, default: '' },
    titleTag: { type: String, default: 'h4' },
    header: { type: String, default: '' },
    footer: { type: String, default: '' },
    bgVariant: { type: String, default: '' },
    borderVariant: { type: String, default: '' },
    textVariant: { type: String, default: '' },
  },
  computed: {
    variantClasses() {
      return [
        this.bgVariant ? `bg-${this.bgVariant}` : null,
        this.borderVariant ? `border-${this.borderVariant}` : null,
        this.textVariant ? `text-${this.textVariant}` : null,
      ];
    },
  },
};
</script>
