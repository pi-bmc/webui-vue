import { toggleCollapse } from './collapseRegistry';

// v-b-toggle[.targetId] or v-b-toggle="'targetId'" / v-b-toggle:targetId
// Toggles a <b-collapse> (or any registered collapsible) by id on click.
export const vBToggle = {
  mounted(el, binding) {
    const targets = [];
    if (binding.arg) targets.push(binding.arg);
    if (binding.value) {
      if (Array.isArray(binding.value)) targets.push(...binding.value);
      else targets.push(binding.value);
    }
    Object.keys(binding.modifiers || {}).forEach((m) => targets.push(m));

    el.__bToggleHandler = () => targets.forEach((t) => toggleCollapse(t));
    el.addEventListener('click', el.__bToggleHandler);
    el.setAttribute('aria-expanded', 'false');
  },
  unmounted(el) {
    if (el.__bToggleHandler) {
      el.removeEventListener('click', el.__bToggleHandler);
      delete el.__bToggleHandler;
    }
  },
};

// Minimal tooltip: surface the bound text (or existing title) via the native
// title attribute. A pragmatic, dependency-free replacement.
export const vBTooltip = {
  mounted(el, binding) {
    const text =
      typeof binding.value === 'string'
        ? binding.value
        : binding.value?.title;
    if (text) el.setAttribute('title', text);
  },
  updated(el, binding) {
    const text =
      typeof binding.value === 'string'
        ? binding.value
        : binding.value?.title;
    if (text) el.setAttribute('title', text);
  },
};

// v-b-popover / v-b-modal are accepted for API compatibility (no-ops here).
export const vBPopover = {
  mounted(el, binding) {
    const text =
      typeof binding.value === 'string'
        ? binding.value
        : binding.value?.content;
    if (text) el.setAttribute('title', text);
  },
};

export const vBModal = {
  mounted() {},
};
