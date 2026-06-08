import { ref, computed, watch } from 'vue';

// System-aware color theming with a manual override.
//   preference: 'system' | 'light' | 'dark'  (persisted in localStorage)
//   isDark:     resolved boolean applied to <html data-theme>
//
// Module-level state makes this a singleton shared across all callers.

const STORAGE_KEY = 'colorTheme';

const hasWindow = typeof window !== 'undefined';
const mediaQuery =
  hasWindow && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

function readStoredPreference() {
  if (!hasWindow || !window.localStorage) return 'system';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : 'system';
}

const preference = ref(readStoredPreference());
const systemPrefersDark = ref(mediaQuery ? mediaQuery.matches : false);

if (mediaQuery) {
  const onChange = (event) => {
    systemPrefersDark.value = event.matches;
  };
  // addEventListener is preferred; fall back to addListener for old engines.
  if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', onChange);
  else if (mediaQuery.addListener) mediaQuery.addListener(onChange);
}

const isDark = computed(
  () =>
    preference.value === 'dark' ||
    (preference.value === 'system' && systemPrefersDark.value),
);

function applyTheme() {
  if (!hasWindow || !document?.documentElement) return;
  document.documentElement.setAttribute(
    'data-theme',
    isDark.value ? 'dark' : 'light',
  );
}

// Keep <html data-theme> in sync with the resolved mode.
watch(isDark, applyTheme, { immediate: true });

function setPreference(value) {
  const next = ['light', 'dark', 'system'].includes(value) ? value : 'system';
  preference.value = next;
  if (!hasWindow || !window.localStorage) return;
  if (next === 'system') window.localStorage.removeItem(STORAGE_KEY);
  else window.localStorage.setItem(STORAGE_KEY, next);
}

function toggle() {
  // Cycle through the resolved appearance: light <-> dark (drops 'system').
  setPreference(isDark.value ? 'light' : 'dark');
}

export function useColorMode() {
  return { preference, isDark, setPreference, toggle };
}

export default useColorMode;
