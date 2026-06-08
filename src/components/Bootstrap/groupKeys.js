// Injection keys shared between form group components and their children.
export const CHECKBOX_GROUP_KEY = Symbol('bvCheckboxGroup');
export const RADIO_GROUP_KEY = Symbol('bvRadioGroup');
export const TABS_KEY = Symbol('bvTabs');
export const DROPDOWN_KEY = Symbol('bvDropdown');

let counter = 0;
export function uid(prefix = 'bv') {
  counter += 1;
  return `${prefix}-${counter}`;
}
