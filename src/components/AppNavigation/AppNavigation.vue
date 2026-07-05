<template>
  <div>
    <div class="nav-container" :class="{ open: isNavigationOpen }">
      <nav ref="nav" :aria-label="$t('appNavigation.primaryNavigation')">
        <b-nav vertical class="mb-4">
          <template v-for="navItem in navigationItems">
            <!-- Navigation items with no children -->
            <li
              v-if="!navItem.children"
              :key="`nav-${navItem.index}`"
              class="nav-item"
            >
              <router-link
                :to="navItem.route"
                :data-test-id="`nav-item-${navItem.id}`"
                class="nav-link"
              >
                <component :is="navItem.icon" />
                {{ navItem.label }}
              </router-link>
            </li>

            <!-- Navigation items with children -->
            <li v-else :key="`nav-group-${navItem.index}`" class="nav-item">
              <b-button
                :class="{ collapsed: !isItemOpen(navItem.id) }"
                variant="link"
                :data-test-id="`nav-button-${navItem.id}`"
                :aria-controls="navItem.id"
                :aria-expanded="isItemOpen(navItem.id) ? 'true' : 'false'"
                @click="toggleCollapse(navItem.id)"
              >
                <component :is="navItem.icon" />
                {{ navItem.label }}
                <icon-expand class="icon-expand" />
              </b-button>
              <b-collapse
                :id="navItem.id"
                v-model="openSections[navItem.id]"
                tag="ul"
                class="nav-item__nav"
              >
                <li
                  v-for="(subNavItem, i) in filteredNavItem(navItem.children)"
                  :key="i"
                  class="nav-item"
                >
                  <router-link
                    :to="subNavItem.route"
                    :data-test-id="`nav-item-${subNavItem.id}`"
                    class="nav-link"
                  >
                    {{ subNavItem.label }}
                  </router-link>
                </li>
              </b-collapse>
            </li>
          </template>
        </b-nav>
      </nav>
    </div>
    <transition name="fade">
      <div
        v-if="isNavigationOpen"
        id="nav-overlay"
        class="nav-overlay"
        @click="toggleIsOpen"
      ></div>
    </transition>
  </div>
</template>

<script>
//Do not change Mixin import.
//Exact match alias set to support
//dotenv customizations.
import AppNavigationMixin from './AppNavigationMixin';
import eventBus from '@/eventBus';

export default {
  name: 'AppNavigation',
  mixins: [AppNavigationMixin],
  data() {
    return {
      isNavigationOpen: false,
      currentUserRole: null,
      openSections: {},
    };
  },
  watch: {
    $route: function () {
      this.isNavigationOpen = false;
      // Ensure the parent section of the current route is expanded
      this.initializeOpenSectionsFromRoute();
    },
    isNavigationOpen: function (isNavigationOpen) {
      eventBus.$emit('change-is-navigation-open', isNavigationOpen);
    },
  },
  mounted() {
    this.getPrivilege();
    eventBus.$on('toggle-navigation', this.handleToggleNavigation);
    // Expand the parent section for the current route on initial load/refresh
    this.initializeOpenSectionsFromRoute();
  },
  beforeUnmount() {
    eventBus.$off('toggle-navigation', this.handleToggleNavigation);
  },
  methods: {
    handleToggleNavigation() {
      this.toggleIsOpen();
    },
    isItemOpen(id) {
      return !!this.openSections[id];
    },
    toggleCollapse(id) {
      if (this.$set) {
        this.$set(this.openSections, id, !this.openSections[id]);
      } else {
        this.openSections = {
          ...this.openSections,
          [id]: !this.openSections[id],
        };
      }
    },
    toggleIsOpen() {
      this.isNavigationOpen = !this.isNavigationOpen;
    },
    getPrivilege() {
      this.currentUserRole = this.$store?.getters['global/userPrivilege'];
    },
    filteredNavItem(navItem) {
      if (this.currentUserRole) {
        return navItem.filter(({ exclusiveToRoles }) => {
          if (!exclusiveToRoles?.length) return true;
          return exclusiveToRoles.includes(this.currentUserRole);
        });
      } else return navItem;
    },
    initializeOpenSectionsFromRoute() {
      const currentPath = this.$route?.path;
      if (!currentPath) return;
      const sectionsToOpen = {};
      for (const item of this.navigationItems) {
        if (
          item.children &&
          item.children.some((child) => child.route === currentPath)
        ) {
          sectionsToOpen[item.id] = true;
        }
      }
      this.openSections = { ...this.openSections, ...sectionsToOpen };
    },
  },
};
</script>

