<script setup lang="ts">
defineProps<{
  sender: string
  isBot?: boolean
  avatar?: string
  replyingTo?: string
}>()
</script>

<template>
  <div class="my-4">
    <div class="flex items-center gap-2 mb-1.5">
      <img
        v-if="avatar"
        :src="avatar"
        class="w-6 h-6 rounded-full shrink-0 object-cover"
      />
      <span
        v-else
        class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs text-white shrink-0 font-medium"
        :class="isBot ? 'bg-[var(--vp-c-brand)]' : 'bg-gray-400 dark:bg-gray-500'"
      >
        {{ sender[sender.length - 1] }}
      </span>
      <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
        {{ sender }}
      </span>
    </div>
    <div class="ml-8">
      <div
        v-if="replyingTo"
        class="flex items-center gap-1.5 mb-1 text-xs text-gray-400 dark:text-gray-500 truncate"
      >
        <span class="shrink-0 i-bx:reply" />
        <span class="truncate">{{ replyingTo }}</span>
      </div>
      <div
        class="rounded-lg px-4 py-2.5 text-sm leading-relaxed"
        :class="isBot
          ? 'bg-blue-50 dark:bg-blue-900/20 border-l-[3px] border-[var(--vp-c-brand)]'
          : 'bg-gray-100 dark:bg-gray-800'"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
