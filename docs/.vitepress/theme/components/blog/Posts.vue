<script setup lang="ts">
import { useData } from 'vitepress'
import usePosts from '../../composables/usePosts'

const { allPosts: posts } = usePosts()

const { theme } = useData()
</script>

<template>
  <div class="mx-auto max-w-screen-xl py-16 lg:px-6">
    <div class="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
      <img src="/logo_512.png" alt="Logo" class="mx-auto w-24 h-24">
      <h2>
        {{ theme.blog?.title }}
      </h2>
      <p class="font-light sm:text-xl text-[color:var(--vp-c-text-light-1)] dark:text-[color:var(--vp-c-text-dark-1)]">
        {{ theme.blog?.description }}
      </p>
    </div>
    <div class="p-2 grid gap-6 lg:grid-cols-2">
      <div v-for="post of posts" :key="post.href">
        <Post :post="post" />
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 {
  margin-bottom: 1rem;
  font-size: 1.875rem;
  font-weight: 800;
  letter-spacing: -0.01562em;
  color: var(--vp-c-brand-light);
}

@media (min-width: 1024px) {
  h2 {
    font-size: 2.25rem;
  }
}

@media (prefers-color-scheme: dark) {
  h2 {
    color: var(--vp-c-brand-dark);
  }
}
</style>
