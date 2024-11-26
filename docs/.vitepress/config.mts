import fs, { createWriteStream } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { Feed } from 'feed'
import matter from 'gray-matter'
import footnote from 'markdown-it-footnote'
import { SitemapStream } from 'sitemap'
import Unocss from 'unocss/vite'
import { defineConfig as _defineConfig, createMarkdownRenderer } from 'vitepress'

type Config = ReturnType<typeof _defineConfig> & {
  themeConfig: {
    blog: {
      title: string
      description: string
    }
  }
}

function defineConfig(config: Config) {
  return _defineConfig(config)
}

const pages: Array<{
  title: string
  excerpt: string
  url: string
  date: string
  author: string
  tags?: string[]
}> = []

const links: Array<{ url: string, lastmod: number }> = []

const description = 'BYR Docs 的最新动态。BYR Docs：北京邮电大学资料分享平台，旨在使校内学生更方便地获取与北邮课程有关的教育资源，包括电子书籍、考试题目和复习资料等。'

export default defineConfig({
  description,
  lastUpdated: true,
  markdown: {
    headers: {
      level: [0, 0],
    },
    config: (md) => {
      md.use(footnote)
    },
  },
  async buildEnd({ outDir }) {
    const md = (await createMarkdownRenderer(process.cwd()))

    const feed = new Feed({
      title: 'BYR Docs Blog',
      description,
      id: 'https://blog.byrdocs.org/',
      link: 'https://blog.byrdocs.org/',
      image: 'https://byrdocs.org/og.png',
      favicon: 'https://blog.byrdocs.org/logo_512.png',
      copyright: `All rights reserved ${new Date().getFullYear()}, BYR Docs`,
      updated: pages.map(page => new Date(page.date)).reduce((a, b) => a > b ? a : b),
      generator: 'BYR Docs Blog Feed',
      feedLinks: {
        json: 'https://blog.byrdocs.org/feed.json',
        atom: 'https://blog.byrdocs.org/feed.atom',
        rss: 'https://blog.byrdocs.org/feed.xml',
      },
      author: {
        name: 'BYR Docs',
        email: 'contact@byrdocs.org',
        link: 'https://github.com/byrdocs',
      },
    })

    pages.forEach((page) => {
      feed.addItem({
        title: page.title,
        id: page.url,
        link: page.url,
        date: new Date(page.date),
        description: page.excerpt && md.render(page.excerpt),
        author: [{ name: page.author }],
        extensions: page.tags && [
          {
            name: 'tags',
            objects: page.tags,
          },
        ],
      })
    })

    fs.writeFileSync(
      path.join(outDir, 'feed.json'),
      feed.json1(),
    )
    fs.writeFileSync(
      path.join(outDir, 'feed.atom'),
      feed.atom1(),
    )
    fs.writeFileSync(
      path.join(outDir, 'feed.xml'),
      feed.rss2(),
    )

    const sitemap = new SitemapStream({
      hostname: 'https://blog.byrdocs.org',
    })
    const writeStream = createWriteStream(path.join(outDir, 'sitemap.xml'))
    sitemap.pipe(writeStream)
    links.forEach(link => sitemap.write(link))
    sitemap.end()
    await new Promise(r => writeStream.on('finish', r))
  },
  transformHtml: (_, id, ctx) => {
    const relativeUrl = ctx.pageData.relativePath.replace(/(^|\/)(.*?)\.md$/, '$2.html')
    if (!/[\\/]404\.html$/.test(id)) {
      links.push({
        url: ctx.pageData.relativePath.replace(/((^|\/)index)?\.md$/, '$2'),
        lastmod: ctx.pageData.lastUpdated || Date.now(),
      })
    }
    if (ctx.page !== '404.md' && ctx.pageData.relativePath.startsWith('blog/posts/')) {
      const src = path.join(process.cwd(), 'docs', ctx.page)
      const { data, excerpt } = matter(fs.readFileSync(src, 'utf-8'), { excerpt: true })
      pages.push({
        ...data,
        excerpt: excerpt || '...',
        url: new URL(relativeUrl, 'https://blog.byrdocs.org').toString(),
      } as any)
    }
  },
  themeConfig: {
    footer: {
      message: 'BYR Docs Blog',
      copyright: 'Copyright © 2024 BYR Docs',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/byrdocs' },
    ],
    blog: {
      title: 'BYR Docs Blog',
      description: 'BYR Docs 的最新动态',
    },
    outline: {
      label: '页面导航',
    },
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色主题',
    darkModeSwitchTitle: '切换到深色主题',
    notFound: {
      title: '找不到此页面',
      linkText: '返回主页',
      quote: '',
    },
    search: {
      provider: 'local',
      options: {
        detailedView: true,
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            displayDetails: '显示详细列表',
            resetButtonTitle: '重置搜索',
            backButtonTitle: '关闭搜索',
            noResultsText: '没有结果',
            footer: {
              selectText: '选择',
              selectKeyAriaLabel: '输入',
              navigateText: '导航',
              navigateUpKeyAriaLabel: '上箭头',
              navigateDownKeyAriaLabel: '下箭头',
              closeText: '关闭',
              closeKeyAriaLabel: 'esc',
            },
          },
        },
      },
    },
    docFooter: { prev: '上一篇', next: '下一篇' },
    nav: [
      { text: '主页', link: '/' },
      { text: '关于', link: 'https://byrdocs.org/about' },
      { text: '主站', link: 'https://byrdocs.org' },
      { text: '订阅', link: '/feed.html' },
    ],
  },
  title: 'BYR Docs Blog',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo_512.png' }],
    ['link', { rel: 'apple-touch-icon', type: 'image/png', href: '/logo_512.png' }],
    ['meta', { name: 'description', content: description }],
    ['meta', { name: 'keywords', content: '北邮, 北京邮电大学, 资料, 电子书籍, 考试题目, 复习资料' }],
    ['meta', { name: 'author', content: 'BYR Docs' }],
  ],
  vite: {
    plugins: [
      Unocss({
        configFile: '../../unocss.config.ts',
      }),
    ],
  },
})
