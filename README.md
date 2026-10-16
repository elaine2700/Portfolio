# Elaine Serrano — Portfolio

Welcome to the personal portfolio website of **Elaine Serrano**, XR Developer and Designer.

This repository hosts the source code for the portfolio, highlighting projects in Extended Reality (VR/AR/XR), 3D interactive experiences, tools, and web development.

---

## 🛠 Tech Stack

- **Framework / SSG:** [Eleventy (11ty)](https://www.11ty.dev/) (v2.0.1)
- **Templating Engine:** [Nunjucks (`.njk`)](https://mozilla.github.io/nunjucks/) and Markdown via [`markdown-it`](https://github.com/markdown-it/markdown-it)
- **Styling Architecture:** Modular Vanilla CSS & CSS Custom Properties (Design Token System)
- **Typography:** [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) & [Lato](https://fonts.google.com/specimen/Lato)
- **Icons:** [Bootstrap Icons](https://icons.getbootstrap.com/)
- **Configuration & Environment:** `dotenv`

---

## 🎨 Design System

The visual language follows a **Retro-Technical Monospace Editorial** aesthetic adhering to Google Labs documentation standards.

For complete specifications on the color palette, typography scale, 8-point spatial rhythm, component library, and WCAG accessibility standards, please refer to:
👉 **[DESIGN.md](DESIGN.md)**

### Key Visual Tokens
- **Canvas / Background:** `#EAEBD7` (Warm Paper Beige)
- **Primary Ink / Typography:** `#1A1A1A` (Near Black)
- **Secondary Text:** `#4A4A4A` (Graphite)
- **Accents:** `#8CA68E` (Sage Green) & `#8EA8B5` (Slate Blue)
- **Dividers & Rules:** `#D0D0D0` (Subtle Gray)

---

## 📁 Project Structure

```text
Portfolio Repo/
├── src/
│   ├── _data/                 # Global data files (projects, education, skills, experience)
│   │   ├── education.json
│   │   ├── projects.json
│   │   ├── skills.json
│   │   └── work_experience.json
│   ├── _includes/             # Nunjucks partials and layouts
│   │   └── layouts/
│   │       └── base.njk       # Core HTML skeleton and top navigation
│   ├── assets/                # Static assets (copied directly to output)
│   │   ├── css/
│   │   │   ├── system/        # Design system token definitions & primitives
│   │   │   │   ├── borders.css
│   │   │   │   ├── buttons.css
│   │   │   │   ├── card.css
│   │   │   │   ├── colors.css
│   │   │   │   ├── flex.css
│   │   │   │   ├── grid.css
│   │   │   │   ├── reboot.css
│   │   │   │   ├── spacing.css
│   │   │   │   ├── tags.css
│   │   │   │   └── text.css
│   │   │   ├── global.css     # Master stylesheet aggregating system imports
│   │   │   ├── home.css       # Homepage layout styles
│   │   │   ├── projects.css   # Projects showcase & filter bar styles
│   │   │   ├── project-detail.css
│   │   │   └── resume.css
│   │   ├── images/            # Project previews and graphics
│   │   └── js/                # Client-side scripts
│   ├── index.njk              # Homepage template
│   ├── projects.njk           # Projects gallery template
│   ├── project-detail.njk     # Dynamic project detail page template
│   └── resume.njk             # Resume page template
├── .eleventy.js               # Eleventy build configuration
├── DESIGN.md                  # Comprehensive Google Labs design system specification
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation
Clone the repository and install the project dependencies:
```bash
git clone https://github.com/elaine2700/Portfolio.git
cd Portfolio
npm install
```

### Local Development
Start the Eleventy development server with automatic reloading:
```bash
npm start
```
The site will be available locally at `http://localhost:8080/`.

### Production Build
Compile the static site to the `_site/` output directory:
```bash
npm run build
```

---

## 📄 License
This project is licensed under the [ISC License](LICENSE).
