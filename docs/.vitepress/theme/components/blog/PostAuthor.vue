<script setup lang="ts">
import { useData } from 'vitepress'
import type { Author } from '../../composables/useAuthors'

const _props = defineProps<{
  author: Author
}>()
</script>

<template>
  <div v-if="author" class="flex items-center space-x-4">
    <img
      class="w-7 h-7 rounded-full"
      :src="author.data.avatar"
      :alt="author.name"
    >
    <a
      :href="author.href"
      target="_blank"
      class="inline-flex items-center font-medium hover:text-[color:var(--vp-c-brand-dark)]"
    ><span class="font-medium dark:text-white">
      {{ author.name }}
    </span>
    </a>
  </div>
  <div v-else />
</template>

<style scoped></style>
