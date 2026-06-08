<template>
  <input
    type="file"
    class="form-control"
    :accept="accept || undefined"
    :disabled="disabled"
    :multiple="multiple"
    @change="onChange"
  />
</template>

<script>
export default {
  name: 'BFormFile',
  props: {
    modelValue: { type: [File, Object, Array, null], default: null },
    accept: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    state: { type: Boolean, default: null },
    // `plain` is accepted for API compatibility; this control is always native.
    plain: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'change', 'input'],
  methods: {
    onChange(event) {
      this.$emit('change', event);
      const files = event.target.files;
      const value = this.multiple
        ? Array.from(files || [])
        : files && files.length
          ? files[0]
          : null;
      this.$emit('update:modelValue', value);
      this.$emit('input', value);
    },
  },
};
</script>
