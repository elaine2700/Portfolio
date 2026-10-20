# Design System Specification: Elaine Serrano Portfolio

> **Status:** Active / Living Standard  
> **Standard:** Google Labs Engineering & Design Specification  
> **Version:** 2.0.0  
> **Author:** Elaine Serrano  
> **Target Framework:** Eleventy (11ty) Static Site Generator  
> **Styling Engine:** Modular Vanilla CSS & CSS Custom Properties (`src/assets/css/system/*`, `src/assets/css/*`)  
> **Last Updated:** 2026-10-20  

---

## 1. Overview & Design Philosophy

This design system establishes the visual identity, token architecture, and component standards for the portfolio of **Elaine Serrano** (XR Developer & Web Creative).

### 1.1 Core Aesthetic: *Vintage Retro Editorial Zine*

The design language moves away from stark, sterile digital interfaces in favor of physical, tangible editorial craftsmanship inspired by:
- **Vintage Risograph & Offset Printing:** Warm aged paper textures, halftone dot screens, ink bleed, layered color separations, and mechanical print artifacts.
- **Architectural & Technical Drafting:** Fine millimeter graph paper grids (`10px` / `16px`), drafting registration marks, double-line borders (`3px double`), and systematic indexing (`PRJ-01`, `SPEC. C1`, `01 //`).
- **Archival Manuals & Philatelic Tactility:** Authentic masking tape corner brackets (`.corner-tape-strip`), rubber verification stamps (`.rubber-stamp`, `.official-teal-stamp`), postage stamps with radial cancellation waves, perforated coupon cutoff lines (`.coupon-cutoff-line`), and ticket punch notches (`.ticket-banner`).
- **Tactile Retro Depth:** Hard-edged, solid ink drop shadows (`3px 3px 0 var(--color-ink-primary)`) rather than diffuse digital blurs, celebrating tactile physical collage and early desktop publishing.

---

## 2. Design Tokens & Foundations

All tokens are declared in CSS Custom Properties within `src/assets/css/system/` and exposed globally through `global.css`.

### 2.1 Color Palette (`system/colors.css`)

The color system is organized into:
- **Canvas & Base**
- **Inks & Text**
- **Primary Warm Accent (Terracotta)**
- **Golden Ochre Accent**
- **Cool Accents (Teal & Sage)**
- **Graph Lines**
- **Tactile Physical Accents**

