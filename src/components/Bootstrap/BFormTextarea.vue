<template>
  <textarea
    :value="modelValue"
    :rows="rows"
    :class="['form-control', stateClass]"
    @input="$emit('update:modelValue', $event.target.value)"
    @change="$emit('change', $event.target.value)"
  ></textarea>
</template>

<script>
export default {
  name: 'BFormTextarea',
  props: {
    modelValue: { type: [String, Number], default: '' },
    rows: { type: [String, Number], default: 3 },
    state: { type: Boolean, default: null },
  },
  emits: ['update:modelValue', 'change'],
  computed: {
    stateClass() {
      if (this.state === true) return 'is-valid';
      if (this.state === false) return 'is-invalid';
      return null;
    },
  },
};
</script>
