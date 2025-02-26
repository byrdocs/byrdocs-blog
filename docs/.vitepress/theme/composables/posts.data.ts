import type { MarkdownRenderer } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { formatDistance } from 'date-fns'
import { zhCN } from 'date-fns/locale/zh-CN'
import { createMarkdownRenderer } from 'vitepress'
import useBlogFile from './useBlogFile'

let md: MarkdownRenderer
const { folderDir, readFrontMatter } = useBlogFile()

const dir = folderDir('posts')

export interface Post {
  title: string
  author: string
  href: string
  date: {
    time: number
    string: string
    since: string
  }
  excerpt: string | undefined
  data: Record<string, any>
}

declare const data: Post[]
export { data }

function getMarkdownFiles(directory: string, baseDir: string): string[] {
  const entries = fs.readdirSync(directory, { withFileTypes: true })

  return entries.flatMap((entry) => {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory())
      return getMarkdownFiles(fullPath, baseDir)
    else if (entry.isFile() && fullPath.endsWith('.md'))
      return path.relative(baseDir, fullPath)
    return []
  })
}

async function load(): Promise<Post[]>
async function load() {
  // eslint-disable-next-line node/prefer-global/process
  md = md || (await createMarkdownRenderer(process.cwd()))

  const markdownFiles = getMarkdownFiles(dir, dir)

  return markdownFiles
    .map((file: string) => getPost(file, dir))
    .sort((a, b) => b.date.time - a.date.time)
}

export default {
  watch: path.join(dir, '*.md'),
  load,
}

const cache = new Map()

function getPost(file: string, postDir: string): Post {
  const fullPath = path.join(postDir, file)
  const timestamp = fs.statSync(fullPath).mtimeMs

  const { data, excerpt } = readFrontMatter(file, postDir, cache)

  const post: Post = {
    title: data.title,
    author: data.author ? data.author : 'Unknown',
    href: `/posts/${file.replace(/\.md$/, '.html')}`,
    date: formatDate(data.date),
    excerpt: excerpt && md.render(excerpt),
    data,
  }

  cache.set(fullPath, {
    timestamp,
    post,
  })
  return post
}

function formatDate(date: string | Date): Post['date'] {
  if (!(date instanceof Date))
    date = new Date(date)

  return {
    time: +date,
    string: date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    since: formatDistance(date, new Date(), { addSuffix: true, locale: zhCN }),
  }
}
