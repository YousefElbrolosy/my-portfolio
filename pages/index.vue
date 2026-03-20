<template>
  <main v-if="!loading" id="hello" ref="scrollContainer">

    <!-- HERO VIEWPORT - Fades and scales on scroll -->
    <section class="hero-viewport" :style="{ opacity: heroOpacity, transform: heroTransform, minHeight: heroHeight }">

      <!-- gradients -->
      <div class="css-blurry-gradient-blue"></div>
      <div class="css-blurry-gradient-green"></div>

      <div class="hero-content">
        <section class="hero">

          <div class="head">
            <span>
              Hello, I am
            </span>
            <h1>{{ config.name }}</h1>
            <span class="diple flex">
              >&nbsp;
              <h2 :key="activeRoleIndex" class="line-1 anim-typewriter max-w-fit"> {{ activeRole }} </h2>
            </span>
            <div class="action">
              <a class="cv-button" href="https://drive.google.com/uc?export=download&id=1F5_y3S46aG99Rz_pEuPIZ24DG23WVL6R" download>
                download_cv
              </a>
            </div>
          </div>

          <div id="info">
            <span :class="{hide: !isMobile}">
              // find my profile on Github:
            </span>
            <p class="code">
              <span class="identifier">
                const
              </span>
              <span class="variable-name">
                githubLink
              </span>
              <span class="operator">
                =
              </span>
              <a class="string" :href="'https://github.com/' + config.contacts.social.github.user">
                "https://github.com/{{ config.contacts.social.github.user }}"
              </a>
            </p>
          </div>
        </section>

        <section data-aos="fade-up" class="game" v-if="!isMobile">
          <FeynmanGame />
        </section>
      </div>

      <!-- Scroll indicator -->
      <div class="scroll-indicator" :style="{ opacity: scrollIndicatorOpacity }">
        <span class="scroll-text">// scroll to explore</span>
        <div class="scroll-arrow"></div>
      </div>

    </section>

    <!-- PROJECT SPOTLIGHTS -->
    <section class="spotlights-section">
      <div class="spotlights-header reveal" ref="spotlightsHeaderRef">
        <span class="comment-text">// project spotlights</span>
        <h2 class="spotlights-title">Featured Work</h2>
        <div class="title-line"></div>
      </div>

      <SpotlightCard
        v-for="(spotlight, key) in config.spotlights"
        :key="key"
        :spotlight="spotlight"
        :index="Number(key)"
        class="reveal"
        :class="Number(key) % 2 === 0 ? 'reveal-right' : 'reveal-left'"
        :ref="(el) => { if (el) spotlightRefs[key] = el.$el || el }"
      />
    </section>

  </main>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import DevConfig from '~/developer.json'
import { useScrollProgress } from '~/composables/useScrollProgress'

const config = ref(DevConfig)

const isMobile = ref(false)
const loading = ref(false)

const scrollContainer = ref(null)
const spotlightsHeaderRef = ref(null)
const spotlightRefs = ref({})
const { scrollProgress } = useScrollProgress(scrollContainer)

const heroHeight = ref('100vh')
const activeRoleIndex = ref(0)

const roleList = computed(() => {
  const roles = config.value?.role

  if (Array.isArray(roles) && roles.length > 0) {
    return roles
  }

  if (typeof roles === 'string' && roles.trim().length > 0) {
    return [roles]
  }

  return ['Software Engineer']
})

const activeRole = computed(() => {
  return roleList.value[activeRoleIndex.value] || roleList.value[0]
})

const heroOpacity = computed(() => {
  return Math.max(0, 1 - scrollProgress.value * 2.5)
})

const heroTransform = computed(() => {
  const scale = 1 - scrollProgress.value * 0.05
  const translateY = scrollProgress.value * -30
  return `scale(${Math.max(0.9, scale)}) translateY(${translateY}px)`
})

const scrollIndicatorOpacity = computed(() => {
  return Math.max(0, 1 - scrollProgress.value * 5)
})

let observer = null
let roleRotationTimer = null

