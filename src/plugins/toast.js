import { toastController } from './toastController';

// Global toast plugin for Options API components.
// Backed by our Tailwind/HeadlessUI toaster (see Global/AppToaster.vue),
// replacing bootstrap-vue-next's useToast composable.

export const ToastPlugin = {
  install(app) {
    app.config.globalProperties.$toast = {
      show(options) {
        toastController.create(options);
      },
      info(body, options = {}) {
        this.show({
          ...options,
          body,
          props: { variant: 'info', ...options.props },
        });
      },
      success(body, options = {}) {
        this.show({
          ...options,
          body,
          props: { variant: 'success', interval: 10000, ...options.props },
        });
      },
      warning(body, options = {}) {
        this.show({
          ...options,
          body,
          props: { variant: 'warning', ...options.props },
        });
      },
      danger(body, options = {}) {
        this.show({
          ...options,
          body,
          props: { variant: 'danger', ...options.props },
        });
      },
    };
  },
};
