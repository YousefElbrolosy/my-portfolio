<template>
    <div id="project" :key="key" class="lg:mx-5">

        <span class="flex text-sm my-3">
            <h3 v-if="index == null" class="text-purplefy font-fira_bold mr-3">Project {{ key + 1 }}</h3>
            <h3 v-else class="text-purplefy font-fira_bold mr-3">Project {{ index + 1 }}</h3>
            <h4 class="font-fira_retina text-menu-text"> // {{ project.title }}</h4>
        </span>

        <div id="project-card" class="flex flex-col">
            <div id="window">
                <div class="absolute flex right-3 top-3">
                <!-- <img v-for="tech in project.tech" :key="tech" :src="'/icons/techs/filled/' + tech + '.svg'" alt="" class="w-6 h-6 mx-1 hover:opacity-75"> -->
                </div>
                <img id="showcase" :src="project.img" alt="" class="">
            </div>

            <div class="project-content pb-8 pt-6 px-6 border-top">
              <p class="project-description text-menu-text font-fira_retina text-sm mb-5">
                {{ project.description }}
                </p>
                <div class="project-actions">
                <a id="view-button" :href="project.url" target="_blank" class="text-white font-fira_retina py-2 px-4 w-fit text-xs rounded-lg">
                    view-project
                </a>
                <NuxtLink
                  v-if="blogSlug"
                  :to="`/blog/${blogSlug}`"
                  id="read-blog-button"
                  class="text-white font-fira_retina py-2 px-4 w-fit text-xs rounded-lg"
                >
                  read-blog
                </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import DevConfig from '~/developer.json'

const { project, key, index } = defineProps(['project', 'key', 'index'])

const blogSlug = computed(() => {
  if (typeof project?.blogSlug === 'string' && project.blogSlug.trim().length > 0) {
    return project.blogSlug
  }

  const title = project?.title
  if (typeof title === 'string' && title.trim().length > 0 && DevConfig.blog?.[title]) {
    return title
  }

  return null
})
</script>

<style scoped>
#project {
  min-width: 400px;
  margin-bottom: 5px;
}

#project-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #1E2D3D;
  background-color: #011221;
  border-radius: 15px;
  max-width: 400px;
  height: 380px;
}

#window {
  max-height: 120px;
  position: relative;
  overflow: hidden;
}

#showcase {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
}

.project-content {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.project-actions {
  display: flex;
  gap: 0.65rem;
  margin-top: auto;
}

.project-description {
  white-space: normal;
  overflow: hidden;
  display: -webkit-box;
  line-clamp: 6;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
}

#view-button {
  margin-top: 0;
}

#read-blog-button {
  background-color: #263b50;
}

#read-blog-button:hover {
  background-color: #33506d;
}

@media (max-width: 768px) {
  #project {
    min-width: 100%;
  }
}

@media (min-width: 768px) {
  #project {
    width: 100%;
    min-width: 100%;
    padding-inline: 5px;
  }
}

@media (min-width: 1350px) {
  #project {
    width: 100%;
    min-width: 100%;
    padding-inline: 20px;
  }
}

</style>