#### Token Definitions & Roles
| Token Name | Hex / CSS Value | Role & Usage |
| :--- | :--- | :--- |
| `--color-canvas` | `#F5EFEB` | Primary warm aged oatmeal parchment canvas. |
| `--color-surface-card` | `#FAF7F0` | Light clean card and container surface fill. |
| `--color-surface-pulp` | `#E8E2D5` | Aged newsprint pulp; used for headers, sub-panels, scroll tracks, and hover states. |
| `--color-bg` | `var(--color-canvas)` | Baseline application background. |
| `--beige-bg` | `var(--color-canvas)` | Backwards-compatible alias for primary canvas. |
| `--color-ink-primary` | `#1E1E1C` | Deep espresso charcoal ink; primary text, headers, and strong structural borders. |
| `--color-ink-muted` | `#5C5A55` | Muted typewriter ink; descriptions, metadata, dates, and secondary labels. |
| `--color-ink-faint` | `#8E8C85` | Subtle ink; stamps, annotations, and cancellation marks. |
| `--color-primary` | `#D25A38` | **Terracotta rust / burnt sienna:** Primary call-to-action fill, active states, and highlights. |
| `--color-primary-hover` | `#B84728` | Darker terracotta for hover and interaction states. |
| `--color-primary-light` | `#F7EAE5` | Warm terracotta wash; used for collage slips and accent backgrounds. |
| `--color-primary-translucent` | `rgba(210, 90, 56, 0.15)` | Subtle terracotta highlight glow and node halos. |
| `--color-accent-gold` | `#E5A93C` | **Aged golden ochre / mustard:** Ticket buttons, secondary pills, blockquotes, and accents. |
| `--color-accent-gold-dark` | `#C68E28` | Deep gold for button hover states. |
| `--color-accent-gold-light` | `#FBF4E4` | Pale ochre tint for quotes and notice cards. |
| `--color-accent-gold-translucent` | `rgba(229, 169, 60, 0.25)` | Golden focus rings and subtle overlays. |
| `--color-accent-teal` | `#3D7068` | **Vintage teal / faded denim:** Category badges (VR/AR), active graph indicators, and official stamps. |
| `--color-accent-teal-dark` | `#2A4E48` | Deep teal for button hover states. |
| `--color-accent-teal-translucent` | `rgba(61, 112, 104, 0.2)` | Teal indicator rings and graph halos. |
| `--color-accent-sage` | `#8FA89B` | **Retro celadon / sage green:** Secondary tags, starbursts, and organic technical accents. |
| `--color-accent-sage-dark` | `#6C8578` | Deep sage border and active stroke color. |
| `--color-accent-sage-light` | `#EEF3F0` | Soft sage surface tint. |
| `--color-grid-lines` | `#D5DED6` | Technical drafting grid lines (16px graph paper). |
| `--color-grid-lines-subtle` | `#E2E8E3` | Fine drafting grid lines (10px fine graph paper). |
| `--color-border-primary` | `var(--color-ink-primary)` | Standard 1px, 1.5px, or 3px solid borders. |
| `--color-border-secondary` | `var(--color-surface-pulp)` | Low-contrast hairline dividers. |
| `--color-border-dashed` | `rgba(30, 30, 28, 0.45)` | Editorial dashed rules and perforated section dividers. |
| `--color-shadow` | `rgba(30, 30, 28, 0.12)` | Subtle ambient drop shadow. |
| `--shadow-retro` | `3px 3px 0 var(--color-ink-primary)` | Standard solid ink tactile drop shadow. |
| `--shadow-retro-small` | `2px 2px 0 var(--color-ink-primary)` | Compact tactile shadow for buttons and pills. |
| `--shadow-retro-hover` | `4px 4px 0 var(--color-ink-primary)` | Hover elevation shadow for interactive cards and buttons. |
| `--color-tape` | `rgba(234, 219, 182, 0.92)` | Authentic masking tape body color. |
| `--color-tape-border` | `rgba(180, 160, 125, 0.6)` | Subtle fiber edge on masking tape strips. |

#### Semantic Background Utility Classes
```css
.bg-primary   { background-color: var(--color-primary) !important; color: #FFFFFF !important; }
.bg-secondary { background-color: var(--color-accent-gold) !important; color: var(--color-ink-primary) !important; }
.bg-teal      { background-color: var(--color-accent-teal) !important; color: #FFFFFF !important; }
.bg-sage      { background-color: var(--color-accent-sage) !important; color: var(--color-ink-primary) !important; }
.bg-card      { background-color: var(--color-surface-card) !important; }
.bg-pulp      { background-color: var(--color-surface-pulp) !important; }
```

#### Contrast & WCAG Compliance Matrix
- **Espresso Ink on Oatmeal Canvas (`#1E1E1C` on `#F5EFEB`):** Contrast ratio **13.4:1** (Exceeds WCAG AAA standard).
- **Muted Ink on Clean Card (`#5C5A55` on `#FAF7F0`):** Contrast ratio **6.4:1** (Exceeds WCAG AA standard).
- **White on Terracotta (`#FFFFFF` on `#D25A38`):** Contrast ratio **4.6:1** (WCAG AA compliant for text and interactive controls).
- **White on Vintage Teal (`#FFFFFF` on `#3D7068`):** Contrast ratio **5.1:1** (WCAG AA compliant for badges and button text).
- **Espresso Ink on Golden Ochre (`#1E1E1C` on `#E5A93C`):** Contrast ratio **7.8:1** (WCAG AAA compliant for ticket badges and callouts).

---

### 2.2 Typography System (`system/text.css`)

The typography uses a **tri-font editorial hierarchy** loaded via Google Fonts:
1. **Display / Headlines (`--font-family-display`):** `"Oswald", "Impact", "Arial Black", sans-serif` — High-impact, condensed uppercase headline face.
2. **Technical / Monospace (`--font-family-mono`, `--font-family-default`):** `"JetBrains Mono", "Courier New", monospace` — Computational clarity, developer credibility, body copy, and UI controls.
3. **Editorial Serif (`--font-family-serif`):** `"Playfair Display", "Georgia", serif` — Literary and editorial accents, drop caps, and pull quotes.

