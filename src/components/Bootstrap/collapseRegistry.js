// Lightweight registry so the `v-b-toggle` directive can control <b-collapse>
// instances by their id (mirrors bootstrap-vue-next behavior).
const registry = new Map();

export function registerCollapse(id, api) {
  if (id) registry.set(id, api);
}

export function unregisterCollapse(id) {
  if (id) registry.delete(id);
}

export function toggleCollapse(id) {
  const api = registry.get(id);
  if (api) api.toggle();
}
