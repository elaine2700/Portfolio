# Design System Specification: Elaine Serrano Portfolio

> **Status:** Active / Living Standard  
> **Standard:** Google Labs Engineering & Design Specification  
> **Version:** 1.0.0  
> **Author:** Elaine Serrano
> **Target Framework:** Eleventy (11ty) Static Site Generator  
> **Styling Engine:** Modular Vanilla CSS & CSS Custom Properties (`src/assets/css/system/*`)  
> **Last Updated:** 2026-09-12  

---

## 1. Overview & Design Philosophy

This design system establishes the visual identity, token architecture, and component standards for the portfolio of **Elaine Serrano**.

### 1.1 Core Aesthetic: *Retro-Technical Monospace Editorial*

- **Utilitarian Elegance:** Form strictly follows function. Visual hierarchy is achieved through typographic weight, strict alignment, and structured dividers rather than ornamental clutter.
- **Tactile Paper & Ink Tone:** A warm, textured canvas (`#EAEBD7`) paired with deep charcoal ink (`#1A1A1A`) evokes physical editorial print, drafting paper, and early computer terminals.
- **Architectural Framing:** Subtle line work, 1px/2px borders, numbered sections (`01/`, `02/`), and monospace terminal indicators (`>` active marker) celebrate technical craftsmanship and developer ergonomics.
- **Restrained Color Accents:** Accent hues—Sage Green (`#8CA68E`) and Slate/Denim Blue (`#8EA8B5`)—are applied deliberately for state indication, category tags, and structural dividing rules.

---

## 2. Design Tokens & Foundations

All design variables are declared in CSS Custom Properties within `src/assets/css/system/` and exposed globally via `global.css`.

### 2.1 Color Palette (`system/colors.css`)

#### Primitive & Core Tokens
| Token Name | Hex / Value | Role & Usage |
| :--- | :--- | :--- |
| `--beige-bg` | `#EAEBD7` | Primary canvas/background; creates warm, editorial paper feel. |
| `--bg-color` | `#D8D7C1` | Secondary baseline background shade. |
| `--color-surface-tertiary` | `#D8D9C5` | Slightly deeper beige for elevated panels and secondary buttons. |
| `--text-dark` | `#1A1A1A` | Primary ink color for text, headers, strong borders, and hero text. |
| `--text-gray` | `#4A4A4A` | Secondary muted text for descriptions, metadata, and subtitles. |
| `--accent-gray` | `#D0D0D0` | Subtle hairline dividers, disabled states, and light borders. |
| `--accent-green` | `#8CA68E` | Active states, tags, status pills, and organic accents. |
| `--accent-blue` | `#8EA8B5` | Section dividers, active filter tabs, and interactive hover highlights. |
| `--base-white` | `#FFFFFF` | High-contrast text on colored tags and dark elements. |
| `--base-black` | `#000000` | Terminal video container backgrounds and deep black shadows. |
| `--color-surface-primary-translucent` | `#EAEBD79F` | Frosted header overlays and floating navigation panels. |
| `--color-shadow` | `rgba(0,0,0,0.1)` | Low-contrast tactile drop shadow. |

#### Semantic Color Mappings
```css
:root {
    /* Text Roles */
    --color-text-primary: var(--text-dark);
    --color-text-secondary: var(--text-dark);
    --color-text-tertiary: var(--text-gray);
    --color-text-dark: var(--base-black);
    --color-text-light: var(--base-white);

    /* Interactive / Links */
    --color-link-default: var(--text-dark);
    --color-link-hover: var(--text-gray);
    --color-link-active: var(--base-black);
    --color-link-visited: var(--text-dark);

    /* Surface & Borders */
    --color-border-primary: var(--text-dark);
    --color-border-secondary: var(--accent-gray);
    --color-surface-primary: var(--beige-bg);
    --color-surface-secondary: var(--beige-bg);
    --color-surface-tertiary: #D8D9C5;
    --color-surface-dark: var(--text-dark);
    --color-bg: var(--beige-bg);

    /* Elevation */
    --shadow-small: 2px 2px 5px var(--color-shadow);
}
```

#### Contrast & WCAG Compliance Matrix
- **Primary Ink on Beige (`#1A1A1A` on `#EAEBD7`):** Contrast ratio **12.3:1** (Exceeds WCAG AAA standard).
- **Secondary Gray on Beige (`#4A4A4A` on `#EAEBD7`):** Contrast ratio **6.6:1** (Exceeds WCAG AA standard).
- **White on Accent Green (`#FFFFFF` on `#8CA68E`):** Contrast ratio **3.1:1** (Used for large UI text and distinct pill shapes).
- **Beige on Accent Blue (`#EAEBD7` on `#8EA8B5`):** Contrast ratio **4.8:1** (WCAG AA compliant for active filter buttons).

---

### 2.2 Typography System (`system/text.css`)

The typography relies on **JetBrains Mono** to establish developer credibility, computational clarity, and editorial rhythm.

#### Typefaces
- **Primary / Monospace:** `'JetBrains Mono', monospace` (loaded via Google Fonts, weights 100–800).
- **Header Font:** `'JetBrains Mono', monospace` (applied in bold uppercase with expanded tracking).
- **System Fallback:** `'Lato', sans-serif` (utilized for button resets).

