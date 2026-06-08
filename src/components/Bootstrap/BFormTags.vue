<template>
  <div class="b-form-tags form-control d-flex flex-wrap align-items-center gap-2">
    <span
      v-for="(tag, idx) in modelValue"
      :key="idx"
      class="badge bg-secondary d-inline-flex align-items-center gap-1"
      :class="{ 'rounded-pill': tagPills }"
    >
      {{ tag }}
      <button
        type="button"
        class="btn-close btn-close-white"
        :aria-label="`Remove ${tag}`"
        @click="removeTag(idx)"
      ></button>
    </span>
    <input
      :id="inputId"
      v-model="inputValue"
      type="text"
      class="border-0 flex-grow-1"
      style="outline: none; background: transparent"
      :placeholder="placeholder"
      v-bind="inputAttrs"
      @keydown.enter.prevent="addTag"
      @keydown.delete="onDelete"
      @blur="addTag"
    />
  </div>
</template>

<script>
export default {
  name: 'BFormTags',
  props: {
    modelValue: { type: Array, default: () => [] },
    separator: { type: String, default: ' ' },
    removeOnDelete: { type: Boolean, default: false },
    tagPills: { type: Boolean, default: false },
    inputId: { type: String, default: null },
    inputAttrs: { type: Object, default: () => ({}) },
    duplicateTagText: { type: String, default: 'Duplicate tag(s)' },
    placeholder: { type: String, default: '' },
    size: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  data() {
    return { inputValue: '' };
  },
  methods: {
    addTag() {
      const separators = this.separator.split('');
      const raw = this.inputValue;
      if (!raw) return;
      const parts = raw
        .split(new RegExp(`[${separators.map((s) => '\\' + s).join('')}]`))
        .map((p) => p.trim())
        .filter(Boolean);
      const next = this.modelValue.slice();
      for (const p of parts) {
        if (!next.includes(p)) next.push(p);
      }
      this.$emit('update:modelValue', next);
      this.inputValue = '';
    },
    removeTag(idx) {
      const next = this.modelValue.slice();
      next.splice(idx, 1);
      this.$emit('update:modelValue', next);
    },
    onDelete() {
      if (this.removeOnDelete && !this.inputValue && this.modelValue.length) {
        this.removeTag(this.modelValue.length - 1);
      }
    },
  },
};
</script>
