<script setup lang="ts">
import type { Post } from '../../composables/posts.data'

const props = defineProps<{
  post: Post
}>()

const category: string = props.post.data.category ? props.post.data.category : 'Article'
</script>

<template>
  <div class="flex">
    <div v-if="category === 'Article'" class="i-heroicons-outline-book-open mr-[3px] mt-[2px]" />
    <div v-if="category === 'Tutorial'" class="i-heroicons-outline-academic-cap mr-[3px] mt-[2px]" />
    <div v-if="category === 'Document'" class="i-heroicons-outline-document mr-[3px] mt-[2px]" />
    <div v-if="category === '公告'" class="i-heroicons-outline-megaphone mr-[3px] mt-[2px]" />
    <div v-if="category === '更新'" class="i-heroicons-outline-arrow-up-circle mr-[3px] mt-[2px]" />
    <div v-if="category === '杂记'" class="i-heroicons-outline-chat-bubble-left-ellipsis mr-[3px] mt-[2px]" />
    <span>{{ category }}</span>
  </div>
</template>

<style scoped></style>
