<template>
  <span :class="['status-icon', status]">
    <icon-info v-if="status === 'info'" />
    <icon-success v-else-if="status === 'success'" />
    <icon-warning v-else-if="status === 'warning'" />
    <icon-danger v-else-if="status === 'danger'" />
    <icon-secondary v-else />
  </span>
</template>

<script>
import IconInfo from '@carbon/icons-vue/es/information--filled/20';
import IconCheckmark from '@carbon/icons-vue/es/checkmark--filled/20';
import IconWarning from '@carbon/icons-vue/es/warning--filled/20';
import IconError from '@carbon/icons-vue/es/error--filled/20';
import IconMisuse from '@carbon/icons-vue/es/misuse/20';

export default {
  name: 'StatusIcon',
  components: {
    IconInfo: IconInfo,
    iconSuccess: IconCheckmark,
    iconDanger: IconMisuse,
    iconSecondary: IconError,
    iconWarning: IconWarning,
  },
  props: {
    status: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.status-icon {
  vertical-align: text-bottom;

  // Status accents use the base --bs-* colors (identical to the old
  // theme-color() values in light mode); the neutral "secondary" state flips
  // automatically.
  &.info {
    color: var(--bs-info);
  }
  &.success {
    color: var(--bs-success);
  }
  &.danger {
    color: var(--bs-danger);
  }
  &.secondary {
    color: var(--bs-secondary-color);
    transform: rotate(-45deg);
  }
  &.warning {
    color: var(--bs-warning);
  }

  svg {
    fill: currentColor;
  }
}

// Dark mode: the base status colors (dark green especially) are low-contrast on
// a dark surface — use the lighter text-emphasis tokens instead.
@include color-mode(dark) {
  .status-icon {
    &.info {
      color: var(--bs-info-text-emphasis);
    }
    &.success {
      color: var(--bs-success-text-emphasis);
    }
    &.danger {
      color: var(--bs-danger-text-emphasis);
    }
    &.warning {
      color: var(--bs-warning-text-emphasis);
    }
  }
}
</style>