<style scoped lang="scss">
svg {
  fill: currentColor;
  height: 1.2rem;
  width: 1.2rem;
  margin-inline-start: 0 !important; //!important overriding button specificity
  vertical-align: text-bottom;
  &:not(.icon-expand) {
    margin-inline-end: $spacer;
  }
}

.nav {
  padding-top: calc(#{$spacer} / 4);
  @include media-breakpoint-up($responsive-layout-bp) {
    padding-top: $spacer;
  }
}

.nav-item__nav {
  list-style: none;
  padding-inline-start: 0;
  margin-inline-start: 0;

  .nav-item {
    outline: none;
    list-style: none;
  }

  .nav-link {
    padding-inline-start: $spacer * 4;
    outline: none;

    &:not(.nav-link--current) {
      font-weight: normal;
    }
  }
}
:deep(ul.nav-item__nav) {
  padding-inline-start: 0 !important;
  margin-inline-start: 0 !important;
}

.btn-link {
  display: inline-block;
  width: 100%;
  text-align: start;
  text-decoration: none !important;

  &.collapsed {
    .icon-expand {
      transform: rotate(180deg);
    }
  }
}

.icon-expand {
  float: inline-end;
  margin-top: calc(#{$spacer} / 4);
}

.btn-link,
.nav-link {
  position: relative;
  font-weight: normal;
  padding-inline-start: $spacer; // defining consistent padding for links and buttons
  padding-inline-end: $spacer;
  // Neutral link text/hover/focus flip via --bs-* tokens.
  color: var(--bs-body-color);

  &:hover {
    background-color: var(--bs-secondary-bg);
    color: var(--bs-body-color);
  }

  &:focus {
    background-color: var(--bs-tertiary-bg);
    box-shadow: inset 0 0 0 2px var(--bs-primary);
    color: var(--bs-body-color);
    outline: 0;
  }

  // Pressed state uses the inverted "selected" chip (dark chip + light text);
  // the dark-mode block at the bottom keeps the chip legible on a dark sidebar.
  &:active {
    background-color: var(--bs-secondary);
    color: var(--bs-light);
  }
}

.nav-link--current {
  font-weight: $headings-font-weight;
  background-color: var(--bs-secondary);
  color: var(--bs-light);
  cursor: default;
  box-shadow: none;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    inset-inline-start: 0;
    width: $nav-indicator-width;
    background-color: var(--bs-primary);
  }

  &:hover,
  &:focus {
    background-color: var(--bs-secondary);
    color: var(--bs-light);
  }
}

.nav-container {
  position: fixed;
  width: $navigation-width;
  top: $header-height;
  bottom: 0;
  inset-inline-start: 0;
  z-index: $zindex-fixed;
  overflow-y: auto;
  // Sidebar surface + edge border flip via --bs-* tokens.
  background-color: var(--bs-tertiary-bg);
  transform: translateX(-$navigation-width);
  transition: transform $exit-easing--productive $duration--moderate-02;
  border-inline-end: 1px solid var(--bs-border-color);

  @include media-breakpoint-down(md) {
    z-index: $zindex-fixed + 2;
  }

  &.open,
  &:focus-within {
    transform: translateX(0);
    transition-timing-function: $entrance-easing--productive;
  }

  @include media-breakpoint-up($responsive-layout-bp) {
    transition-duration: $duration--fast-01;
    transform: translateX(0);
  }
}

.nav-overlay {
  position: fixed;
  top: $header-height;
  bottom: 0;
  inset-inline-start: 0;
  inset-inline-end: 0;
  z-index: $zindex-fixed + 1;
  background-color: var(--bs-black);
  opacity: 0.5;

  &.fade-enter-active {
    transition: opacity $duration--moderate-02 $entrance-easing--productive;
  }

  &.fade-leave-active {
    transition: opacity $duration--fast-02 $exit-easing--productive;
  }

  &.fade-enter-from, // This is vue3 based only class modified from 'fade-enter'
  &.fade-leave-to {
    opacity: 0;
  }

  @include media-breakpoint-up($responsive-layout-bp) {
    display: none;
  }
}

// Dark mode: the light-theme "selected" chip is a dark surface with light text,
// which is too low-contrast against the now-dark sidebar. Lift it to a lighter
// surface with emphasis text so the active/current item stays legible.
@include color-mode(dark) {
  .btn-link,
  .nav-link {
    &:active {
      background-color: var(--bs-secondary-bg);
      color: var(--bs-emphasis-color);
    }
  }

  .nav-link--current {
    background-color: var(--bs-secondary-bg);
    color: var(--bs-emphasis-color);

    &:hover,
    &:focus {
      background-color: var(--bs-secondary-bg);
      color: var(--bs-emphasis-color);
    }
  }
}
</style>
