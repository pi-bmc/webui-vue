import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';

// Global styles: Tailwind (preflight + tokens) first, then the OpenBMC
// compatibility/custom layer so its overrides win the cascade.
import './assets/styles/tailwind.css';
import './assets/styles/_obmc-custom.scss';

import App from './App.vue';
import i18n from './i18n';

import router from './router';

import { format } from 'date-fns-tz';

//Do not change store import.
//Exact match alias set to support
//dotenv customizations.
import store from './store';
import eventBus from './eventBus';
import { ToastPlugin } from './plugins/toast';

// Tailwind + HeadlessUI component kit (replaces bootstrap-vue-next)
import BootstrapCompat from './components/Bootstrap';

const app = createApp(App);

app.use(BootstrapCompat);

app.config.globalProperties.$eventBus = eventBus;
app.config.globalProperties.$confirm = (messageOrOptions, options = {}) => {
  return new Promise((resolve) => {
    const baseOptions =
      typeof messageOrOptions === 'string'
        ? { message: messageOrOptions }
        : messageOrOptions;
    eventBus.$emit('confirm:open', {
      ...baseOptions,
      ...options,
      resolve,
    });
  });
};

//Filters
const filter = {
  formatDate(value) {
    const isUtcDisplay = store.getters['global/isUtcDisplay'];

    if (value instanceof Date) {
      if (isUtcDisplay) {
        return value.toISOString().substring(0, 10);
      }
      const pattern = `yyyy-MM-dd`;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return format(value, pattern, { timezone });
    }
  },
  formatTime(value) {
    const isUtcDisplay = store.getters['global/isUtcDisplay'];

    if (value instanceof Date) {
      if (isUtcDisplay) {
        let timeOptions = {
          timeZone: 'UTC',
          hourCycle: 'h23',
        };
        return `${value.toLocaleTimeString('default', timeOptions)} UTC`;
      }
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const shortTz = this.shortTimeZone(value);
      const pattern = `HH:mm:ss ('${shortTz}' O)`;
      return format(value, pattern, { timezone }).replace('GMT', 'UTC');
    }
  },
  shortTimeZone(value) {
    const longTZ = value
      .toString()
      .match(/\((.*)\)/)
      .pop();
    const regexNotUpper = /[*a-z ]/g;
    return longTZ.replace(regexNotUpper, '');
  },
};
app.config.globalProperties.$filters = filter;

// Dev-only demo mode: seed auth + mock Redfish data so the UI runs with no
// backend. This MUST happen before `app.use(router)` installs the router and
// triggers the initial navigation, otherwise the route guard redirects to
// /login before auth is seeded. The import is dead-code-eliminated unless
// VITE_DEMO_MODE=true.
async function boot() {
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    const { installDemoBackend } = await import('@/mocks/demoBackend');
    installDemoBackend(store);
  }

  app.use(i18n);
  app.use(router);
  app.use(store);
  app.use(ToastPlugin);
  app.use(VueQueryPlugin);

  app.mount('#app');
}

boot();
