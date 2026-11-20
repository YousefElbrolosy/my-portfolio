/**
 * Blog posts are Markdown files in content/blog/. The file name is the post's URL slug:
 * content/blog/feedback-grape.md -> /blog/feedback-grape
 *
 * Each file starts with a front-matter block:
 *
 *   ---
 *   title: My post
 *   date: 2025-08-04
 *   tags: [JAX, Python]
 *   heroImage: /images/...      (optional)
 *   excerpt: Shown on the blog index card.
 *   draft: true                 (optional, hides the post)
 *   ---
 *
 * The files are bundled at build time, so nothing is read from disk at runtime.
 */
import { Marked } from 'marked'
import { parse as parseYaml } from 'yaml'

const files = import.meta.glob('~/content/blog/*.md', { query: '?raw', import: 'default', eager: true })

const escapeAttr = (s = '') => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const isExternal = (href = '') => /^https?:\/\//.test(href)

const marked = new Marked({
  gfm: true,
  renderer: {
    // ![caption](/path.png) -> image with a "// caption" label underneath.
    // The caption may contain Markdown links: ![Pendulum ([source](https://...))](/img.png)
    // Optional size: ![caption](/path.png "width=400") or "width=50%" (centered, never wider than the text)
    image({ href, title, text, tokens }) {
      const alt = tokens?.length ? tokens.map((t) => t.text ?? '').join('') : text
      const captionHtml = tokens?.length ? this.parser.parseInline(tokens) : escapeAttr(text)
      const caption = text ? `<figcaption>// ${captionHtml}</figcaption>` : ''

      const width = title?.match(/^\s*width\s*=\s*(\d+(?:\.\d+)?)(px|%)?\s*$/i)
      const style = width ? ` style="max-width: ${width[1]}${width[2] || 'px'}"` : ''
      const titleAttr = title && !width ? ` title="${escapeAttr(title)}"` : ''

      return `<figure${style}><img src="${escapeAttr(href)}" alt="${escapeAttr(alt)}"${titleAttr} loading="lazy">${caption}</figure>`
    },
    // don't wrap a lone image in <p> (a <figure> inside <p> is invalid HTML)
    paragraph({ tokens }) {
      if (tokens.length === 1 && tokens[0].type === 'image') return this.parser.parseInline(tokens)
      return `<p>${this.parser.parseInline(tokens)}</p>\n`
    },
    // external links open in a new tab
    link({ href, title, tokens }) {
      const label = this.parser.parseInline(tokens)
      const t = title ? ` title="${escapeAttr(title)}"` : ''
      const target = isExternal(href) ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${escapeAttr(href)}"${t}${target}>${label}</a>`
    },
  },
})

function parsePost(path, raw) {
  const slug = path.split('/').pop().replace(/\.md$/, '')
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) throw new Error(`[blog] ${slug}.md is missing its front-matter block (--- ... ---)`)

  const meta = parseYaml(match[1]) || {}
  if (!meta.title) throw new Error(`[blog] ${slug}.md needs a "title" in its front matter`)

  return {
    slug,
    title: meta.title,
    date: meta.date instanceof Date ? meta.date.toISOString().slice(0, 10) : String(meta.date ?? ''),
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    heroImage: meta.heroImage || null,
    excerpt: meta.excerpt || '',
    draft: meta.draft === true,
    html: marked.parse(match[2]),
  }
}

const posts = Object.entries(files)
  .map(([path, raw]) => parsePost(path, raw))
  .filter((post) => !post.draft)
  .sort((a, b) => b.date.localeCompare(a.date)) // newest first

/** All published posts, newest first. */
export const getBlogPosts = () => posts

/** One post by slug, or null. */
export const getBlogPost = (slug) => posts.find((post) => post.slug === slug) || null