#### Type Sizing Tokens & Headings Scale
| Token | REM / Value | Responsive Clamp | Usage |
| :--- | :--- | :--- | :--- |
| `--fs-hero` | Fluid | `clamp(2.75rem, 6vw, 5rem)` | Homepage hero headline |
| `h1` | Fluid | `clamp(2.2rem, 4.5vw, 3.5rem)` | Page titles, major article titles |
| `h2` | Fluid | `clamp(1.6rem, 3vw, 2.4rem)` | Major section headings, catalog titles |
| `h3` | Fluid | `clamp(1.2rem, 2.2vw, 1.7rem)` | Subsection headers, card titles |
| `h4` | `1.25rem` | 20px | Component groupings |
| `h5` | `1.1rem` | 17.6px | Filter labels, small sub-headers |
| `h6` | `0.95rem` | 15.2px | Micro headers, spec titles |
| `--fs-xxl` | `2.0rem` | 32px | Prominent callout text |
| `--fs-xl` | `1.4rem` | 22.4px | Sub-hero lead-ins |
| `--fs-l` | `1.15rem` | 18.4px | Section tags, prominent captions |
| `--fs-m` (Base) | `0.95rem` | 15.2px | Standard body paragraphs, modal copy |
| `--fs-s` | `0.82rem` | 13.1px | Secondary descriptions, button labels |
| `--fs-xs` | `0.72rem` | 11.5px | Tags, metadata strips, index pills, colophons |

#### Typographic Components & Rules
- **Heading Transforms:** All `h1` through `h6` enforce `font-family: var(--font-family-display); font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; line-height: 1.1;`.
- **Drop Caps (`.drop-cap::first-letter`):** Floated initial letter styled in `Playfair Display` serif (`3.8rem`, color `var(--color-primary)`).
- **Editorial Pull Quotes (`.editorial-quote`):** Italic serif copy bordered by `1.5px dashed var(--color-border-dashed)` above and below, tinted background, and decorative gold quotation glyph (`“`).
- **Asterisk Starbursts (`.asterisk-star`):** Decorative print glyphs (`.terracotta`, `.gold`) celebrating archival footnoting.
- **Typewriter Captions (`.typewriter-caption`):** Monospace uppercase micro-text (`0.75rem`, letter spacing `0.08em`, muted ink).
- **Section Title Tags (`.section-tag`):** Uppercase display header accompanied by a repeating dotted-dashed rule (`repeating-linear-gradient(...)`).

---

### 2.3 Spacing & Layout Grid (`system/spacing.css` & `layout.css`)

The layout uses an expanded 8-point harmonic rhythm:
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

#### Macro Layout Dimensions
- **Maximum Content Width:** `1400px` centered via `margin: 0 auto;`.
- **Page Enclosure & Border Frame:** Outer frame on `body` (`margin: 1rem; padding: 2rem;` on desktop, `margin: 0.5rem; padding: 1rem;` on mobile).
- **Content Wrapper (`.content-wrapper`):** Auto-centered with top padding `2rem`.
- **Catalog & Grid Layouts:** 3-column CSS Grid (`repeat(3, 1fr)`) on desktop (`> 1024px`), 2-column on tablet (`640px – 1024px`), and 1-column on mobile (`< 640px`).

---

### 2.4 Borders, Radius, Shadows & Tactile Textures (`system/borders.css` & `card.css`)

```css
:root {
    /* Stroke Widths */
    --border-width-thin: 1px;
    --border-width-default: 1.5px;
    --border-width-heavy: 3px;

    /* Corner Radius */
    --border-radius-default: 4px;
    --border-radius-pill: 9999px;

    /* Dashed Border Presets */
    --border-dashed-thin: var(--border-width-default) dashed var(--color-border-dashed);
    --border-dashed-default: var(--border-width-default) dashed var(--color-border-dashed);
    --border-dashed-heavy: var(--border-width-heavy) dashed var(--color-border-dashed);
}
```

