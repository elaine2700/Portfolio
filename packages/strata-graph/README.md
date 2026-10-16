# strata-graph

An interactive, canvas-based hierarchical force-directed graph blog and knowledge-base engine with zoom levels, folder drill-down, and an editorial Markdown reading modal.

## Overview

`strata-graph` organizes hierarchical directories of Markdown files into an interactive force simulation. Folders are rendered as category clusters with thumbnail images and item counters, while articles are rendered as nodes that open an accessible reading modal on click.

```text
Root Level (/)
├── Design [Folder Node: 3 items]  ──(Click)──>  Drill Down into /design
│   ├── Colors [Folder Node: 2 items]  ──>  Drill Down into /design/colors
│   │   ├── best-palette.md
│   │   └── autumn-colors.md
│   ├── how-to-design-a-webpage.md  ──(Click)──>  Editorial Reading Modal
│   └── the-design-of-everyday.md
└── weekend-recap.md (Article Node)
```

## Features

- **Hierarchical Zoom Levels**: Smooth camera transitions when drilling down into folders or navigating up via breadcrumbs.
- **D3-Force on HTML5 Canvas**: High-performance 2D physics simulation with custom force centering, collision detection, and drag interactions.
- **HiDPI Retina Ready**: Razor-sharp rendering on high-density displays (`devicePixelRatio`).
- **Circular Thumbnail Cropping**: Automatic aspect-ratio cropping of featured images with fallback geometric glyphs.
- **Accessible Editorial Modal**: Markdown reader with keyboard navigation (`Escape`), focus trapping, metadata headers, and tag badges.
- **Customizable CSS Variables**: Fully themeable using standard CSS custom properties (`--sg-*`).
- **Markdown Compiler & CLI**: Automatic scanning of nested folders with frontmatter parsing via `gray-matter` and `markdown-it`.

---

## Installation

```bash
npm install strata-graph
```

Or clone directly into your project:

```text
packages/strata-graph/
```

---

## Content Structure & Authoring Specification

Organize your markdown files in a content folder:

```text
src/content/blog/
├── index.md                              # Root blog metadata & overview
├── weekend-recap.md                      # Root-level article
└── design/                               # Category folder
    ├── index.md                          # (or folder.md / node.md) Category metadata
    ├── how-to-design-a-webpage.md        # Article inside Design
    ├── the-design-of-everyday.md         # Article inside Design
    └── colors/                           # Nested subcategory
        ├── index.md                      # Subcategory metadata
        ├── best-palette.md               # Article inside Colors
        └── autumn-colors.md              # Article inside Colors
```

### Folder Metadata (`index.md` or `folder.md`)
```markdown
---
title: "Design"
description: "Principles, UI/UX aesthetics, color theory, and typography."
thumbnail: "/assets/images/blog/design-thumb.webp"
order: 1
---

Optional introductory notes for the category.
```

### Article Post (`how-to-design-a-webpage.md`)
```markdown
---
title: "How to Design a Webpage"
date: 2026-09-12
thumbnail: "/assets/images/blog/webpage-design.webp"
tags: ["UI", "UX", "Web"]
summary: "A step-by-step guide to modern web layout and visual hierarchy."
---

# How to Design a Webpage

Visual hierarchy is achieved through typographic weight, strict alignment, and structured dividers...
```

---

## CLI Usage

Compile a directory of Markdown files into graph data:

```bash
npx strata-graph build --input src/content/blog --output src/assets/data/blog-graph.json
```

---

## Client Usage

Include the bundled script and stylesheet:

```html
<link rel="stylesheet" href="/assets/strata-graph/strata-graph.css">
<script src="/assets/strata-graph/strata-graph.js"></script>

<div id="blog-graph"></div>

<script>
  const graph = new StrataGraph({
    container: '#blog-graph',
    dataUrl: '/assets/data/blog-graph.json'
  });
</script>
```

---

## CSS Customization Tokens

Override any of these CSS variables to match your design system:

```css
:root {
  /* Canvas & Viewport */
  --sg-canvas-bg: #EAEBD7;
  --sg-canvas-height: 600px;
  --sg-canvas-border: 2px solid #1A1A1A;
  --sg-canvas-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);

  /* Nodes */
  --sg-node-folder-radius: 42px;
  --sg-node-article-radius: 34px;
  --sg-node-border-color: #1A1A1A;
  --sg-node-border-width: 2px;
  --sg-node-folder-border-color: #8EA8B5;
  --sg-node-hover-ring: rgba(140, 166, 142, 0.6);

  /* Badges */
  --sg-badge-bg: #8CA68E;
  --sg-badge-text: #FFFFFF;

  /* Breadcrumbs */
  --sg-breadcrumb-bg: #EAEBD7;
  --sg-breadcrumb-text: #1A1A1A;
  --sg-breadcrumb-active: #8CA68E;
  --sg-breadcrumb-hover: #8EA8B5;

  /* Reading Modal */
  --sg-modal-bg: #EAEBD7;
  --sg-modal-border: 2px solid #1A1A1A;
  --sg-modal-accent: #8EA8B5;
  --sg-modal-accent-green: #8CA68E;
}
```

---

## License

MIT &copy; Elaine Serrano
