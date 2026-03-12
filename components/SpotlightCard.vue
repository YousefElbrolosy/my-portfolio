<template>
  <div class="spotlight-card" :class="{ reverse: index % 2 !== 0 }">

    <div class="spotlight-number">
      <span class="comment">// Project {{ String(index).padStart(2, '0') }}</span>
    </div>

    <div class="spotlight-body">

      <div class="spotlight-image">
        <div class="tech-badges">
          <img
            v-for="tech in spotlight.tech"
            :key="tech"
            :src="'/icons/techs/filled/' + tech + '.svg'"
            :alt="tech"
            class="tech-badge"
          />
        </div>
        <img :src="spotlight.img" :alt="spotlight.title" class="main-image" />
      </div>

      <div class="spotlight-info">
        <h3 class="spotlight-title">{{ spotlight.title }}</h3>
        <p class="spotlight-tagline">> {{ spotlight.tagline }}</p>
        <p class="spotlight-desc">{{ spotlight.description }}</p>

        <div class="spotlight-actions">
          <NuxtLink :to="'/blog/' + spotlight.blogSlug" class="action-btn primary">
            read-blog
          </NuxtLink>
          <a :href="spotlight.url" target="_blank" class="action-btn secondary">
            view-project
          </a>
        </div>
      </div>

    </div>

    <div class="spotlight-gist" v-if="spotlight.gistId">
      <GistSnippet :id="spotlight.gistId" />
    </div>

  </div>
</template>

<script setup>
import GistSnippet from './GistSnippet.vue'

defineProps({
  spotlight: { type: Object, required: true },
  index: { type: Number, required: true }
})
</script>

<style scoped>
.spotlight-card {
  margin-bottom: 80px;
  max-width: 900px;
  margin-inline: auto;
}

.spotlight-number .comment {
  font-family: 'Fira Code Retina';
  font-size: 14px;
  color: #607B96;
  margin-bottom: 0.75rem;
  display: block;
}

.spotlight-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.spotlight-card.reverse .spotlight-body {
  direction: rtl;
}

.spotlight-card.reverse .spotlight-body > * {
  direction: ltr;
}

.spotlight-image {
  position: relative;
  border: 1px solid #1E2D3D;
  border-radius: 15px;
  overflow: hidden;
  background-color: #011221;
}

.spotlight-image .main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.tech-badges {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
  z-index: 2;
}

.tech-badge {
  width: 24px;
  height: 24px;
  opacity: 0.9;
}

.spotlight-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.spotlight-title {
  font-family: 'Fira Code Bold';
  color: #E5E9F0;
  font-size: 20px;
  margin-bottom: 0.5rem;
}

.spotlight-tagline {
  font-family: 'Fira Code Retina';
  color: #4D5BCE;
  font-size: 14px;
  margin-bottom: 1rem;
}

.spotlight-desc {
  font-family: 'Fira Code Retina';
  color: #607B96;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.spotlight-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.action-btn {
  font-family: 'Fira Code Retina';
  font-size: 13px;
  padding: 8px 16px;
  border-radius: 8px;
  display: inline-block;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.action-btn:hover {
  opacity: 0.85;
}

.action-btn.primary {
  background-color: #FEA55F;
  color: #010C15;
}

.action-btn.secondary {
  background-color: #1C2B3A;
  color: #FFFFFF;
  border: 1px solid #1E2D3D;
}

.spotlight-gist {
  max-width: 100%;
}

@media (max-width: 768px) {
  .spotlight-card {
    margin-bottom: 50px;
  }
  .spotlight-body {
    grid-template-columns: 1fr;
  }
  .spotlight-card.reverse .spotlight-body {
    direction: ltr;
  }
  .spotlight-title {
    font-size: 18px;
  }
}
</style>