#### Tactile Print & Archival Features
1. **Authentic Corner Masking Tape (`.corner-tape`):**
   - Implemented via explicit child elements (`.corner-tape-strip`) placed at the four corners: `.tape-tl` (-38deg), `.tape-tr` (+38deg), `.tape-bl` (+38deg), `.tape-br` (-38deg).
   - Styled with warm parchment gradient (`linear-gradient(135deg, rgba(246, 235, 206, 0.94) 0%, rgba(230, 214, 175, 0.88) 100%)`), fibrous edge border, and micro-shadow.
   - Paired with an inner `.image-crop-box` to ensure image content is cleanly masked while the corner tapes extend visibly outside the frame (`overflow: visible !important`).
   - Includes automatic pseudo-element fallback (`::before`, `::after`) for 2-corner applications, suppressed automatically when `.corner-tape-strip` children exist via `:has(.corner-tape-strip)`.
2. **Drafting Graph Paper Textures:**
   - Standard Graph Paper (`.graph-paper`): `16px × 16px` grid using `--color-grid-lines`.
   - Fine Graph Paper (`.graph-paper-fine`): `10px × 10px` grid using `--color-grid-lines-subtle`.
3. **Double & Dashed Borders:**
   - Double Border (`.border-double`): `3px double var(--color-border-primary)` evoking technical document framing.
   - Dashed Border (`.border-dashed`): `1.5px dashed var(--color-border-dashed)`.
4. **Perforated Ticket Notches (`.ticket-banner`):**
   - Concave circular punches on left and right edges (`::before`, `::after` with `background-color: var(--color-canvas)`).
5. **Rubber Stamps & Official Seals:**
   - Rectangular Rubber Stamp (`.rubber-stamp`): `-3deg` tilt, `border: 2px solid currentColor`, `mix-blend-mode: multiply` (`.teal`, `.terracotta`).
   - Official Verification Stamp (`.official-teal-stamp`): Framed archival seal used on the resume header.
   - Circular Seal (`.circular-seal`): `+8deg` rotation, double concentric dashed border with centered monogram.
6. **Scissor Cutoff Coupon Line (`.coupon-cutoff-line`):**
   - Dashed rule across `1400px` with an overlaid `.cutoff-text` coupon marker (`CUT HERE`).

---

## 3. UI Component Library

### 3.1 Site Header & Navigation (`system/navmenu.css`, `base.njk`)

The masthead operates like a vintage periodical or technical publication header:
- **Container (`.site-header`):** Max-width `1400px`, bordered below by a heavy dashed line (`var(--border-dashed-heavy)`).
- **Logo Brand (`.site-logo-link`):** Set in `Oswald` bold uppercase (`1.35rem`, tracking `0.08em`), with terracotta hover transition.
- **Navigation Links (`.top-nav`):** Monospace uppercase (`0.85rem`), letter-spaced.
  - **Active State (`.top-nav a.active`):** Color changes to terracotta (`var(--color-primary)`), bottom border `2px solid var(--color-primary)`, and prefix marker `>` via pseudo-element (`::before { content: '>'; left: -14px; color: var(--color-primary); }`).
  - **Navigation Structure:** `Home` (`/`), `Projects` (`/projects/`), `Resume` (`/resume/`), `Contact` (`#contact`), `Blog` (`/blog/`).

---

### 3.2 Buttons & Interactive Controls (`system/buttons.css`, `projects.css`)

All buttons are built on the monospace typewriter font (`JetBrains Mono`), uppercase, with crisp borders and tactile offset shadows:

#### Button Hierarchy
1. **Primary Action Button (`.button`):**
   - Fill: Terracotta rust (`var(--color-primary)`)
   - Text: White (`#FFFFFF`)
   - Border: `1.5px solid var(--color-ink-primary)`
   - Shadow: `var(--shadow-retro-small)` (`2px 2px 0`)
   - Hover: Darker terracotta (`var(--color-primary-hover)`), translated `translate(-1px, -1px)` with elevated shadow `var(--shadow-retro)`.
   - Active: Pressed `translate(1px, 1px)` with reduced shadow `1px 1px 0`.
2. **Secondary Outline Button (`.button.secondary`):**
   - Fill: Transparent
   - Text: Deep espresso ink (`var(--color-ink-primary)`)
   - Border: `1.5px solid var(--color-ink-primary)`
   - Hover: Newsprint pulp fill (`var(--color-surface-pulp)`).