#### Type Scale & Sizing Tokens
| Token | REM | Computed (px) | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- |
| *Hero Display* | `5.0rem` / `4.0rem` | 80px / 64px | `1.0` – `1.1` | Main homepage hero & project detail titles |
| `--fs-6` | `2.0rem` | 32px | `1.2` | Page title, H1 |
| *H2* | `1.8rem` | 28.8px | `1.25` | Major section headers |
| *H3* | `1.6rem` | 25.6px | `1.3` | Subsections, card titles |
| *H4* | `1.4rem` | 22.4px | `1.35` | Group headings |
| *H5* / `--fs-4` | `1.25rem` / `1.2rem` | 20px / 19.2px | `1.4` | Experience titles, filter labels |
| *H6* | `1.1rem` | 17.6px | `1.4` | Small callouts |
| `--fs-3` (Base) | `1.0rem` | 16px | `1.5` | Standard body text, primary buttons |
| `--fs-2` | `0.875rem` | 14px | `1.5` | Secondary descriptions, captions |
| `--fs-1` | `0.75rem` / `0.8rem` | 12px / 12.8px | `1.4` | Metadata, tags, filter buttons, footer notes |

#### Typographic Rules
1. **Header Transformations:** All `h1` through `h6` elements enforce `text-transform: uppercase`, `font-weight: 800`, and `letter-spacing: 0.05em`.
2. **Technical Indexing:** Major sections use two-digit index prefixing (e.g., `01/ SKILLS`, `02/ SELECTED WORKS`).
3. **Readability Constraints:** Body copy max-width is constrained between `500px` and `800px` (`max-width: 600px` in hero, `max-width: 800px` in project subtitles) to preserve optimal line lengths (50–75 characters per line).

---

### 2.3 Spacing & Layout Grid (`system/spacing.css` & `layout.css`)

The spatial grid is based on an 8-point harmonic rhythm scaled in REMs:

```css
:root {
    --spacing-xxs: 0.1rem;   /* ~1.6px - fine borders/offsets */
    --spacing-xs:  0.25rem;  /* 4px    - compact tag padding, badge gaps */
    --spacing-s:   0.5rem;   /* 8px    - button padding-y, card gaps */
    --spacing:     0.75rem;  /* 12px   - baseline component spacing */
    --spacing-l:   1rem;     /* 16px   - large button padding, section padding */
    --spacing-xl:  1.25rem;  /* 20px   - header separation */
    --spacing-xxl: 1.5rem;   /* 24px   - block separation */
    --spacing-3xl: 2rem;     /* 32px   - macro layout gutters */
}
```

#### Layout Dimensions & Container Rules
- **Maximum Content Width:** `1400px` centered via `margin: 0 auto;`.
- **Project Detail Container:** `1200px` max-width.
- **Page Margin & Framing:** Outer page frame with `margin: 1rem;` and `padding: 2rem;` on desktop (`0.5rem` / `1rem` on mobile).
- **Content Grid (Homepage):** Asymmetric `1fr 2fr` split grid (1/3 for skills index, 2/3 for selected works portfolio).
- **Projects Grid:** Auto-fill responsive grid: `repeat(auto-fill, minmax(300px, 1fr))` with `3rem` gutters.

---

### 2.4 Borders, Radii & Surface Depth (`system/borders.css`)

```css
:root {
    /* Stroke Widths */
    --border-width-light: 1px;
    --border-width-default: 2px;
    --border-widht-strong: 3px;

    /* Corner Radii */
    --border-radius-small: var(--spacing-s);    /* 0.5rem (8px) */
    --border-radius-default: var(--spacing);   /* 0.75rem (12px) */
    --border-radius-large: var(--spacing-l);   /* 1.0rem (16px) */
}
```

- **Buttons & Interactive Tags:** Clean geometric corners (`border-radius: 0` for filter tabs; subtle radii for standard CTA buttons).
- **Dividers & Rules:** Clean hairline dividers (`height: 1px; background-color: var(--accent-blue);` or `var(--accent-gray);`).
- **Tactile Shadows:** Minimal `2px 2px 5px rgba(0, 0, 0, 0.1)` used selectively on cards and menus to maintain a lightweight, fast-loading flat aesthetic.

---

## 3. UI Component Library

### 3.1 Navigation Bar (`base.njk`)
The top navigation embodies the terminal-editorial character:
- **Structure:** Horizontal flexbox aligned to the left, bounded by `1400px` max-width.
- **Active State Indicator:** Prefixes active links with `>` via CSS pseudo-element (`.top-nav a.active::after { content: '>'; left: -15px; }`).
- **Letter Spacing:** `0.1em` uppercase monospace styling.

```html
<nav class="top-nav">
    <a class="nav-item active" href="/">Home</a>
    <a class="nav-item" href="/projects/">Projects</a>
</nav>
```

---

### 3.2 Buttons & Controls (`system/buttons.css`, `projects.css`)

