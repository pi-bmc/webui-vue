<template>
  <div class="form-group b-form-group">
    <label
      v-if="label || $slots.label"
      :for="labelFor || undefined"
      :class="['col-form-label', labelClass]"
    >
      <slot name="label">{{ label }}</slot>
    </label>
    <slot />
    <small v-if="description" class="form-text">{{ description }}</small>
    <div
      v-if="(invalidFeedback && state === false) || $slots['invalid-feedback']"
      class="invalid-feedback d-block"
    >
      <slot name="invalid-feedback">{{ invalidFeedback }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BFormGroup',
  props: {
    label: { type: String, default: '' },
    labelFor: { type: String, default: '' },
    labelClass: { type: [String, Array, Object], default: '' },
    description: { type: String, default: '' },
    invalidFeedback: { type: String, default: '' },
    state: { type: Boolean, default: null },
  },
};
</script>
