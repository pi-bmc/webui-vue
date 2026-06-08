// Tailwind + HeadlessUI component kit that replaces bootstrap-vue-next.
// Registered globally with the same `b-*` names so existing templates work.
import BButton from './BButton.vue';
import BLink from './BLink.vue';
import BContainer from './BContainer.vue';
import BRow from './BRow.vue';
import BCol from './BCol.vue';
import BForm from './BForm.vue';
import BFormGroup from './BFormGroup.vue';
import BFormInput from './BFormInput.vue';
import BFormTextarea from './BFormTextarea.vue';
import BFormText from './BFormText.vue';
import BFormInvalidFeedback from './BFormInvalidFeedback.vue';
import BFormSelect from './BFormSelect.vue';
import BFormSelectOption from './BFormSelectOption.vue';
import BFormCheckbox from './BFormCheckbox.vue';
import BFormCheckboxGroup from './BFormCheckboxGroup.vue';
import BFormRadio from './BFormRadio.vue';
import BFormRadioGroup from './BFormRadioGroup.vue';
import BFormFile from './BFormFile.vue';
import BFormTags from './BFormTags.vue';
import BInputGroup from './BInputGroup.vue';
import BInputGroupText from './BInputGroupText.vue';
import BTable from './BTable.vue';
import BModal from './BModal.vue';
import BCard from './BCard.vue';
import BCardBody from './BCardBody.vue';
import BCardHeader from './BCardHeader.vue';
import BCardFooter from './BCardFooter.vue';
import BCardGroup from './BCardGroup.vue';
import BBadge from './BBadge.vue';
import BAlert from './BAlert.vue';
import BSpinner from './BSpinner.vue';
import BProgress from './BProgress.vue';
import BProgressBar from './BProgressBar.vue';
import BCloseButton from './BCloseButton.vue';
import BOverlay from './BOverlay.vue';
import BListGroup from './BListGroup.vue';
import BListGroupItem from './BListGroupItem.vue';
import BNav from './BNav.vue';
import BNavbar from './BNavbar.vue';
import BNavbarBrand from './BNavbarBrand.vue';
import BNavbarNav from './BNavbarNav.vue';
import BNavItem from './BNavItem.vue';
import BNavbarToggle from './BNavbarToggle.vue';
import BCollapse from './BCollapse.vue';
import BTabs from './BTabs.vue';
import BTab from './BTab.vue';
import BPagination from './BPagination.vue';
import BDropdown from './BDropdown.vue';
import BDropdownItem from './BDropdownItem.vue';
import BDropdownItemButton from './BDropdownItemButton.vue';
import BDropdownDivider from './BDropdownDivider.vue';
import BDropdownForm from './BDropdownForm.vue';

import { vBToggle, vBTooltip, vBPopover, vBModal } from './directives';

const components = {
  BButton,
  BBtn: BButton,
  BLink,
  BContainer,
  BRow,
  BCol,
  BForm,
  BFormGroup,
  BFormInput,
  BFormTextarea,
  BFormText,
  BFormInvalidFeedback,
  BFormSelect,
  BFormSelectOption,
  BFormCheckbox,
  BFormCheckboxGroup,
  BFormRadio,
  BFormRadioGroup,
  BFormFile,
  BFormTags,
  BInputGroup,
  BInputGroupText,
  BTable,
  BModal,
  BCard,
  BCardBody,
  BCardHeader,
  BCardFooter,
  BCardGroup,
  BBadge,
  BAlert,
  BSpinner,
  BProgress,
  BProgressBar,
  BCloseButton,
  BOverlay,
  BListGroup,
  BListGroupItem,
  BNav,
  BNavbar,
  BNavbarBrand,
  BNavbarNav,
  BNavItem,
  BNavbarToggle,
  BCollapse,
  BTabs,
  BTab,
  BPagination,
  BDropdown,
  BDropdownItem,
  BDropdownItemButton,
  BDropdownDivider,
  BDropdownForm,
};

export const BootstrapCompat = {
  install(app) {
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component);
    }
    app.directive('b-toggle', vBToggle);
    app.directive('b-tooltip', vBTooltip);
    app.directive('b-popover', vBPopover);
    app.directive('b-modal', vBModal);
  },
};

export default BootstrapCompat;
export { components };