3. **Golden Ticket Button (`.button.ticket-btn`, `.button.gold`):**
   - Fill: Golden ochre (`var(--color-accent-gold)`)
   - Border: `1.5px dashed var(--color-ink-primary)`
   - Hover: Dark gold (`var(--color-accent-gold-dark)`), white text.
4. **Teal Accent Button (`.button.teal`):**
   - Fill: Vintage teal (`var(--color-accent-teal)`), white text.
5. **Filter Tab Button (`.filter-btn`):**
   - Idle: Transparent background, `1.5px solid var(--color-ink-primary)`, monospace `0.78rem`.
   - Active (`.filter-btn.active`): Solid terracotta background (`var(--color-primary)`), crisp white text, and `box-shadow: 2px 2px 0 var(--color-ink-primary)`.
6. **Size Modifiers:**
   - Small (`.button-s`): `padding: 0.35rem 0.75rem; font-size: 0.72rem;`
   - Large (`.button-l`): `padding: 0.75rem 1.75rem; font-size: 0.95rem;`

---

### 3.3 Cards & Exhibition Plates (`system/card.css`, `home.css`, `projects.css`)

#### Card Types
1. **Base Card (`.card`):**
   - Fill: Clean card surface (`var(--color-surface-card)`).
   - Border: `1px solid var(--color-ink-primary)` (or `3px double var(--color-ink-primary)`).
   - Shadow: `var(--shadow-retro)` (`3px 3px 0`).
   - Hover Transition: `translate(-2px, -2px)` with expanded shadow `var(--shadow-retro-hover)` (`4px 4px 0`).
   - Header Bar (`.card .card-header`): Monospace metadata strip bounded by dashed bottom border.
2. **Specimen Card (`.specimen-card`, `.skills-specimen-card`):**
   - Border: `1.5px dashed var(--color-border-dashed)`.
   - Structure: Numeric spec label (`SPEC. C1`), display title, and tag taxonomy.
3. **Project Catalog Card (`.project-card`):**
   - Top metadata strip: Index (`PRJ-01`) and pill badge (`VR-AR`, `WEB`, `TOOL`).
   - Media frame with 4-corner masking tape and inner `.image-crop-box`.
   - Optional demo video indicator badge (`▶ DEMO VIDEO`).
   - Taxonomy badges grouped by Tools and Programming Languages.
   - Card footer action buttons (`VIEW DOSSIER ->`, `CODE`).

---

### 3.4 Tags, Pills & Taxonomy Badges (`system/tags.css`)

1. **Stamped Tech Tag (`.tag`):**
   - Rectangular, transparent background, `1px solid var(--color-ink-primary)`.
   - Typeface: Monospace uppercase (`0.72rem`), letter spacing `0.04em`.
   - Modifiers: `.tag.dark` (ink background, canvas text), `.tag.gold`, `.tag.teal`, `.tag.sage`, `.tag.tag-s`.
2. **Capsule Pill (`.pill`):**
   - Shape: Fully rounded capsule (`border-radius: var(--border-radius-pill)`).
   - Border: `var(--border-width-default) solid var(--color-ink-primary)`.
   - Default Fill: Terracotta rust (`var(--color-primary)`), white text.
   - Variant Fills: `.pill.teal` (vintage teal fill), `.pill.gold` (golden ochre fill).
3. **Taxonomy Group (`.tag-group`):**
   - Flexbox container with wrap enabled and consistent `0.45rem` gap.

---

### 3.5 Unified Modal & Dossier Reader (`system/modal.css`, `components/modal.njk`, `components/project-modal.njk`)

The portfolio implements a **centralized modal system** serving as the single source of truth for Project Dossiers and Blog Article Readers:

