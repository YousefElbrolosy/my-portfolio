/**
 * Light / dark theme state.
 *
 * The initial theme is applied before first paint by the inline script in nuxt.config.ts
 * (saved choice in localStorage, otherwise the system preference). This composable reads
 * that value on mount, toggles it, and persists the user's explicit choice.
 */
const STORAGE_KEY = 'theme'

export function useTheme() {
  // null until mounted, so server and client render the same markup
  const theme = useState('theme', () => null)

  function apply(value) {
    theme.value = value
    document.documentElement.setAttribute('data-theme', value)
  }

  function toggle() {
    const next = theme.value === 'light' ? 'dark' : 'light'
    apply(next)
    try { localStorage.setItem(STORAGE_KEY, next) } catch (e) { /* storage unavailable */ }
  }

  onMounted(() => {
    apply(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark')

    // Follow system changes until the user picks a theme explicitly
    const media = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = (e) => {
      let saved = null
      try { saved = localStorage.getItem(STORAGE_KEY) } catch (err) { /* ignore */ }
      if (!saved) apply(e.matches ? 'light' : 'dark')
    }
    media.addEventListener('change', onChange)
    onBeforeUnmount(() => media.removeEventListener('change', onChange))
  })

  return { theme, toggle }
}
