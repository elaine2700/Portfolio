/**
 * Projects Filtering & Metrics Script
 * Aligned with DESIGN.md specifications
 */

document.addEventListener("DOMContentLoaded", function () {
    const projects = Array.from(document.querySelectorAll(".project-card"));
    const filterBar = document.getElementById("filterBar");
    const countDisplay = document.getElementById("projectCountDisplay");
    const emptyState = document.getElementById("emptyProjectsState");
    const resetBtn = document.getElementById("resetFilterBtn");

    if (!filterBar || projects.length === 0) return;

    const buttons = filterBar.querySelectorAll(".filter-btn");

    // 1. Calculate and update badge counts dynamically
    const categoryCounts = {
        ALL: projects.length
    };

    projects.forEach(project => {
        const cat = (project.dataset.category || "").toUpperCase();
        if (cat) {
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        }
    });

    buttons.forEach(button => {
        const filterKey = (button.dataset.filter || button.textContent.trim()).toUpperCase();
        const badge = button.querySelector(".filter-badge");
        if (badge) {
            badge.textContent = categoryCounts[filterKey] !== undefined ? categoryCounts[filterKey] : 0;
        }
    });

    // 2. Filter application logic
    function applyFilter(filterKey) {
        let visibleCount = 0;

        buttons.forEach(btn => {
            const btnFilter = (btn.dataset.filter || "").toUpperCase();
            if (btnFilter === filterKey) {
                btn.classList.add("active");
                btn.setAttribute("aria-pressed", "true");
            } else {
                btn.classList.remove("active");
                btn.setAttribute("aria-pressed", "false");
            }
        });

        projects.forEach(project => {
            const category = (project.dataset.category || "").toUpperCase();
            let isMatch = false;

            if (filterKey === "ALL") {
                isMatch = true;
            } else if (category === filterKey) {
                isMatch = true;
            } else {
                // Secondary check for badge content
                const badge = project.querySelector(".project-type-badge");
                if (badge && badge.textContent.trim().toUpperCase() === filterKey) {
                    isMatch = true;
                }
            }

            if (isMatch) {
                project.classList.remove("hidden");
                visibleCount++;
            } else {
                project.classList.add("hidden");
            }
        });

        // 3. Update status counters & accessibility readout
        if (countDisplay) {
            countDisplay.textContent = `SHOWING ${visibleCount} / ${projects.length} PROJECTS`;
        }

        // 4. Toggle empty state view
        if (emptyState) {
            if (visibleCount === 0) {
                emptyState.classList.remove("hidden");
            } else {
                emptyState.classList.add("hidden");
            }
        }
    }

    // Attach click listeners to filter buttons
    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const filterKey = (this.dataset.filter || "").toUpperCase();
            applyFilter(filterKey);
        });
    });

    // Reset button in empty state
    if (resetBtn) {
        resetBtn.addEventListener("click", function () {
            applyFilter("ALL");
        });
    }
});