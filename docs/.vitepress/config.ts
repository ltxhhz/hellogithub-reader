import { defineConfig } from 'vitepress'
import AutoSidebar from 'vite-plugin-vitepress-auto-sidebar'

const base = process.env.VITEPRESS_BASE
  ? `${process.env.VITEPRESS_BASE.replace(/\/+$/, '')}/`
  : '/'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base,
  title: 'HelloGitHub Reader',
  description: 'A VitePress Site',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '内容', link: '/contributors' },
      { text: '内容来源', link: 'https://github.com/521xueweihan/HelloGitHub' }
    ],

    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/ltxhhz/hellogithub-reader' }],
    outline: {
      level: [3, 4]
    },
    search: {
      provider: 'local'
    }
  },
  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN'
    },
    en: {
      label: 'English',
      lang: 'en'
      // link: '/content/en'
    }
  },
  vite: {
    assetsInclude: ['**/*.gltf', '**/*.xkcd'],
    plugins: [
      AutoSidebar({
        // 你的 Markdown 文件所在的目录
        // path: 'docs/content'
        ignoreIndexItem: true,
        titleFromFile: true,
        sideBarItemsResolved(data) {
          // console.log(data)
          data.sort((a, b) => (a.link && b.link ? getNumber(b.link) - getNumber(a.link) : 0))
          return data
        }
      })
    ]
  }
})

function getNumber(str: string) {
  return Number(/\d+/.exec(str)?.[0])
}
