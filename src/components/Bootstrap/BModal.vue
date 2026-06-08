<template>
  <h-transition-root
    :show="isOpen"
    as="template"
    appear
    @after-enter="$emit('shown')"
    @after-leave="$emit('hidden')"
  >
    <h-dialog
      :id="id"
      class="b-modal-dialog"
      :initial-focus="undefined"
      @close="onBackdropOrEsc"
    >
      <h-transition-child
        as="template"
        enter="transition-opacity ease-out duration-200"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity ease-in duration-150"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="modal-backdrop-overlay" aria-hidden="true"></div>
      </h-transition-child>

      <div
        class="modal-scroll-container"
        :class="{ 'modal-centered': centered }"
      >
        <h-transition-child
          as="template"
          enter="transition ease-out duration-200"
          enter-from="opacity-0 translate-y-2"
          enter-to="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leave-from="opacity-100 translate-y-0"
          leave-to="opacity-0 translate-y-2"
        >
          <h-dialog-panel
            class="modal-content"
            :class="[`modal-${size}`, { 'modal-scrollable': scrollable }]"
          >
            <!-- Header -->
            <div v-if="!hideHeader" class="modal-header">
              <slot name="header" :close="hide">
                <h-dialog-title as="h2" class="modal-title h5">
                  <slot name="modal-title">{{ title }}</slot>
                </h-dialog-title>
                <b-close-button
                  v-if="!noHeaderClose"
                  :aria-label="$attrs['cancel-title'] || 'Close'"
                  @click="onCancel"
                />
              </slot>
            </div>

            <!-- Body -->
            <div class="modal-body">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="!hideFooter" class="modal-footer">
              <slot
                name="footer"
                :ok="onOk"
                :cancel="onCancel"
                :hide="hide"
                :close="hide"
              >
                <b-button
                  v-if="!okOnly"
                  :variant="cancelVariant"
                  @click="onCancel"
                >
                  <slot name="modal-cancel">{{ cancelTitleResolved }}</slot>
                </b-button>
                <b-button
                  :variant="okVariant"
                  :disabled="okDisabled || busy"
                  @click="onOk"
                >
                  <b-spinner v-if="busy" small class="me-2" />
                  <slot name="modal-ok">{{ okTitleResolved }}</slot>
                </b-button>
              </slot>
            </div>
          </h-dialog-panel>
        </h-transition-child>
      </div>
    </h-dialog>
  </h-transition-root>
</template>

<script>
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue';
import BButton from './BButton.vue';
import BCloseButton from './BCloseButton.vue';
import BSpinner from './BSpinner.vue';

export default {
  name: 'BModal',
  components: {
    HDialog: Dialog,
    HDialogPanel: DialogPanel,
    HDialogTitle: DialogTitle,
    HTransitionRoot: TransitionRoot,
    HTransitionChild: TransitionChild,
    BButton,
    BCloseButton,
    BSpinner,
  },
  inheritAttrs: false,
  props: {
    modelValue: { type: Boolean, default: undefined },
    id: { type: String, default: null },
    title: { type: String, default: '' },
    size: { type: String, default: 'md' },
    okTitle: { type: String, default: '' },
    cancelTitle: { type: String, default: '' },
    okVariant: { type: String, default: 'primary' },
    cancelVariant: { type: String, default: 'secondary' },
    okDisabled: { type: Boolean, default: false },
    okOnly: { type: Boolean, default: false },
    hideFooter: { type: Boolean, default: false },
    hideHeader: { type: Boolean, default: false },
    noHeaderClose: { type: Boolean, default: false },
    noCloseOnBackdrop: { type: Boolean, default: false },
    noCloseOnEsc: { type: Boolean, default: false },
    busy: { type: Boolean, default: false },
    centered: { type: Boolean, default: false },
    scrollable: { type: Boolean, default: false },
    // Accepted for API compatibility (no behavioral effect here).
    static: { type: Boolean, default: false },
    focus: { type: [String, Boolean], default: null },
  },
  emits: ['update:modelValue', 'ok', 'cancel', 'show', 'hide', 'shown', 'hidden'],
  data() {
    return { internalOpen: false };
  },
  computed: {
    isOpen() {
      return this.modelValue !== undefined ? this.modelValue : this.internalOpen;
    },
    okTitleResolved() {
      return this.okTitle || 'OK';
    },
    cancelTitleResolved() {
      return this.cancelTitle || 'Cancel';
    },
  },
  watch: {
    isOpen(val) {
      this.$emit(val ? 'show' : 'hide');
    },
  },
  methods: {
    setOpen(val) {
      if (this.modelValue !== undefined) {
        this.$emit('update:modelValue', val);
      } else {
        this.internalOpen = val;
      }
    },
    hide() {
      this.setOpen(false);
    },
    show() {
      this.setOpen(true);
    },
    onOk() {
      let prevented = false;
      const evt = { preventDefault: () => (prevented = true) };
      this.$emit('ok', evt);
      if (!prevented) this.hide();
    },
    onCancel() {
      let prevented = false;
      const evt = { preventDefault: () => (prevented = true) };
      this.$emit('cancel', evt);
      if (!prevented) this.hide();
    },
    onBackdropOrEsc() {
      // HeadlessUI fires @close for both ESC and outside click. Honor the
      // no-close props; if both are set the modal is fully programmatic.
      if (this.noCloseOnBackdrop && this.noCloseOnEsc) return;
      this.onCancel();
    },
  },
};
</script>

<style lang="scss" scoped>
.b-modal-dialog {
  position: fixed;
  inset: 0;
  z-index: $zindex-modal;
}
.modal-backdrop-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba($black, 0.5);
  z-index: $zindex-modal-backdrop;
}
.modal-scroll-container {
  position: fixed;
  inset: 0;
  z-index: $zindex-modal;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 1.75rem 1rem;
  &.modal-centered {
    align-items: center;
  }
}
.modal-content {
  width: 100%;
  margin: 0 auto;
}
.modal-sm {
  max-width: 300px;
}
.modal-md {
  max-width: 500px;
}
.modal-lg {
  max-width: 800px;
}
.modal-xl {
  max-width: 1140px;
}
.modal-scrollable {
  max-height: calc(100vh - 3.5rem);
  .modal-body {
    overflow-y: auto;
  }
}
</style>
