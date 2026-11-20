# `content/`

## Blog posts

Each post is a Markdown file in `content/blog/`. The file name becomes the URL:
`content/blog/my-post.md` → `/blog/my-post`.

Start the file with a front-matter block, then write the post in normal Markdown:

```md
---
title: "My post title"
date: 2026-01-15
tags: [Python, Quantum Computing]
heroImage: /images/blog/my-post/hero.png   # optional
excerpt: "One or two sentences shown on the blog index card."
draft: true                                 # optional, hides the post
---

## First section

A paragraph with **bold**, `inline code` and a [link](https://example.com).

![Caption shown under the image](/images/blog/my-post/diagram.png)

## Second section

- lists, > quotes, tables and fenced code blocks all work
```

Notes:

- Put images in `public/` and reference them from `/` (e.g. `public/images/x.png` → `/images/x.png`).
  Files in `assets/` are not served to the browser.
- To make an image smaller, add a width after the path: `![caption](/images/x.png "width=50%")` or `"width=400"` (pixels).
  Smaller images are centered. Captions can contain links: `![photo ([source](https://...))](/images/x.png)`.
- For a diagram that's a PDF, export it to SVG or PNG and use it as an image, e.g.
  `pdftocairo -svg diagram.pdf public/images/blog/my-post/diagram.svg`
  (embedded PDFs don't display on most phones). To offer the PDF itself, put it in `public/` and link to it:
  `[download the PDF](/files/diagram.pdf)`.
- Use `##` for section headings; the post title comes from the front matter.
- Quote `title` and `excerpt` if they contain a colon (`:`).
- Posts are listed newest first by `date` (format `YYYY-MM-DD`).
- To link a project or spotlight to a post, set its `blogSlug` in `developer.json` to the file name without `.md`.

The parsing lives in `utils/blog.js`.
