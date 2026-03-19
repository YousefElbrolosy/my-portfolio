<template>
  <main class="page" v-if="post">
    <div id="mobile-page-title">
      <h2>_blog</h2>
    </div>

    <!-- Left sidebar (desktop) -->
    <div id="page-menu" class="w-full flex-col border-right font-fira_regular text-menu-text hidden lg:flex">
      <div id="section-content-title" class="flex items-center min-w-full border-bot">
        <img src="/icons/arrow.svg" class="section-arrow mx-3 open" alt="">
        <p class="font-fira_regular text-white text-sm">post-info</p>
      </div>
      <div class="p-5">
        <p class="text-xs mb-1 text-menu-text">// date</p>
        <p class="text-white text-sm mb-4 font-fira_retina">{{ post.date }}</p>

        <p class="text-xs mb-2 text-menu-text">// tags</p>
        <div class="flex flex-wrap gap-1 mb-6">
          <span v-for="tag in post.tags" :key="tag" class="post-tag">{{ tag }}</span>
        </div>

        <NuxtLink to="/blog" class="back-link">
          &lt;- back-to-blog
        </NuxtLink>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex flex-col w-full overflow-hidden">

      <!-- Tab bar (desktop) -->
      <div class="tab-height w-full hidden lg:flex border-bot items-center">
        <div class="flex items-center border-right h-full">
          <p class="font-fira_regular text-menu-text text-sm px-3">{{ post.title }}</p>
          <NuxtLink to="/blog">
            <img src="/icons/close.svg" alt="" class="m-3 hover:cursor-pointer">
          </NuxtLink>
        </div>
      </div>

      <!-- Mobile back link -->
      <div class="lg:hidden px-5 py-3">
        <NuxtLink to="/blog" class="back-link">
          &lt;- back-to-blog
        </NuxtLink>
      </div>

      <!-- Article -->
      <article class="blog-article">

        <div class="article-hero" v-if="post.heroImage">
          <img :src="post.heroImage" :alt="post.title" />
        </div>

        <h1 class="article-title">{{ post.title }}</h1>

        <!-- Mobile meta -->
        <div class="article-meta lg:hidden">
          <span class="meta-date">{{ post.date }}</span>
          <span v-for="tag in post.tags" :key="tag" class="post-tag">{{ tag }}</span>
        </div>

      <div
        v-for="(section, i) in post.sections"
        :key="i"
        class="article-section"
      >
        <h2 class="section-heading">{{ section.heading }}</h2>
        <div class="section-content" v-html="section.content"></div>
        <div v-if="section.image" class="section-image">
          <img :src="section.image" :alt="section.imageCaption || ''" />
          <span v-if="section.imageCaption" class="image-caption">
            // {{ section.imageCaption }}
          </span>
        </div>
      </div>

      </article>
    </div>
  </main>

  <!-- 404 fallback -->
  <main class="page" v-else>
    <div class="flex items-center justify-center w-full h-full">
      <div class="text-center">
        <p class="font-fira_retina text-menu-text text-xl mb-4">404 // post not found</p>
        <NuxtLink to="/blog" class="back-link">
          &lt;- back-to-blog
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import DevConfig from '~/developer.json'

const route = useRoute()
const slug = route.params.slug
const post = ref(DevConfig.blog?.[slug] || null)
</script>

<style scoped>
.tab-height {
  min-height: 35px;
}

.back-link {
  font-family: 'Fira Code Retina';
  font-size: 13px;
  color: #FEA55F;
  text-decoration: none;
  transition: opacity 0.2s;
}

.back-link:hover {
  opacity: 0.8;
}

.post-tag {
  font-family: 'Fira Code Retina';
  font-size: 11px;
  color: #43D9AD;
  background-color: rgba(67, 217, 173, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.blog-article {
  padding: 40px;
  overflow-y: auto;
  max-width: 800px;
}

/* Custom scrollbar */
.blog-article::-webkit-scrollbar {
  width: 8px;
  display: block;
}

.blog-article::-webkit-scrollbar-track {
  background: #011627;
}

.blog-article::-webkit-scrollbar-thumb {
  background: #1E2D3D;
  border-radius: 4px;
}

.blog-article::-webkit-scrollbar-thumb:hover {
  background: #3A5068;
}

.article-hero {
  border: 1px solid #1E2D3D;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 2rem;
  max-height: 300px;
}

.article-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-title {
  font-family: 'Fira Code Bold';
  font-size: 28px;
  color: #E5E9F0;
  margin-bottom: 1rem;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 2rem;
  align-items: center;
}

.meta-date {
  font-family: 'Fira Code Retina';
  font-size: 12px;
  color: #607B96;
}

.article-section {
  margin-bottom: 2.5rem;
}

.section-heading {
  font-family: 'Fira Code SemiBold';
  font-size: 20px;
  color: #E5E9F0;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #1E2D3D;
}

.section-content {
  font-family: 'Fira Code Retina';
  font-size: 14px;
  color: #607B96;
  line-height: 1.7;
}

.section-content :deep(p) {
  margin-bottom: 1rem;
}

.section-image {
  margin-top: 1.5rem;
  border: 1px solid #1E2D3D;
  border-radius: 12px;
  overflow: hidden;
}

.section-image img {
  width: 100%;
  display: block;
}

.image-caption {
  display: block;
  font-family: 'Fira Code Retina';
  font-size: 12px;
  color: #607B96;
  padding: 10px 15px;
  background-color: #011221;
  border-top: 1px solid #1E2D3D;
}

@media (max-width: 768px) {
  .blog-article {
    padding: 20px;
  }

  .article-title {
    font-size: 22px;
  }

  .section-heading {
    font-size: 17px;
  }
}
</style>
