// Compatibility stub for the former bootstrap-vue-next `useModal` composable.
//
// In this codebase modals are controlled imperatively through component refs
// (`this.$refs.modal.show()` / `.hide()`), so the returned controller is not
// actually invoked. This stub exists only to satisfy the legacy imports.
export function useModal() {
  return {
    show: () => {},
    hide: () => {},
    toggle: () => {},
    confirm: () => Promise.resolve(false),
  };
}

export default useModal;
