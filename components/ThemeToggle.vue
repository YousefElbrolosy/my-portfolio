<template>
  <button
    class="theme-toggle"
    type="button"
    :aria-label="theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
    :title="theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
    @click="toggle"
  >
    <!-- moon: shown in light mode -->
    <svg v-if="theme === 'light'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
    <!-- sun: shown in dark mode (and before mount) -->
    <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  </button>
</template>

<script setup>
const { theme, toggle } = useTheme()
</script>

<style>
.theme-toggle {
  @apply text-menu-text h-full flex items-center justify-center;
  padding: 0 1.25rem;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.theme-toggle:hover {
  background-color: var(--c-hover);
  color: var(--c-fg);
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--c-ring);
  outline-offset: -2px;
}
</style>
