<template>
  <component
    :is="tag"
    :class="classes"
    :type="resolvedType"
    :to="to || undefined"
    :href="href || undefined"
    :disabled="resolvedDisabled"
    :aria-disabled="ariaDisabled"
  >
    <slot />
  </component>
</template>

<script>
export default {
  name: 'BButton',
  props: {
    variant: { type: String, default: 'secondary' },
    size: { type: String, default: '' },
    type: { type: String, default: 'button' },
    to: { type: [String, Object], default: null },
    href: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
    pill: { type: Boolean, default: false },
    squared: { type: Boolean, default: false },
    pressed: { type: Boolean, default: null },
  },
  computed: {
    tag() {
      if (this.to) return 'router-link';
      if (this.href) return 'a';
      return 'button';
    },
    resolvedType() {
      return this.tag === 'button' ? this.type : undefined;
    },
    resolvedDisabled() {
      return this.tag === 'button' ? this.disabled : undefined;
    },
    ariaDisabled() {
      return this.tag !== 'button' && this.disabled ? 'true' : undefined;
    },
    classes() {
      return [
        'btn',
        this.variant ? `btn-${this.variant}` : null,
        this.size ? `btn-${this.size}` : null,
        this.block ? 'd-block w-100' : null,
        this.pill ? 'rounded-pill' : null,
        this.disabled && this.tag !== 'button' ? 'disabled' : null,
        this.pressed === true ? 'active' : null,
      ];
    },
  },
};
</script>
