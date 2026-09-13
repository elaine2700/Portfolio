## About
**Yearly Timeline** is a vertical timeline plugin built for [Obsidian](https://obsidian.md) that enables users to track, visualize, and reflect on their projects, milestones, and notes across a comprehensive yearly view.

## Motivation & Problem
In personal knowledge management, notes and project logs frequently end up scattered across disparate folders or buried in daily notes. Traditional calendar plugins typically focus on daily or monthly views, making it challenging to see the "big picture" of initiatives that span across multiple weeks or months. 

Yearly Timeline solves this by providing a high-level vertical visual timeline directly inside Obsidian. It allows users to quickly review their yearly journey, evaluate ongoing commitments, and maintain momentum on long-term goals.

## How It Works
The plugin leverages standard Obsidian Markdown note frontmatter (YAML) without locking you into custom data formats:

1. **Vault Indexing**: The plugin scans your notes for metadata fields, automatically picking up any note containing a valid `startDate` (formatted as `DD/MM/YYYY`).
2. **Dynamic Status Resolution**:
   - **In-Progress**: Notes with a `startDate` but no `endDate` are styled at **50% color saturation** and dynamically extended to the current date.
   - **Done**: Notes containing both `startDate` and `endDate` are displayed at **100% full color saturation**.
   - **Todo**: Notes without dates remain organized in your vault without cluttering the active timeline.
3. **Overlap Resolution**: When multiple projects or events share overlapping date ranges, the plugin dynamically arranges them into adjacent vertical columns to ensure clear readability.
4. **Instant Note Navigation**: Clicking on any block in the timeline immediately opens the associated note in the Obsidian active pane.

## Key Features
- **Vertical Yearly Perspective**: View your entire year's activities, milestones, and project lifecycles at a glance.
- **Dynamic Category Color Coding**: Notes are automatically categorized and assigned colors from a curated 12-color vibrant palette based on discovery order.
- **Collapsible Legend Panel**: Quick-access categories legend showing current color mappings with easy filtering.
- **Automatic Progress & Saturation**: Immediate visual distinction between active initiatives and completed milestones.
- **Year Navigation**: Interactive year selector to review past years or plan forward.
- **Accurate Calendar Math**: Full support for leap years, varying month lengths, and multi-day spans.

## Technologies Used
- **Plugin Platform**: Obsidian Developer API
- **UI Framework**: Svelte 5
- **Languages**: TypeScript, CSS
- **Build Tooling**: esbuild, ESLint

## Visuals & Workflow

### Yearly Timeline View
![Yearly Timeline View](/assets/images/obsidian_timeline_view.png)

### Dynamic Categories Panel & Legend
![Categories Panel Legend](/assets/images/obsidian_timeline_categories.png)

### Status & Saturation Indicators
![Status Colors](/assets/images/obsidian_timeline_status.png)

## Learnings & Development Notes
- Working within Obsidian's custom view lifecycle and workspace leaf architecture.
- Implementing an interval layout algorithm to efficiently pack overlapping date ranges into parallel visual lanes.
- Embedding Svelte 5 components seamlessly inside an Electron-based desktop application with custom Obsidian CSS themes.
