---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Hello GitHub Reader'
  text: '使用 VitePress 展示'
  tagline: 基于官方 Markdown 的 HelloGitHub 静态浏览站
  actions:
    - theme: brand
      text: 开始阅读
      link: /contributors
    # - theme: alt
    #   text: API Examples
    #   link: /api-examples
features:
  - icon: 😡
    title: 由于我总是访问不了官方站，所以自己部署一个
    # details: Lorem ipsum...
  - icon:
      src: https://a.favicon.im/hellogithub.com
    title: 内容来源
    details: Hello GitHub 官方仓库
  - icon:
      dark: https://github.githubassets.com/favicons/favicon-dark.svg
      light: https://github.githubassets.com/favicons/favicon.svg
    title: 自动构建更新
    details: 每月28日 早6点(UTC)
---

<script setup>
import { useData } from 'vitepress'
import { VPLink } from 'vitepress/theme-without-fonts'
import { computed } from 'vue'

const { site, theme } = useData()

const start = [2016, 4]

// 保持原始顺序：倒序，最新在前
const arr = computed(() => theme.value.sidebar['/en/'][0].items)

// ascIndex: 0 → 2016.4
function formatDate(ascIndex) {
  const totalMonths = start[1] - 1 + ascIndex
  const year = start[0] + Math.floor(totalMonths / 12)
  const month = (totalMonths % 12) + 1
  return `${year}.${month}`
}
</script>

<div class="ep-grid">
  <VPLink
    v-for="(item, index) in arr"
    :key="index"
    theme="alt"
    class="ep-grid__item"
    :href="site.localeIndex === 'root'
      ? item.link.replace('/en', '')
      : item.link"
  >
    <span class="ep-grid__title">第 {{ arr.length - index }} 期</span>
    <Badge type="tip" :text="formatDate(arr.length - 1 - index)" />
  </VPLink>
</div>

<style scoped>
.ep-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin: 16px 0;
}

/* 用 .ep-grid a.xxx 提高优先级，盖过 VPLink 自带样式 */
.ep-grid a.ep-grid__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 8px;

  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg);
  text-decoration: none;

  transition: border-color 0.2s, background-color 0.2s, transform 0.2s;
}

.ep-grid a.ep-grid__item:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-soft);
  transform: translateY(-2px);
}

.ep-grid__title {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  white-space: nowrap;
}

/* 窄屏降列数 */
@media (max-width: 768px) {
  .ep-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>