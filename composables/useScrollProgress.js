import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useScrollProgress(containerRef) {
  const scrollProgress = ref(0)
  const scrollTop = ref(0)

  let rafId = null

  function handleScroll() {
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      if (!containerRef.value) { rafId = null; return }
      const el = containerRef.value
      scrollTop.value = el.scrollTop
      const heroHeight = el.clientHeight
      scrollProgress.value = heroHeight > 0 ? Math.min(1, el.scrollTop / heroHeight) : 0
      rafId = null
    })
  }

  onMounted(() => {
    containerRef.value?.addEventListener('scroll', handleScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    containerRef.value?.removeEventListener('scroll', handleScroll)
    if (rafId) cancelAnimationFrame(rafId)
  })

  return { scrollProgress, scrollTop }
}
