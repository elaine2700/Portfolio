## About
**Diagram Markdown Visualizer** is a modular open-source toolkit designed to parse Markdown documents and visualize their internal heading hierarchies as interactive diagrams. Initiated as an in-depth exploratory project into modern npm package authoring and monorepo architecture, it bridges raw documentation with dynamic data visualization.

## Motivation & Problem
Markdown files inherently represent hierarchical information through headings (`#`, `##`, `###`), but reading dense conceptual trees in linear text can make it difficult to grasp the overarching relationships between topics. While manual diagramming tools exist, they require separate maintenance and duplicate effort. 

This toolkit automates the process: developers and note-takers can feed standard Markdown strings directly into the engine and obtain beautiful, interactive SVG diagrams with zero diagramming syntax required.

## Architecture & Monorepo Design
The project is architected as an npm monorepo separated into two decoupled packages:

- **`@markdown-to-diagram/core`**: The headless engine. It utilizes `remark` and `remark-parse` to convert raw Markdown into a hierarchical `TreeNode` abstract syntax tree (AST). It then provides layout computation engines powered by `d3-hierarchy` (for radial tree layouts) and `d3-force` (for dynamic force-directed layouts).
- **`@markdown-to-diagram/svelte`**: A companion component library built with Svelte 5. It consumes the computed node coordinates from the core package and renders reactive, accessible, and themeable SVG diagrams.

## How It Works
1. **Markdown Parsing**: The core package walks the Markdown AST, extracting heading levels to form parent-child node relationships while associating following text blocks as content payloads.
2. **Layout Calculation**: The engine computes geometric node coordinates, dimensions, and connection curves using radial tree projections or iterative force simulations.
3. **Reactive Rendering**: The Svelte 5 component renders SVG elements with reactive bindings, supporting pan, zoom, dragging, and interactive shape toggles.

## Key Features
- **Multiple Layout Modes**:
  - **Radial Tree**: A clean, circular hierarchical layout placing the root concept at the center with child nodes branching outwards.
  - **Force-Directed Graph**: An interactive, physics-based network diagram with draggable nodes and dynamic repulsive/attractive forces.
- **Configurable Node Shapes**: Flexible rendering supporting both compact rounded rectangles and fluid ellipses.
- **Content Toggle**: Option to view high-level heading titles or expand nodes to display the full Markdown paragraph content inside.
- **Customizable Theming**: Built-in depth-based color palettes and configurable SVG padding/dimensions.

## Technologies Used
- **Core Engine**: TypeScript, Remark, remark-parse, mdast
- **Visualization & Physics**: D3.js (`d3-hierarchy`, `d3-force`)
- **UI Components**: Svelte 5, SVG, Vite
- **Monorepo & Publishing Tooling**: npm workspaces, Changesets, Vitest

## Visuals & Workflow

### Demo Application Overview
![Diagram Markdown Visualizer Demo](/assets/images/diagram_markdown_demo.png)

### Radial Tree Layout
![Radial Tree with Rectangle Nodes](/assets/images/diagram_markdown_radial.png)

### Force-Directed Graph
![Force Graph with Draggable Nodes](/assets/images/diagram_markdown_force.png)

## Learnings & Takeaways
- Structuring a production-grade TypeScript monorepo using npm workspaces and versioning with Changesets.
- Deepening knowledge of AST parsing pipelines using the Unified/Remark ecosystem.
- Implementing D3 hierarchy projections and force simulation physics inside modern Svelte 5 components.
- Designing clean API boundaries to decouple data parsing logic from UI rendering frameworks.
