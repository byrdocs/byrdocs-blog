<script setup lang='ts'>
import { useData } from 'vitepress'
import type { Post } from '../../composables/posts.data'
import useAuthors from '../../composables/useAuthors'
import PostIcon from './PostIcon.vue'
import PostAuthor from './PostAuthor.vue'

const props = defineProps<{
  post: Post
}>()
const { site } = useData()
const { findByName } = useAuthors()
const author = findByName(props.post.author)
</script>

<template>
  <article
    class="p-6 rounded-lg border border-[color:var(--vp-c-brand-light)] transition-all dark:border-[color:var(--vp-c-brand-dark)] dark:shadow-[color:#181818]"
  >
    <div class="flex justify-between items-center text-gray-500">
      <span
        class="bg-primary-100 text-[color:var(--vp-c-brand-light)] dark:text-[color:var(--vp-c-brand-dark)] text-sm font-medium inline-flex items-center rounded"
      >
        <PostIcon :post="post">
          <span class="text-sm">{{ post.date.since }}</span>
        </posticon></span>
    </div>
    <h2 class="mb-2 text-2xl font-bold tracking-tight text-[color:var(--vp-c-brand-light)] dark:text-[color:var(--vp-c-brand-dark)]">
      <a
        :href="`${site.base}blog${post.href}`"
      >{{ post.title }}</a>
    </h2>
    <div class="mb-5 font-light" v-html="post.excerpt" />
    <div class="flex justify-between items-center">
      <PostAuthor :author="author" />
      <a
        :href="`${site.base}blog${post.href}`"
        class="inline-flex items-center font-medium hover:text-[color:var(--vp-c-brand-dark)]"
      >
        阅读更多
        <svg class="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
    </div>
  </article>
</template>

<style scoped>
.vp-doc h1, h2, h3, hr {
  margin: 0px 0 0 0;
  padding-top: 0px;
}
</style>
