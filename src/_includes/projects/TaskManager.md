## About
A custom, privacy-first task management system built with **SvelteKit** that brings a modern, reactive Kanban board experience to your local filesystem. Designed specifically for developers and power users, it stores all tasks, projects, and features as standard Markdown files in a local directory rather than locking data away in a proprietary database or cloud service.

## Motivation & Problem
Many productivity and task management tools lock task data into proprietary formats, behind subscription walls, or on remote servers. This limits portability, makes offline access clunky, and prevents developers from using command-line scripts or Git version control to manage their workflows. 

Markdown Task Manager solves this by strictly mirroring your directory tree. Because your tasks are plain Markdown files with standard YAML frontmatter, you retain complete ownership of your data and can seamlessly sync it using tools like Git, Obsidian, Nextcloud, or Dropbox.

## How It Works
The application uses a file and folder structure directly mapped to your tasks:

1. **Folder Parsing**: The backend scans your designated data directory. Top-level folders represent **Projects**, sub-folders represent **Features**, and the enclosed Markdown (`.md`) files represent individual **Tasks**.
2. **YAML Frontmatter**: Metadata such as task `status` (e.g., Todo, In Progress, Done) and generated IDs are stored directly in YAML frontmatter at the top of each file. The body of the Markdown file contains the detailed description and task notes.
3. **Reactive Kanban Interface**: The SvelteKit frontend parses these files and renders them as cards across Kanban columns.
4. **Real-Time Disk Sync**: Dragging a card between columns or editing details in the modal immediately updates the YAML frontmatter and Markdown content on disk.

## Key Features
- **Reactive Kanban Board**: Smooth drag-and-drop task management across columns with instantaneous file synchronization.
- **Custom Project Statuses**: Configure custom workflow columns per project in `project.md` (e.g., `statuses: 'todo, in-progress, review, done'`) with tailored completion statuses.
- **Hierarchical Organization**: Organize work into top-level Projects and targeted Feature subfolders.
- **Rich Task Editor**: In-app modal editor allowing quick updates to task descriptions, status flags, and metadata.
- **Automatic Progress & Date Tracking**: Automatically tracks `startDate` and timestamps `endDate` when all subtasks reach completion, reactively updating progress bars.
- **Project Archiving**: Easily archive completed or inactive projects to an `archive/` folder to keep the active workspace uncluttered while preserving files.
- **Containerized Deployment**: Packaged with Docker and Docker Compose with simple persistent host volume mapping.

## Technologies Used
- **Frontend & Framework**: SvelteKit, Svelte 5, Vite
- **Parsing & Data Handling**: gray-matter (YAML frontmatter parsing)
- **Languages**: TypeScript, CSS, HTML
- **Infrastructure & Containerization**: Docker, Docker Compose, Node.js

## Visuals & Workflow

### Kanban Board Dashboard
![Main Kanban Board Dashboard](/assets/images/task_manager_kanban.png)

### Task Editor Modal
![Task Editor Modal](/assets/images/task_manager_editor.png)

## Learnings & Development Notes
- Designing a bidirectional synchronization system between the local filesystem and a reactive SvelteKit state store.
- Managing filesystem watching and asynchronous read/write operations without race conditions.
- Leveraging Svelte 5's reactivity model to maintain snappy UI interactions across deep project and feature hierarchies.
- Packaging a full-stack Node.js and SvelteKit application inside Docker with host volume persistence for developer workflows.