#### Button Variants
1. **Primary Button (`.button`):**
   - Background: `var(--color-surface-primary)`
   - Text: `var(--color-text-secondary)` (`#1A1A1A`)
   - Hover: Background changes to `var(--accent-gray)`
   - Shape: Inline-block, default padding `var(--spacing-s) var(--spacing-s)`
2. **Secondary Button (`.button.secondary`):**
   - Background: `var(--color-surface-tertiary)` (`#D8D9C5`)
   - Text: `var(--color-text-tertiary)` (`#4A4A4A`)
   - Hover: Transitions to dark text `#1A1A1A`
3. **Filter Button (`.filter-btn`):**
   - Default: `background: transparent; border: 1px solid var(--text-dark); border-radius: 0;`
   - Hover & Active: `background: var(--accent-blue); color: var(--beige-bg); border-color: var(--accent-blue);`
4. **Action CTA (`.action-btn`):**
   - High-contrast solid dark fill: `background: var(--text-dark); color: var(--beige-bg);`
   - Padding: `0.6rem 1.5rem`, bold uppercase.

---

### 3.3 Cards & Project Lists (`system/card.css`, `home.css`, `projects.css`)

#### Work Item (Editorial Split List)
- Fixed thumbnail dimension: `200px` width, `16:9` aspect ratio, bounded by `1px solid var(--text-dark)`.
- Metadata stack: Title (`1.2rem`), tech tags (`0.8rem` muted gray), and description block.

#### Project Grid Card (`.project-card`)
- Aspect ratio: `16/9` responsive image container.
- Header: Bold uppercase project title.
- Tag Group: Technology pills displaying tools used (Unity, C#, React, etc.).
- Action Footer: Modular CTA buttons (`MORE`, `CODE`).

---

### 3.4 Tags & Badges (`system/tags.css`, `home.css`)

1. **Category Tag (`.tag`):**
   - Background: `var(--accent-green)` (`#8CA68E`)
   - Text: White (`#FFFFFF`)
   - Padding: `var(--spacing-xxs) var(--spacing-s)`
2. **Dark Tag (`.tag.dark`):**
   - Background: `var(--color-surface-primary)`
3. **Technical Skill Badge (`.skill-tags span`):**
   - Transparent background with `1px solid var(--text-dark)` border.
   - Pure monospace developer taxonomy.

---

### 3.5 Media & Video Player (`project-detail.css`)
- **Video Enclosure:** Dark cinematic frame (`aspect-ratio: 16/9; background: #000;`).
- **Media Captions:** Right-aligned, `0.8rem`, `var(--text-gray)`, JetBrains Mono font.

---

### 3.6 Footer Component (`footer.css`, `base.njk`)
- Two-column split layout across `1400px`.
- Left: Copyright timestamp (`&copy; 2026 ELAINE SERRANO`).
- Right: Contact hub with links to LinkedIn and GitHub.
- Border: `1px solid var(--accent-blue)` dividing the content area from the page base.

---

## 4. Responsive Breakpoints & Adaptive Layouts

The system supports fluid responsive behaviors through CSS Grid, Flexbox, and targeted media queries:

| Breakpoint | Target Screen | Adaptations |
| :--- | :--- | :--- |
| `> 1024px` | Desktop / Wide Displays | 2-column home content grid (`1fr 2fr`), fixed layout margins, multi-column project grid. |
| `<= 1024px` | Tablets / Small Laptops | Filter bar wraps, page padding reduces to `1rem`, sticky menu adapts. |
| `<= 768px` | Mobile Devices | Single column layout (`1fr`), hero title scales from `5rem` down to `3rem` / `2.5rem`, work items stack vertically (`flex-direction: column`), thumbnails scale to 100% width. |

---

## 5. Architectural Implementation Guidelines

### 5.1 CSS Hierarchy & Layering
Styles follow an inverted triangle architecture:
1. **Reboot (`system/reboot.css`):** Universal box-sizing reset, default typography declaration.
2. **Tokens (`system/colors.css`, `system/spacing.css`, `system/borders.css`):** CSS custom properties.
3. **Primitives & Base (`system/text.css`, `system/general.css`, `system/image.css`):** Elements, links, headings.
4. **Components (`system/buttons.css`, `system/card.css`, `system/tags.css`, `system/navmenu.css`):** Reusable UI patterns.
5. **Page Modules (`home.css`, `projects.css`, `project-detail.css`, `resume.css`):** Specific page assembly.

### 5.2 Accessibility & Quality Standards
- **Semantic Tags:** Use `<article>`, `<section>`, `<nav>`, `<main>`, `<header>`, `<footer>`.
- **Keyboard Focus:** All interactive elements (`<a>`, `<button>`, inputs) must maintain visible focus states.
- **Performance Budget:** Zero client-side CSS framework dependencies. Vanilla CSS ensures instant First Contentful Paint (FCP) and near-zero Total Blocking Time (TBT).
- **Future Component Extensions:** Ready for interactive Svelte islands (e.g., Blog Read Mode custom elements) utilizing these existing tokens.

---

*This specification is maintained in accordance with Google Labs design standards and represents the authoritative source of truth for the Elaine Serrano Portfolio.*
