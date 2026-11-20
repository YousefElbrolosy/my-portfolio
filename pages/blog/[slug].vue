<template>
  <main class="page" v-if="post">
    <div id="mobile-page-title">
      <h2>_blog</h2>
    </div>

    <!-- Left sidebar (desktop) -->
    <div id="page-menu" class="w-full flex-col border-right font-fira_regular text-menu-text hidden lg:flex">
      <div id="section-content-title" class="flex items-center min-w-full border-bot">
        <img src="/icons/arrow.svg" class="section-arrow mx-3 open" alt="">
        <p class="font-fira_regular text-fg text-sm">post-info</p>
      </div>
      <div class="p-5">
        <p class="text-xs mb-1 text-menu-text">// date</p>
        <p class="text-fg text-sm mb-4 font-fira_retina">{{ post.date }}</p>

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

        <!-- rendered from content/blog/<slug>.md -->
        <div class="article-body" v-html="post.html"></div>

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
const route = useRoute()
const post = computed(() => getBlogPost(route.params.slug))
</script>

<style scoped>
.tab-height {
  min-height: 35px;
}

.back-link {
  font-family: 'Fira Code Retina';
  font-size: 13px;
  color: var(--c-orange);
  text-decoration: none;
  transition: opacity 0.2s;
}

.back-link:hover {
  opacity: 0.8;
}

.post-tag {
  font-family: 'Fira Code Retina';
  font-size: 11px;
  color: var(--c-green);
  background-color: rgba(var(--c-green-rgb), 0.1);
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
  background: var(--c-bg);
}

.blog-article::-webkit-scrollbar-thumb {
  background: var(--c-border);
  border-radius: 4px;
}

.blog-article::-webkit-scrollbar-thumb:hover {
  background: var(--c-scroll-hover);
}

.article-hero {
  border: 1px solid var(--c-border);
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
  color: var(--c-strong);
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
  color: var(--c-muted);
}

/* Markdown body (v-html, so styles go through :deep) */
.article-body {
  font-family: 'Fira Code Retina';
  font-size: 14px;
  color: var(--c-muted);
  line-height: 1.7;
}

.article-body :deep(h2) {
  font-family: 'Fira Code SemiBold';
  font-size: 20px;
  color: var(--c-strong);
  margin: 2.5rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--c-border);
}

.article-body :deep(h2:first-child) {
  margin-top: 0;
}

.article-body :deep(h3) {
  font-family: 'Fira Code SemiBold';
  font-size: 16px;
  color: var(--c-strong);
  margin: 1.75rem 0 0.75rem;
}

.article-body :deep(p),
.article-body :deep(ul),
.article-body :deep(ol),
.article-body :deep(blockquote),
.article-body :deep(pre),
.article-body :deep(table) {
  margin-bottom: 1rem;
}

.article-body :deep(a) {
  color: var(--c-strong);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.article-body :deep(a:hover) {
  color: var(--c-green);
}

.article-body :deep(strong) {
  color: var(--c-strong);
}

.article-body :deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
}

.article-body :deep(ol) {
  list-style: decimal;
  padding-left: 1.5rem;
}

.article-body :deep(li) {
  margin-bottom: 0.25rem;
}

.article-body :deep(blockquote) {
  border-left: 2px solid var(--c-orange);
  padding-left: 1rem;
  font-style: italic;
}

.article-body :deep(code) {
  font-family: 'Fira Code Regular';
  font-size: 13px;
  color: var(--c-green);
  background-color: rgba(var(--c-green-rgb), 0.1);
  padding: 1px 5px;
  border-radius: 4px;
}

.article-body :deep(pre) {
  background-color: var(--c-bg-sunken);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
}

.article-body :deep(pre code) {
  color: var(--c-strong);
  background: none;
  padding: 0;
}

.article-body :deep(hr) {
  border: 0;
  border-top: 1px solid var(--c-border);
  margin: 2rem 0;
}

.article-body :deep(table) {
  border-collapse: collapse;
  width: 100%;
}

.article-body :deep(th),
.article-body :deep(td) {
  border: 1px solid var(--c-border);
  padding: 6px 10px;
  text-align: left;
}

.article-body :deep(th) {
  color: var(--c-strong);
}

/* ![caption](/image.png) */
.article-body :deep(figure) {
  margin: 1.5rem auto;
  border: 1px solid var(--c-border);
  border-radius: 12px;
  overflow: hidden;
}

.article-body :deep(figure img) {
  width: 100%;
  display: block;
}

.article-body :deep(figcaption) {
  font-size: 12px;
  color: var(--c-muted);
  padding: 10px 15px;
  background-color: var(--c-bg-sunken);
  border-top: 1px solid var(--c-border);
}

@media (max-width: 768px) {
  .blog-article {
    padding: 20px;
  }

  .article-title {
    font-size: 22px;
  }

  .article-body :deep(h2) {
    font-size: 17px;
  }
}
</style>