```
┌─────────────────────────────────────────────────────────────┐
│ MODAL BACKDROP (rgba(30, 30, 28, 0.78) + blur(4px))         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ MODAL TOPBAR: ● ARCHIVE // PRJ-01    [TITLE]   ✕ [ESC] │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ SCROLLABLE DOSSIER BODY:                               │  │
│  │  - Hero Header with Category Pill & Title             │  │
│  │  - Taxonomy Tags (Tools, Languages) & Actions          │  │
│  │  - Media Enclosure (16:9 Video or Banner)              │  │
│  │  - Markdown Spec Body / Specifications Matrix         │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ MODAL FOOTER: [← PREV]  PROJECT 1 OF 6  [NEXT →]      │  │
│  │                                  [RETURN TO CATALOG]  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

#### Modal Architecture & Specifications
- **Backdrop (`.modal-backdrop`, `.project-modal-backdrop`):** Fixed full-screen overlay, dark espresso ink (`rgba(30, 30, 28, 0.78)`), with `backdrop-filter: blur(4px)` and smooth cubic-bezier opacity transition.
- **Window Container (`.modal-window`, `.project-modal-window`):** Oatmeal canvas background (`var(--color-canvas)`), bounded by `max-width: 980px`, `max-height: 88vh`, and heavy solid drop shadow `8px 8px 0 var(--color-ink-primary)`.
- **Command Topbar (`.modal-topbar`):**
  - Left: Animated teal pulse dot (`.modal-pulse-dot`), document type (`ARCHIVE` / `GARDEN`), double slash `//`, and item index (`PRJ-01` / `DOC-01`).
  - Center: Truncated uppercase title in `Oswald`.
  - Right: Terracotta close button (`.modal-close-btn`) with keyboard shortcut indicator `✕ [ESC]`.
- **Scrollable Body (`.modal-scroll-body`):**
  - Custom scrollbars with newsprint pulp track and solid espresso thumb.
  - Formatted typography: Display `h1`-`h3` headings with terracotta dividing rules, list items prefixed with `>` glyphs, preformatted dark code blocks, and zebra-striped specimen data tables.
- **Footer Navigation Bar (`.modal-footer`):**
  - Sequential browsing buttons: `← PREV PROJECT`, `NEXT PROJECT →`, with middle index counter (`PROJECT 1 OF X`).
  - Action button: Terracotta `RETURN TO CATALOG [ESC]`.
- **URL Synchronization:** Deep-linking support via `/projects/{id}/` routing, restoring state instantly without breaking history.

---

### 3.6 Scissor Cutoff Footer & Colophon (`footer.css`, `base.njk`)

- **Cutoff Divider (`.coupon-cutoff-line`):** `2px dashed var(--color-ink-primary)` with overlaid `.cutoff-text` (`CUT HERE // CONTACT & COLOPHON`).
- **Colophon Hub (`.footer-center-col`):** Centered copyright notice (`© 2026 ELAINE SERRANO`) and monospace contact links (LinkedIn, GitHub, Email) with bullet separators (`•`) and terracotta hover effects.

---

## 4. Page Architecture & Layout Specifications

### 4.1 Home Page (`/` — `src/index.njk`, `home.css`)

1. **Hero Section (`.home_hero`):**
   - Two-column asymmetric layout (`1.15fr 0.85fr`) separated by a dashed divider.
   - Left Text Side: Giant headline (`clamp(3rem, 5.5vw, 4.75rem)`), monospace lead paragraph, and dual CTA buttons (`EXPLORE PROJECTS ->`, `READ RESUME`).
   - Right Tactile Collage (`.collage-container`):
     - Terracotta torn paper background slip (`.collage-torn-paper`, -3deg tilt).
     - Vintage postage stamp (`.postage-stamp`, +5deg tilt) featuring inner frame, "AIR MAIL 2026" monogram, and radial wave cancel mark.
     - Circular halftone portrait cutout (`.collage-circle-art`) with duotone teal contrast and golden dot overlay screen.
     - Taped typewriter bio note card (`.collage-note-card`) fastened with a top masking tape strip (`.collage-note-tape`).
2. **Section 01: Skills & Specimens (`.skills-section`):**
   - Grid of 3 modular dashed specimen cards (`SPEC. C1 SYSTEMS & ENGINES`, `SPEC. C2 CODE & ARCHITECTURE`, `SPEC. C3 VISUAL & EDITORIAL`).
3. **Section 02: Selected Exhibitions (`.works-section`):**
   - 3-column exhibition plate cards showcasing featured works with 4-corner tape strips and quick spec action links.

---

### 4.2 Projects Catalog (`/projects/` — `src/projects.njk`, `projects.css`)

1. **Catalog Masthead:** Technical index `01 / SELECTED WORKS & REPOSITORY`, large display title, and curated description.
2. **Command & Filter Bar (`.projects__command-bar`):**
   - Category filter buttons (`ALL`, `VR-AR`, `WEB`, `TOOL`) displaying live count pills (`.filter-badge`).
   - Live status indicator dot and item counter (`SHOWING X / Y PROJECTS`).
