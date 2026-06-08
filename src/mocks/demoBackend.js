/**
 * Dev-only demo backend (enabled with VITE_DEMO_MODE=true).
 *
 * Lets the UI run with no real BMC by:
 *   1. Seeding authentication state so the route guard lets you in (no login).
 *   2. Attaching a mock axios adapter that answers Redfish requests from
 *      in-memory fixtures, with a graceful fallback for any unmapped path.
 *
 * This module is only imported (and only bundled) when VITE_DEMO_MODE is set
 * — see main.js — so production builds are completely unaffected.
 */
import { axiosInstance } from '@/store/api';
import { fixtures, genericResource } from './demoFixtures';

function makeResponse(data, { status = 200, headers = {} } = {}) {
  return {
    data,
    status,
    statusText: status === 201 ? 'Created' : 'OK',
    headers,
    config: {},
    request: {},
  };
}

function normalizePath(url) {
  if (!url) return '/redfish/v1';
  // Drop query string (?$expand=..., ?$select=...) and trailing slash
  const path = url.split('?')[0].replace(/\/+$/, '');
  return path || '/redfish/v1';
}

// Resolve a fixture for a GET path. Fixture values may be plain objects or
// functions (path) => object, to support parameterized members.
function resolveFixture(path) {
  if (Object.prototype.hasOwnProperty.call(fixtures, path)) {
    const entry = fixtures[path];
    return typeof entry === 'function' ? entry(path) : entry;
  }
  return undefined;
}

async function demoAdapter(config) {
  const method = (config.method || 'get').toLowerCase();
  const path = normalizePath(config.url);

  // Session creation (login) — also lets the real login form work in demo.
  if (method === 'post' && path.endsWith('/SessionService/Sessions')) {
    let userName = 'demo';
    try {
      const body =
        typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      userName = body?.UserName || userName;
    } catch {
      /* ignore */
    }
    return makeResponse(
      {
        '@odata.id': '/redfish/v1/SessionService/Sessions/demo',
        Id: 'demo',
        Name: 'User Session',
        UserName: userName,
        Roles: ['Administrator'],
      },
      {
        status: 201,
        headers: {
          location: '/redfish/v1/SessionService/Sessions/demo',
          'x-auth-token': 'demo-token',
        },
      },
    );
  }

  // Mutations succeed silently so action success toasts render.
  if (method !== 'get') {
    return makeResponse({}, { status: 200 });
  }

  const fixture = resolveFixture(path);
  if (fixture !== undefined) return makeResponse(fixture);

  // Unmapped GET: return a resource that works as both an empty collection
  // and a benign singleton so pages render their empty state instead of crashing.
  return makeResponse(genericResource(path));
}

/**
 * Install the demo backend: attach the mock adapter and seed auth state.
 * @param {import('vuex').Store} store
 */
export function installDemoBackend(store) {
  axiosInstance.defaults.adapter = demoAdapter;

  // Seed auth so isLoggedIn === true (uses the in-memory token path since no
  // XSRF cookie exists in demo) and give ourselves the Administrator role.
  store.commit('authentication/authSuccess', {
    session: '/redfish/v1/SessionService/Sessions/demo',
    token: 'demo-token',
  });
  store.commit('global/setPrivilege', 'Administrator');
  if (!store.getters['global/username']) {
    store.commit('global/setUsername', 'demo');
  }

  console.info(
    '%c[demo mode]%c Running with mock Redfish data — no backend required.',
    'color:#2d60e5;font-weight:bold',
    'color:inherit',
  );
}

export default installDemoBackend;
