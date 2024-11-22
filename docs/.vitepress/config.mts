import Unocss from 'unocss/vite'
import { defineConfig as _defineConfig } from 'vitepress'
import footnote from 'markdown-it-footnote'

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

export default defineConfig({
  description: 'Blog included. Built on top of VitePress and UnoCSS.',
  markdown: {
    headers: {
      level: [0, 0],
    },
    config: (md) => {
      md.use(footnote)
    },
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
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '无法找到',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
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
    ],
  },
  title: 'BYR Docs Blog',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo_512.png' }],
    ['link', { rel: 'apple-touch-icon', type: 'image/png', href: '/logo_512.png' }],
    ['meta', { name: 'description', content: 'BYR Docs 的最新动态。BYR Docs：北京邮电大学资料分享平台，旨在使校内学生更方便地获取与北邮课程有关的教育资源，包括电子书籍、考试题目和复习资料等。' }],
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
