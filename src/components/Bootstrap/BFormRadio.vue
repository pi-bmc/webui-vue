<template>
  <div class="form-check" :class="{ 'form-check-inline': inline }">
    <input
      :id="inputId"
      type="radio"
      class="form-check-input"
      :class="{ 'is-invalid': state === false }"
      :name="groupName"
      :value="value"
      :checked="isChecked"
      :disabled="disabled"
      @change="onChange"
    />
    <label v-if="$slots.default" class="form-check-label" :for="inputId">
      <slot />
    </label>
  </div>
</template>

<script>
import { RADIO_GROUP_KEY, uid } from './groupKeys';

export default {
  name: 'BFormRadio',
  inject: {
    radioGroup: { from: RADIO_GROUP_KEY, default: null },
  },
  props: {
    modelValue: { type: [Boolean, String, Number, Object], default: undefined },
    value: { type: [Boolean, String, Number, Object], default: undefined },
    name: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    inline: { type: Boolean, default: false },
    state: { type: Boolean, default: null },
    id: { type: String, default: null },
  },
  emits: ['update:modelValue', 'change'],
  data() {
    return { generatedId: uid('radio') };
  },
  computed: {
    inputId() {
      return this.id || this.generatedId;
    },
    groupName() {
      return this.radioGroup ? this.radioGroup.name : this.name;
    },
    selected() {
      return this.radioGroup ? this.radioGroup.modelValue : this.modelValue;
    },
    isChecked() {
      return this.selected === this.value;
    },
  },
  methods: {
    onChange() {
      if (this.radioGroup) {
        this.radioGroup.select(this.value);
      } else {
        this.$emit('update:modelValue', this.value);
      }
      this.$emit('change', this.value);
    },
  },
};
</script>
