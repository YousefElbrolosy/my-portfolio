<template>
  <main class="page">
    <div id="mobile-page-title">
      <h2>_blog</h2>
    </div>

    <div class="flex flex-col w-full overflow-hidden">

      <!-- Tab bar (desktop) -->
      <div class="tab-height w-full hidden lg:flex border-bot items-center">
        <div class="flex items-center border-right h-full">
          <p class="font-fira_regular text-menu-text text-sm px-3">all-posts</p>
          <img src="/icons/close.svg" alt="" class="m-3 hover:cursor-pointer">
        </div>
      </div>

      <!-- Blog cards -->
      <div class="blog-grid">
        <NuxtLink
          v-for="(post, slug) in blog"
          :key="slug"
          :to="'/blog/' + slug"
          class="blog-card"
          data-aos="fade-up"
        >
          <div class="blog-card-image" v-if="post.heroImage">
            <img :src="post.heroImage" :alt="post.title" />
          </div>
          <div class="blog-card-body">
            <div class="blog-card-meta">
              <span class="blog-date">{{ post.date }}</span>
              <span v-for="tag in post.tags" :key="tag" class="blog-tag">{{ tag }}</span>
            </div>
            <h3 class="blog-card-title">{{ post.title }}</h3>
            <p class="blog-card-excerpt">{{ post.excerpt }}</p>
            <span class="blog-read-more">read-more --></span>
          </div>
        </NuxtLink>
      </div>

    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import DevConfig from '~/developer.json'

const blog = ref(DevConfig.blog)
</script>

<style scoped>
.tab-height {
  min-height: 35px;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
  padding: 40px;
  overflow-y: auto;
}

/* Custom scrollbar */
.blog-grid::-webkit-scrollbar {
  width: 8px;
  display: block;
}

.blog-grid::-webkit-scrollbar-track {
  background: #011627;
}

.blog-grid::-webkit-scrollbar-thumb {
  background: #1E2D3D;
  border-radius: 4px;
}

.blog-grid::-webkit-scrollbar-thumb:hover {
  background: #3A5068;
}

.blog-card {
  border: 1px solid #1E2D3D;
  border-radius: 15px;
  background-color: #011221;
  overflow: hidden;
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.blog-card:hover {
  border-color: #607B96;
  transform: translateY(-2px);
}

.blog-card-image {
  height: 160px;
  overflow: hidden;
}

.blog-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.blog-card-body {
  padding: 20px;
}

.blog-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  align-items: center;
}

.blog-date {
  font-family: 'Fira Code Retina';
  font-size: 12px;
  color: #607B96;
}

.blog-tag {
  font-family: 'Fira Code Retina';
  font-size: 11px;
  color: #43D9AD;
  background-color: rgba(67, 217, 173, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.blog-card-title {
  font-family: 'Fira Code Bold';
  font-size: 16px;
  color: #E5E9F0;
  margin-bottom: 8px;
}

.blog-card-excerpt {
  font-family: 'Fira Code Retina';
  font-size: 13px;
  color: #607B96;
  line-height: 1.5;
  margin-bottom: 16px;
}

.blog-read-more {
  font-family: 'Fira Code Retina';
  font-size: 13px;
  color: #FEA55F;
}

@media (max-width: 768px) {
  .blog-grid {
    grid-template-columns: 1fr;
    padding: 20px;
    gap: 1.5rem;
  }
}
</style>
