<script setup lang="ts">
import usePosts from '../../composables/usePosts'
import useAuthors from '../../composables/useAuthors'

const { currentPost: post } = usePosts()
const { findByName } = useAuthors()
const author = findByName(post.value.author)
</script>

<template>
  <article id="byrdocs-article">
    <div class="flex justify-between items-center mt-2 text-gray-500 group">
      <a
        href="/"
        class="inline-flex items-center font-medium dark:text-white hover:text-[color:var(--vp-c-brand-dark)]"
      >
        <div class="i-bx:arrow-back mr-2 group-hover:-translate-x-1 transition-transform" />
        <span>返回</span>
      </a>
      <span class="bg-primary-100 text-sm font-medium inline-flex items-center rounded">
        <PostIcon :post="post" />
      </span>
    </div>
    <div>
      <h1
        class="text-2xl font-bold tracking-tight text-[color:var(--vp-c-brand-light)] dark:text-[color:var(--vp-c-brand-dark)]"
      >
        <span>{{ post.title }}</span>
      </h1>
      <div class="flex justify-between items-center text-gray-500">
        <PostAuthor :author="author" />
        <div class="text-sm">
          发布时间
          <span v-if="Date.now() - post.date.time < 86400 * 7 * 1000" :title="post.date.string">{{
            post.date.since }}</span>
          <span v-else :title="post.date.since">{{ post.date.string }}</span>
        </div>
      </div>
      <hr>
    </div>
    <slot />
  </article>
</template>

<style>
.vp-doc h2 {
  border-top: none;
}

.vp-doc h1 {
  margin: 24px 0;
}

.vp-doc h2 {
  margin: 12px 0;
}

.vp-doc h3 {
  margin: 6px 0;
}

footer.VPDocFooter {
  display: none;
}

div.content {
  padding-bottom: 0px !important;
}

.VPDoc .vp-doc>div>*:not(#byrdocs-article) {
  display: none;
}

.VPDoc .vp-doc>div>#byrdocs-article~* {
  display: block;
}
</style>