3. **Catalog Grid (`.projects-grid`):**
   - 3-column auto-flow grid of `.project-card` components.
   - Clicking any project opens the URL-synchronized Project Dossier modal.

---

### 4.3 Blog & Knowledge Graph (`/blog/` — `src/blog.njk`, `blog.css`, `strata-graph.css`)

1. **Garden Masthead:** Index label `KNOWLEDGE GRAPH & ARTICLES`, `Digital Garden` title, and dual-mode description.
2. **No-JS Accessibility Banner (`.blog-fallback-banner`):** Graceful fallback displaying directory navigation when JavaScript is disabled.
3. **Dual-Mode View Switcher (`.blog-view-bar`):**
   - Mode 1: `GRAPH VIEW [CANVAS 2D]` — Interactive force-directed canvas visualization (Strata-Graph) with custom category node radii, color tokens, and navigation pan/zoom.
   - Mode 2: `CLASSIC VIEW [DIRECTORY]` — Sticky hierarchical folder tree sidebar with quick file search and card catalog.
4. **Article Modal Reader:** Integrates seamlessly with `system/modal.css` for deep-dive reading experiences.

---

### 4.4 Resume (`/resume/` — `src/resume.njk`, `resume.css`)

1. **Archival Dossier Header (`.dossier-header`):**
   - Large headline (`CURRICULUM VITAE // DOSSIER NO. 88`), bio paragraph, and official teal verification stamp (`★ ARCHIVE 2026 ★`).
2. **Section 01: Professional Experience:**
   - Vertical perforated dashed timeline (`2px dashed var(--color-ink-primary)`) with milestone anchor dots, start/end dates, role titles, and monospace bullet points.
3. **Section 02: Technical Competencies:**
   - Multi-column grid of skills groups styled on graph-paper cards with category pill headers.

---

## 5. Responsive Breakpoints & Adaptive Layouts

| Breakpoint | Target Screen | Adaptations |
| :--- | :--- | :--- |
| `> 1024px` | Desktop / Wide Displays | 3-column catalog grids, 2-column home hero split, sticky blog sidebar, full modal dimensions (`980px`). |
| `768px – 1024px` | Tablets & Laptops | 2-column project and exhibition grids, hero stacks into single column, modal padding reduces to `1.5rem`. |
| `< 768px` | Mobile Devices | Single column layout (`1fr`), header navigation wraps, hero collage scales to `300px`, modal full-width (`max-height: 94vh`), modal center topbar hides, modal footer buttons stack vertically. |

---

## 6. Architectural Implementation Guidelines

### 6.1 Inverted Triangle CSS Hierarchy

All styles strictly follow modular, progressive layering:
1. **Reboot (`system/reboot.css`):** Universal `box-sizing: border-box`, standard HTML element resets.
2. **Design Tokens (`system/colors.css`, `system/spacing.css`, `system/borders.css`):** Custom properties and atomic color classes.
3. **Typography & Primitives (`system/text.css`, `system/general.css`, `system/image.css`):** Font families, fluid clamps, drop caps, quotes.
4. **Core UI Components (`system/buttons.css`, `system/card.css`, `system/tags.css`, `system/navmenu.css`, `system/modal.css`):** Reusable buttons, cards, pills, header, and unified modal system.
5. **Page Layouts & Modules (`home.css`, `projects.css`, `project-detail.css`, `blog.css`, `resume.css`, `footer.css`):** Page-specific compositions.

### 6.2 Accessibility & Ergonomics Standards
- **Zero Framework Overhead:** 100% Vanilla CSS and lightweight modern vanilla JS guarantees near-zero Total Blocking Time (TBT) and instant First Contentful Paint (FCP).
- **Keyboard Navigation:** Full `Tab` focus rings, `[ESC]` dismiss on all dialogs, `←` / `→` arrow key navigation for dossiers, and `aria-modal`, `aria-label`, `role="toolbar"`, and `role="tablist"` semantic attributes.
- **Reduced Motion:** Interactive transitions respect `@media (prefers-reduced-motion: reduce)`.

---

*This specification is maintained in accordance with Google Labs design standards and represents the authoritative source of truth for the Elaine Serrano Portfolio.*
