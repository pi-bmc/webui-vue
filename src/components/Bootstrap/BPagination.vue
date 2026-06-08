<template>
  <ul v-if="totalPages > 1" class="pagination">
    <li class="page-item" :class="{ disabled: currentPage <= 1 }">
      <button
        type="button"
        class="page-link"
        :aria-label="'Previous'"
        @click="goTo(currentPage - 1)"
      >
        &lsaquo;
      </button>
    </li>
    <li
      v-for="page in visiblePages"
      :key="page"
      class="page-item"
      :class="{ active: page === currentPage }"
    >
      <button type="button" class="page-link" @click="goTo(page)">
        {{ page }}
      </button>
    </li>
    <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
      <button
        type="button"
        class="page-link"
        :aria-label="'Next'"
        @click="goTo(currentPage + 1)"
      >
        &rsaquo;
      </button>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'BPagination',
  props: {
    modelValue: { type: Number, default: 1 },
    perPage: { type: [Number, String], default: 20 },
    totalRows: { type: [Number, String], default: 0 },
    firstNumber: { type: Boolean, default: false },
    lastNumber: { type: Boolean, default: false },
    limit: { type: Number, default: 7 },
  },
  emits: ['update:modelValue', 'page-click'],
  computed: {
    currentPage() {
      return this.modelValue || 1;
    },
    totalPages() {
      const per = Number(this.perPage);
      if (!per) return 1;
      return Math.max(1, Math.ceil(Number(this.totalRows) / per));
    },
    visiblePages() {
      const total = this.totalPages;
      const limit = this.limit;
      if (total <= limit) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }
      const half = Math.floor(limit / 2);
      let start = Math.max(1, this.currentPage - half);
      let end = Math.min(total, start + limit - 1);
      start = Math.max(1, end - limit + 1);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    },
  },
  methods: {
    goTo(page) {
      if (page < 1 || page > this.totalPages || page === this.currentPage)
        return;
      this.$emit('update:modelValue', page);
      this.$emit('page-click', page);
    },
  },
};
</script>
