<template>
  <div :class="responsiveClass" :style="stickyStyle">
    <table
      class="table"
      :class="[
        { 'table-hover': hover, 'table-sm': small, 'b-table-stacked': stacked },
      ]"
    >
      <thead :class="theadClass">
        <tr>
          <th
            v-for="field in normalizedFields"
            :key="field.key"
            :class="[
              field.thClass,
              field.class,
              { 'cursor-pointer': field.sortable },
            ]"
            :aria-sort="ariaSort(field)"
            scope="col"
            @click="field.sortable && onSort(field)"
          >
            <span
              class="d-inline-flex align-items-center"
              :class="{ 'flex-row-reverse': sortIconLeft }"
            >
              <slot :name="`head(${field.key})`" :label="field.label" :field="field">
                {{ field.label }}
              </slot>
              <span
                v-if="field.sortable"
                class="b-sort-icon"
                aria-hidden="true"
              >
                {{ sortIcon(field) }}
              </span>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Busy state -->
        <tr v-if="busy" class="b-table-busy-row">
          <td :colspan="normalizedFields.length" class="text-center">
            <slot name="table-busy">
              <b-spinner small /> <span>{{ emptyText }}</span>
            </slot>
          </td>
        </tr>

        <!-- Rows -->
        <template v-for="(item, localIndex) in displayedItems" :key="localIndex">
          <tr
            :class="[
              { 'b-table-row-selected': isRowSelected(globalIndex(localIndex)) },
            ]"
            @click="onRowClick(item, globalIndex(localIndex), $event)"
          >
            <td
              v-for="field in normalizedFields"
              :key="field.key"
              :class="[field.tdClass, field.class]"
              :data-label="stacked ? field.label : undefined"
            >
              <slot
                :name="`cell(${field.key})`"
                :item="item"
                :index="globalIndex(localIndex)"
                :value="cellValue(item, field)"
                :field="field"
                :row-selected="isRowSelected(globalIndex(localIndex))"
                :toggle-details="() => toggleDetails(item)"
                :details-showing="!!item._showDetails"
              >
                {{ cellValue(item, field) }}
              </slot>
            </td>
          </tr>
          <!-- Row details -->
          <tr v-if="item._showDetails && $slots['row-details']" class="b-table-details-row">
            <td :colspan="normalizedFields.length">
              <slot
                name="row-details"
                :item="item"
                :index="globalIndex(localIndex)"
                :toggle-details="() => toggleDetails(item)"
              />
            </td>
          </tr>
        </template>

        <!-- Empty state -->
        <tr
          v-if="!busy && showEmpty && displayedItems.length === 0"
          class="b-table-empty-row"
        >
          <td :colspan="normalizedFields.length" class="text-center">
            <slot v-if="isFiltered" name="emptyfiltered">
              {{ emptyFilteredText }}
            </slot>
            <slot v-else name="empty">
              {{ emptyText }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import BSpinner from './BSpinner.vue';

export default {
  name: 'BTable',
  components: { BSpinner },
  props: {
    items: { type: Array, default: () => [] },
    fields: { type: Array, default: null },
    busy: { type: Boolean, default: false },
    showEmpty: { type: Boolean, default: false },
    emptyText: { type: String, default: 'There are no records to show' },
    emptyFilteredText: {
      type: String,
      default: 'There are no records matching your request',
    },
    selectable: { type: Boolean, default: false },
    noSelectOnClick: { type: Boolean, default: false },
    selectMode: { type: String, default: 'multi' },
    sortIconLeft: { type: Boolean, default: false },
    mustSort: { type: Boolean, default: false },
    sortBy: { type: [String, Array], default: null },
    sortDesc: { type: [Boolean, Array], default: false },
    responsive: { type: [Boolean, String], default: false },
    theadClass: { type: [String, Array, Object], default: '' },
    stickyHeader: { type: [Boolean, String], default: false },
    perPage: { type: [Number, String], default: 0 },
    currentPage: { type: [Number, String], default: 1 },
    filter: { type: String, default: '' },
    stacked: { type: [Boolean, String], default: false },
    hover: { type: Boolean, default: false },
    small: { type: Boolean, default: false },
  },
  emits: [
    'row-selected',
    'filtered',
    'sort-changed',
    'row-clicked',
    'head-clicked',
  ],
  data() {
    return {
      internalSortBy: this.normalizeSortBy(this.sortBy),
      internalSortDesc: this.normalizeSortDesc(this.sortDesc),
      selectedIndices: new Set(),
    };
  },
  computed: {
    responsiveClass() {
      if (!this.responsive) return null;
      return typeof this.responsive === 'string'
        ? `table-responsive-${this.responsive}`
        : 'table-responsive';
    },
    stickyStyle() {
      if (!this.stickyHeader) return null;
      const max =
        typeof this.stickyHeader === 'string' ? this.stickyHeader : '300px';
      return { overflowY: 'auto', maxHeight: max };
    },
    normalizedFields() {
      const raw =
        this.fields ||
        (this.items.length
          ? Object.keys(this.items[0])
              .filter((k) => !k.startsWith('_'))
              .map((k) => ({ key: k }))
          : []);
      return raw.map((f) => {
        const field = typeof f === 'string' ? { key: f } : { ...f };
        return {
          key: field.key,
          label:
            field.label != null ? field.label : this.humanize(field.key),
          sortable: !!field.sortable,
          formatter: field.formatter,
          tdClass: field.tdClass,
          thClass: field.thClass,
          class: field.class,
        };
      });
    },
    sortedFilteredItems() {
      let result = this.items.slice();

      // Filter
      if (this.filter) {
        const needle = String(this.filter).toLowerCase();
        result = result.filter((item) =>
          this.normalizedFields.some((field) => {
            const v = this.cellValue(item, field);
            return v != null && String(v).toLowerCase().includes(needle);
          }),
        );
      }

      // Sort
      if (this.internalSortBy) {
        const key = this.internalSortBy;
        const dir = this.internalSortDesc ? -1 : 1;
        const field = this.normalizedFields.find((f) => f.key === key);
        result.sort((a, b) => {
          const av = field ? this.cellValue(a, field) : a[key];
          const bv = field ? this.cellValue(b, field) : b[key];
          if (av == null) return 1;
          if (bv == null) return -1;
          if (av < bv) return -1 * dir;
          if (av > bv) return 1 * dir;
          return 0;
        });
      }

      return result;
    },
    // Public alias the selectable mixin reads via $refs.table.filteredItems
    filteredItems() {
      return this.sortedFilteredItems;
    },
    isFiltered() {
      return !!this.filter;
    },
    displayedItems() {
      const per = Number(this.perPage);
      if (!per) return this.sortedFilteredItems;
      const start = (Number(this.currentPage) - 1) * per;
      return this.sortedFilteredItems.slice(start, start + per);
    },
  },
  watch: {
    sortBy(val) {
      this.internalSortBy = this.normalizeSortBy(val);
    },
    sortDesc(val) {
      this.internalSortDesc = this.normalizeSortDesc(val);
    },
    sortedFilteredItems: {
      handler(val) {
        this.$emit('filtered', val);
      },
      immediate: true,
    },
  },
  methods: {
    normalizeSortBy(val) {
      if (Array.isArray(val)) return val[0] || null;
      return val || null;
    },
    normalizeSortDesc(val) {
      if (Array.isArray(val)) return !!val[0];
      return !!val;
    },
    humanize(key) {
      return String(key)
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[_-]+/g, ' ')
        .replace(/^\w/, (c) => c.toUpperCase());
    },
    cellValue(item, field) {
      const raw = item[field.key];
      return field.formatter ? field.formatter(raw, field.key, item) : raw;
    },
    globalIndex(localIndex) {
      const per = Number(this.perPage);
      if (!per) return localIndex;
      return (Number(this.currentPage) - 1) * per + localIndex;
    },
    ariaSort(field) {
      if (!field.sortable || this.internalSortBy !== field.key) return 'none';
      return this.internalSortDesc ? 'descending' : 'ascending';
    },
    sortIcon(field) {
      if (this.internalSortBy !== field.key) return '↕';
      return this.internalSortDesc ? '↓' : '↑';
    },
    onSort(field) {
      this.$emit('head-clicked', field.key);
      if (this.internalSortBy === field.key) {
        if (this.internalSortDesc && !this.mustSort) {
          // asc -> desc -> none
          this.internalSortBy = null;
          this.internalSortDesc = false;
        } else {
          this.internalSortDesc = !this.internalSortDesc;
        }
      } else {
        this.internalSortBy = field.key;
        this.internalSortDesc = false;
      }
      this.$emit('sort-changed', {
        sortBy: this.internalSortBy,
        sortDesc: this.internalSortDesc,
      });
    },
    onRowClick(item, index, event) {
      this.$emit('row-clicked', item, index, event);
      if (this.selectable && !this.noSelectOnClick) {
        this.toggleRowSelection(index);
      }
    },
    // ---- Selection API (consumed by BVTableSelectableMixin via $refs.table) --
    isRowSelected(index) {
      return this.selectedIndices.has(index);
    },
    selectRow(index) {
      if (this.selectMode === 'single') this.selectedIndices.clear();
      this.selectedIndices.add(index);
      this.emitSelected();
    },
    unselectRow(index) {
      this.selectedIndices.delete(index);
      this.emitSelected();
    },
    toggleRowSelection(index) {
      if (this.selectedIndices.has(index)) this.selectedIndices.delete(index);
      else this.selectedIndices.add(index);
      this.emitSelected();
    },
    clearSelected() {
      this.selectedIndices.clear();
      this.emitSelected();
    },
    emitSelected() {
      // Force reactivity on the Set
      this.selectedIndices = new Set(this.selectedIndices);
      const items = this.sortedFilteredItems.filter((_, i) =>
        this.selectedIndices.has(i),
      );
      this.$emit('row-selected', items);
    },
    toggleDetails(item) {
      item._showDetails = !item._showDetails;
    },
  },
};
</script>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
}
.b-table-row-selected {
  background-color: theme-color-level(primary, -10);
}
.b-sort-icon {
  margin-inline-start: 0.25rem;
  font-size: 0.75rem;
  opacity: 0.6;
}
</style>
