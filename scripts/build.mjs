import fs from 'fs/promises'
import { EOL } from 'os'

import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const __filename = fileURLToPath(import.meta.url)

const root = path.join(__dirname, '..')

const outDir = path.join(root, 'docs')
const assetOutDir = path.join(root, 'docs/assets')

const replaceDict = [
  ['https://raw.githubusercontent.com/521xueweihan/img_logo/master/', '/assets/'],
  ['https://raw.githubusercontent.com/521xueweihan/img/master/hellogithub/', '/assets/img/'],
  ['https://raw.githubusercontent.com/521xueweihan/img2/master/hellogithub/', '/assets/img2/'],
  ['https://raw.githubusercontent.com/521xueweihan/img3/master/hellogithub/', '/assets/img3/'],
  ['https://raw.githubusercontent.com/521xueweihan/img4/master/hellogithub/', '/assets/img4/'],
  ['https://hellogithub.com/periodical/statistics/click?target=', ''],
  [/https:\/\/github\.com\/521xueweihan\/HelloGitHub\/blob\/master([/\w]+)\.md/g, '$1'],
  [/^(\d+、)/gm, '#### $1'],
  [/(?:^\s*\-.+?)<(.+?)>/gm, line => line.replace(/<([^>]*)>/g, '&lt;$1&gt;')]
]

const assetMap = [
  ['source/img_logo/logo', 'logo'],
  ['source/img/hellogithub', 'img'],
  ['source/img2/hellogithub', 'img2'],
  ['source/img3/hellogithub', 'img3'],
  ['source/img4/hellogithub', 'img4']
]

const contentDir = path.join(root, './source/HelloGitHub/content/')

const contentList = (await fs.readdir(contentDir)).filter(e => e != 'en')
const contentListEn = await fs.readdir(path.join(contentDir, 'en'))

/**
 * @param {string} text
 */
function replace(text) {
  replaceDict.forEach(item => {
    if (item[0] instanceof RegExp) {
      text = text.replace(item[0], item[1])
    } else {
      text = text.replaceAll(item[0], item[1])
    }
  })
  return text
}

/**
 * @param {string} file
 */
async function processMarkdown(file) {
  const s = replace((await fs.readFile(file)).toString())
  let prefix = ''
  const arr = file.split(/[\\/]/)
  const filename = arr.at(-1)
  if (filename === 'contributors.md') {
    prefix = `# 贡献者${EOL}`
  }
  await fs.writeFile(path.join(outDir, `${arr.at(-2) === 'en' ? 'en/' : ''}${filename}`), prefix + s)
}

async function processAssets() {
  await Promise.all(assetMap.map(([source, target]) => syncDirectory(
    path.join(root, source),
    path.join(assetOutDir, target)
  )))
}

async function syncDirectory(sourceDir, targetDir) {
  await ensureDirectory(targetDir)

  const [sourceEntries, targetEntries] = await Promise.all([
    fs.readdir(sourceDir, { withFileTypes: true }),
    fs.readdir(targetDir, { withFileTypes: true })
  ])
  const staleTargetNames = new Set(targetEntries.map(entry => entry.name))

  await Promise.all(sourceEntries.map(async entry => {
    const sourcePath = path.join(sourceDir, entry.name)
    const targetPath = path.join(targetDir, entry.name)
    staleTargetNames.delete(entry.name)

    if (entry.isDirectory()) {
      await syncDirectory(sourcePath, targetPath)
      return
    }

    if (entry.isFile()) {
      await copyFileIfChanged(sourcePath, targetPath)
    }
  }))

  await Promise.all([...staleTargetNames].map(name => fs.rm(path.join(targetDir, name), {
    recursive: true,
    force: true
  })))
}

async function ensureDirectory(dir) {
  try {
    const stat = await fs.stat(dir)
    if (stat.isDirectory()) {
      return
    }
    await fs.rm(dir, { recursive: true, force: true })
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }
  }

  await fs.mkdir(dir, { recursive: true })
}

async function copyFileIfChanged(sourcePath, targetPath) {
  const sourceStat = await fs.stat(sourcePath)
  const targetStat = await getTargetFileStat(targetPath)

  if (!shouldCopyFile(sourceStat, targetStat)) {
    return
  }

  await fs.copyFile(sourcePath, targetPath)
}

async function getTargetFileStat(file) {
  try {
    const stat = await fs.stat(file)
    if (stat.isFile()) {
      return stat
    }

    await fs.rm(file, { recursive: true, force: true })
    return undefined
  } catch (error) {
    if (error.code === 'ENOENT') {
      return undefined
    }
    throw error
  }
}

function shouldCopyFile(sourceStat, targetStat) {
  return !targetStat ||
    sourceStat.size !== targetStat.size ||
    sourceStat.mtimeMs > targetStat.mtimeMs
}

await fs.mkdir(path.join(outDir, 'en'), { recursive: true })
await fs.mkdir(assetOutDir, { recursive: true })

await processAssets()

await Promise.all([...contentList.map(e => processMarkdown(path.join(contentDir, e))), ...contentListEn.map(e => processMarkdown(path.join(contentDir, 'en', e)))])
