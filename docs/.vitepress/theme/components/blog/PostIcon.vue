<script setup lang="ts">
import type { Post } from '../../composables/posts.data'

const props = defineProps<{
  post: Post
}>()

const category: string = props.post.data.category ? props.post.data.category : 'Article'
</script>

<template>
  <div class="flex">
    <div v-if="category === 'Article'" class="i-heroicons-outline-book-open mr-[2px] mt-[2px]" />
    <div v-if="category === 'Tutorial'" class="i-heroicons-outline-academic-cap mr-[2px] mt-[2px]" />
    <div v-if="category === 'Document'" class="i-heroicons-outline-document mr-[2px] mt-[2px]" />
    <div v-if="category === '公告'" class="i-heroicons-outline-megaphone mr-[2px] mt-[2px]" />
    <span>{{ category }}</span>
  </div>
</template>

<style scoped></style>
