import { reactive } from 'vue';

// Reactive toast queue + controller, replacing bootstrap-vue-next's useToast.
let counter = 0;

export const toastState = reactive({ toasts: [] });

export const toastController = {
  create(options = {}) {
    const id = ++counter;
    const props = options.props || {};
    const interval = Number(props.interval ?? options.interval ?? 0);
    const toast = {
      id,
      body: options.body ?? '',
      title: typeof options.title === 'string' ? options.title : '',
      titleRender:
        typeof options.slots?.title === 'function' ? options.slots.title : null,
      variant: props.variant || 'info',
      interval,
    };
    toastState.toasts.push(toast);
    if (interval > 0) {
      setTimeout(() => toastController.remove(id), interval);
    }
    return id;
  },
  remove(id) {
    const idx = toastState.toasts.findIndex((t) => t.id === id);
    if (idx !== -1) toastState.toasts.splice(idx, 1);
  },
  clear() {
    toastState.toasts.splice(0, toastState.toasts.length);
  },
};
