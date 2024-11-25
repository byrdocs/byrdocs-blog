import type { Ref } from 'vue'
import { useData, useRoute } from 'vitepress'
import { computed, ref } from 'vue'

export interface Author {
  name: string
  href: string
  excerpt?: string
  data: Record<string, any>
}

const data: Author[] = [
  {
    name: 'cppHusky',
    href: 'https://github.com/cppHusky/',
    data: {
      avatar: 'https://avatars.githubusercontent.com/u/88606244?v=4',
    },
  },
]

export { data }

export default () => {
  const { site } = useData()

  const allAuthors: Ref<Author[]> = ref(data)

  const route = useRoute()

  const path = route.path

  function findByName(name: string): Author {
    const author = allAuthors.value.find(p => p.name === name)
    if (!author)
      throw new Error(`Author with name ${name} not found`)
    return author
  }

  function findCurrentIndex() {
    return allAuthors.value.findIndex(p => `${site.value.base}blog${p.href}` === route.path)
  }

  const currentAuthor = computed(() => allAuthors.value[findCurrentIndex()])
  const nextAuthor = computed(() => allAuthors.value[findCurrentIndex() - 1])
  const prevAuthor = computed(() => allAuthors.value[findCurrentIndex() + 1])

  return { allAuthors, currentAuthor, nextAuthor, prevAuthor, findByName, path }
}
