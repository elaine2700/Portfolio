document.addEventListener("DOMContentLoaded", function () {
    const projects = document.querySelectorAll(".project-card");
    const filterBar = document.getElementById("filterBar");

    if (!filterBar) return;

    const buttons = filterBar.querySelectorAll(".filter-btn");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            // Remove active class from all buttons
            buttons.forEach(btn => btn.classList.remove("active"));
            // Add active class to clicked button
            this.classList.add("active");

            const filterValue = this.textContent.trim();
            filterProjects(filterValue, projects);
        });
    });
});

function filterProjects(filterKey, projects) {
    projects.forEach(project => {
        if (filterKey === "ALL") {
            project.classList.remove("hidden");
            return;
        }

        const projectTypeBadge = project.querySelector(".project-type-badge");
        const projectType = projectTypeBadge ? projectTypeBadge.textContent.trim() : "";

        // Case-insensitive comparison or exact match depending on requirements.
        // The buttons are uppercase, assuming text in badge might vary or be same.
        if (projectType.toUpperCase() === filterKey.toUpperCase()) {
            project.classList.remove("hidden");
        } else {
            project.classList.add("hidden");
        }
    });
}