onMounted(() => {
  if (window.innerWidth <= 1024) isMobile.value = true
  window.addEventListener('resize', handleResize)
  updateHeroHeight()

  // IntersectionObserver for reveal animations (works in any scroll container)
  nextTick(() => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        }
      })
    }, {
      root: scrollContainer.value,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    })

    // Observe the header
    if (spotlightsHeaderRef.value) {
      observer.observe(spotlightsHeaderRef.value)
    }
    // Observe each spotlight card
    Object.values(spotlightRefs.value).forEach(el => {
      if (el) observer.observe(el)
    })
  })

  if (roleList.value.length > 1) {
    roleRotationTimer = setInterval(() => {
      activeRoleIndex.value = (activeRoleIndex.value + 1) % roleList.value.length
    }, 5000)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (observer) observer.disconnect()
  if (roleRotationTimer) clearInterval(roleRotationTimer)
})

function updateHeroHeight() {
  if (scrollContainer.value) {
    heroHeight.value = scrollContainer.value.clientHeight + 'px'
  }
}

function handleResize() {
  isMobile.value = window.innerWidth <= 1024
  updateHeroHeight()
}
</script>

<style scoped>
#hello {
  width: 100%;
  flex: 1 1 0;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: #1E2D3D #011627;
}

/* Custom scrollbar */
#hello::-webkit-scrollbar {
  width: 12px;
  display: block;
}

#hello::-webkit-scrollbar-track {
  background: #011627;
  border-left: 1px solid #1E2D3D;
}

#hello::-webkit-scrollbar-thumb {
  background: #1E2D3D;
  border-radius: 6px;
  border: 2px solid #011627;
}

#hello::-webkit-scrollbar-thumb:hover {
  background: #607B96;
}

/* HERO VIEWPORT */
.hero-viewport {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 1;
  will-change: opacity, transform;
  flex-shrink: 0;
}

.hero-content {
  position: relative;
  z-index: 20;
  display: flex;
  flex: 1;
  padding-left: 275px;
  align-items: center;
}

.hero {
  width: 100%;
  justify-content: center;
}

.game {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  z-index: 20;
}

#hello .hero {
  display: flex;
  flex-direction: column;
  margin: 0rem;
}

#hello .head span {
  font-size: 18px;
  line-height: 1;
  color: #E5E9F0;
  font-family: 'Fira Code Retina';
}

#hello .head h1 {
  font-size: 58px;
  line-height: 1;
  color: #E5E9F0;
  font-family: 'Fira Code Regular';
  padding-top: 1rem;
  padding-bottom: 1rem;
}

#hello .head h2, #hello .head .diple {
  font-size: 32px;
  line-height: 1;
  color: #4D5BCE;
  font-family: 'Fira Code Retina';
}

.head {
  padding-bottom: 3rem;
}

#info {
  display: flex;
  flex-direction: column;
}

#info > span {
  font-size: 14px;
  line-height: 1;
  color: #8da9c6;
  font-family: 'Fira Code Retina';
  padding-bottom: 1rem;
}

.code {
  font-family: 'Fira Code Medium';
  color: #E5E9F0;
}

.code .identifier {
  color: #6172ff;
}

.code .variable-name {
  color: #43D9AD;
}

.code .operator {
  color: white;
}

.code .string {
  color: #E99287;
  text-decoration-line: underline;
  text-underline-offset: 4px;
}

#info {
  padding-block: 0.5rem;
  font-size: 14px;
}

#info .action {
  display: flex;
}

.cv-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  padding: 0.6rem 1rem;
  border: 1px solid #43D9AD;
  border-radius: 8px;
  font-family: 'Fira Code Retina';
  font-size: 13px;
  color: #43D9AD;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}
.cv-button:hover {
  background-color: #43D9AD;
  color: #011627;
  transform: translateY(-1px);
}

.hide {
  display: none;
}

/* SCROLL INDICATOR */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.scroll-text {
  font-family: 'Fira Code Retina';
  font-size: 12px;
  color: #607B96;
}

.scroll-arrow {
  width: 16px;
  height: 16px;
  border-right: 2px solid #607B96;
  border-bottom: 2px solid #607B96;
  transform: rotate(45deg);
  animation: bounceArrow 2s ease-in-out infinite;
}

@keyframes bounceArrow {
  0%, 100% { transform: rotate(45deg) translateY(0); }
  50% { transform: rotate(45deg) translateY(6px); }
}

/* REVEAL ANIMATIONS (IntersectionObserver-driven) */
/* NOTE: These are deliberately left empty here —
   the actual reveal styles are in an unscoped block below
   so classList.add('revealed') works with IntersectionObserver */

/* SPOTLIGHTS SECTION */
.spotlights-section {
  position: relative;
  z-index: 2;
  background-color: #011627;
  min-height: 100vh;
  padding: 80px 60px 120px;
  border-top: 1px solid #1E2D3D;
  flex-shrink: 0;
}

.spotlights-header {
  text-align: center;
  margin-bottom: 80px;
}

.spotlights-header .comment-text {
  font-family: 'Fira Code Retina';
  font-size: 14px;
  color: #607B96;
  display: block;
  margin-bottom: 0.75rem;
}

.spotlights-title {
  font-family: 'Fira Code Bold';
  font-size: 32px;
  color: #E5E9F0;
  margin-bottom: 1rem;
}

.title-line {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #4D5BCE, #43D9AD);
  margin: 0 auto;
  border-radius: 1px;
}

/* GRADIENT BLOBS */
.css-blurry-gradient-blue {
  position: absolute;
  bottom: 25%;
  right: 5%;
  width: 300px;
  height: 300px;
  border-radius: 0% 0% 50% 50%;
  rotate: 10deg;
  filter: blur(70px);
  background: radial-gradient(circle at 50% 50%,rgba(77, 91, 206, 1), rgba(76, 0, 255, 0));
  opacity: 0.5;
  z-index: 10;
  pointer-events: none;
}

.css-blurry-gradient-green {
  position: absolute;
  top: 20%;
  right: 30%;
  width: 300px;
  height: 300px;
  border-radius: 0% 50% 0% 50%;
  filter: blur(70px);
  background: radial-gradient(circle at 50% 50%,rgba(67, 217, 173, 1), rgba(76, 0, 255, 0));
  opacity: 0.5;
  z-index: 10;
  pointer-events: none;
}

/* Typewrite Animation */
.line-1 {
  width: fit-content;
  border-right: 3px solid rgba(255,255,255,.75);
  white-space: nowrap;
  overflow: hidden;
  padding-right: 2px;
}

.anim-typewriter {
  animation: typewriter 3.5s steps(40) 1s 1 normal both,
  blinkTextCursor 800ms steps(40) infinite normal;
}

@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blinkTextCursor {
  from { border-right-color: rgba(255,255,255,.75); }
  to { border-right-color: transparent; }
}

/* mobile */
@media (max-width: 768px) {
  .hero-content {
    padding-left: 0;
  }

  #hello .hero {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 1.75rem;
  }

  .head {
    padding-top: 4rem;
  }

  #hello .head h2, #hello .head .diple {
    font-size: 20px;
    color: #43D9AD;
  }

  #info .action {
    display: none;
  }

  .spotlights-section {
    padding: 40px 20px 80px;
  }

  .spotlights-title {
    font-size: 24px;
  }

  .spotlights-header {
    margin-bottom: 50px;
  }
}

/* tablet */
@media (min-width: 768px) and (max-width: 1024px) {
  .hero-content {
    padding-left: 0;
  }

  #hello .hero {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 1.75rem;
  }

  .head {
    padding-top: 4rem;
  }

  .spotlights-section {
    padding: 60px 30px 100px;
  }
}

@media (min-width: 1024px) and (max-width: 1320px) {
  .hero-content {
    padding-left: 135px;
  }
}

/* LG */
@media (min-width: 1024px) {
  .css-blurry-gradient-blue {
    position: absolute;
    bottom: 10%;
    right: 10%;
    width: 500px;
    height: 500px;
    opacity: 0.7;
    border-radius: 100% 50% 100% 0%;
  }

  .css-blurry-gradient-green {
    position: absolute;
    top: 10%;
    right: 35%;
    filter: blur(100px);
    rotate: 10deg;
    width: 400px;
    height: 400px;
    opacity: 0.5;
    border-radius: 100% 0% 0% 0%;
    rotate: 20deg;
  }
}

@media (min-width: 1920px) {
  .hero-content {
    padding-left: 310px;
  }

  #hello .head h1 {
    font-size: 62px;
  }
}
</style>

<!-- Unscoped: IntersectionObserver adds 'revealed' via JS classList,
     which won't match scoped selectors (data-v-xxx attribute).
     Scoped to #hello to avoid leaking globally. -->
<style>
#hello .reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

#hello .reveal.reveal-right {
  transform: translateX(60px) translateY(20px);
}

#hello .reveal.reveal-left {
  transform: translateX(-60px) translateY(20px);
}

#hello .reveal.revealed {
  opacity: 1;
  transform: translateX(0) translateY(0);
}
</style>
