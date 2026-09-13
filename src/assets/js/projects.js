/**
 * Projects Filtering & Dossier Modal Script
 * Aligned with DESIGN.md specifications & History API URL synchronization
 */

document.addEventListener("DOMContentLoaded", function () {
    // ==========================================================================
    // 1. FILTERING & METRICS SYSTEM
    // ==========================================================================
    const projects = Array.from(document.querySelectorAll(".project-card"));
    const filterBar = document.getElementById("filterBar");
    const countDisplay = document.getElementById("projectCountDisplay");
    const emptyState = document.getElementById("emptyProjectsState");
    const resetBtn = document.getElementById("resetFilterBtn");

    if (filterBar && projects.length > 0) {
        const buttons = filterBar.querySelectorAll(".filter-btn");

        // Calculate and update category counts dynamically
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

            if (countDisplay) {
                countDisplay.textContent = `SHOWING ${visibleCount} / ${projects.length} PROJECTS`;
            }

            if (emptyState) {
                if (visibleCount === 0) {
                    emptyState.classList.remove("hidden");
                } else {
                    emptyState.classList.add("hidden");
                }
            }
        }

        buttons.forEach(button => {
            button.addEventListener("click", function () {
                const filterKey = (this.dataset.filter || "").toUpperCase();
                applyFilter(filterKey);
            });
        });

        if (resetBtn) {
            resetBtn.addEventListener("click", function () {
                applyFilter("ALL");
            });
        }
    }

    // ==========================================================================
    // 2. PROJECT DOSSIER MODAL & URL SYNCHRONIZATION
    // ==========================================================================
    const modalBackdrop = document.getElementById("projectModalBackdrop");
    const modalWindow = document.getElementById("projectModalWindow");
    const modalCloseBtn = document.getElementById("modalCloseBtn");
    const modalReturnBtn = document.getElementById("modalReturnBtn");
    const modalPrevBtn = document.getElementById("modalPrevBtn");
    const modalNextBtn = document.getElementById("modalNextBtn");
    const modalScrollBody = document.getElementById("modalScrollBody");

    const modalDossierId = document.getElementById("modalDossierId");
    const modalDossierTitle = document.getElementById("modalDossierTitle");
    const modalCounterText = document.getElementById("modalCounterText");

    const dossierPanes = Array.from(document.querySelectorAll(".project-dossier-pane"));

    if (!modalBackdrop || dossierPanes.length === 0) return;

    let currentProjectId = null;

    function getPaneById(id) {
        return dossierPanes.find(p => String(p.dataset.id) === String(id));
    }

    function getPaneIndex(id) {
        return dossierPanes.findIndex(p => String(p.dataset.id) === String(id));
    }

    function openDossier(id, updateUrl = true) {
        const targetPane = getPaneById(id);
        if (!targetPane) return;

        currentProjectId = String(id);
        const index = getPaneIndex(id);

        // Deactivate other panes, activate target pane
        dossierPanes.forEach(pane => {
            const iframe = pane.querySelector(".dossier-video-frame");
            if (pane === targetPane) {
                pane.classList.add("is-active");
                // Activate video player if available and not yet loaded
                if (iframe && pane.dataset.trailer) {
                    if (!iframe.src || iframe.src === "about:blank") {
                        iframe.src = pane.dataset.trailer;
                    }
                }
            } else {
                pane.classList.remove("is-active");
                // Stop any playing video in inactive panes
                if (iframe) {
                    iframe.src = "";
                }
            }
        });

        // Update Topbar Info
        if (modalDossierId) {
            modalDossierId.textContent = targetPane.dataset.index || `PRJ-0${index + 1}`;
        }
        if (modalDossierTitle) {
            modalDossierTitle.textContent = targetPane.dataset.title || "PROJECT DETAILS";
        }
        if (modalCounterText) {
            modalCounterText.textContent = `PROJECT ${index + 1} OF ${dossierPanes.length}`;
        }

        // Show Modal
        modalBackdrop.classList.add("is-open");
        modalBackdrop.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");

        // Scroll dossier to top
        if (modalScrollBody) {
            modalScrollBody.scrollTop = 0;
        }

        // Update URL & Page Title
        const newPath = `/projects/${id}/`;
        if (updateUrl && window.location.pathname !== newPath) {
            window.history.pushState({ modalOpen: true, projectId: String(id) }, "", newPath);
        }
        document.title = `Elaine Serrano | ${targetPane.dataset.title || "Project"}`;
    }

    function closeDossier(updateUrl = true) {
        modalBackdrop.classList.remove("is-open");
        modalBackdrop.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");

        // Unload all iframes to stop playback immediately
        dossierPanes.forEach(pane => {
            const iframe = pane.querySelector(".dossier-video-frame");
            if (iframe) {
                iframe.src = "";
            }
        });

        currentProjectId = null;

        // Revert URL to /projects/
        if (updateUrl && window.location.pathname !== "/projects/") {
            window.history.pushState({ modalOpen: false }, "", "/projects/");
        }
        document.title = "Elaine Serrano | Projects";
    }

    function navigateDossier(direction) {
        if (currentProjectId === null) return;
        const currentIndex = getPaneIndex(currentProjectId);
        if (currentIndex === -1) return;

        let nextIndex = currentIndex + direction;
        if (nextIndex < 0) {
            nextIndex = dossierPanes.length - 1;
        } else if (nextIndex >= dossierPanes.length) {
            nextIndex = 0;
        }

        const nextId = dossierPanes[nextIndex].dataset.id;
        openDossier(nextId, true);
    }

    // Attach Click Handlers to Card "MORE" Buttons
    document.querySelectorAll(".open-dossier-trigger").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            const projectId = this.dataset.projectId;
            if (projectId !== undefined) {
                openDossier(projectId, true);
            }
        });
    });

    // Close Button Handlers
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", function () {
            closeDossier(true);
        });
    }

    if (modalReturnBtn) {
        modalReturnBtn.addEventListener("click", function () {
            closeDossier(true);
        });
    }

    // Backdrop Click Handler (close when clicking outside modal window)
    modalBackdrop.addEventListener("click", function (e) {
        if (e.target === modalBackdrop) {
            closeDossier(true);
        }
    });

    // Prev / Next Navigation Handlers
    if (modalPrevBtn) {
        modalPrevBtn.addEventListener("click", function () {
            navigateDossier(-1);
        });
    }

    if (modalNextBtn) {
        modalNextBtn.addEventListener("click", function () {
            navigateDossier(1);
        });
    }

    // Keyboard Shortcuts (ESC to close, Left/Right arrows to navigate)
    document.addEventListener("keydown", function (e) {
        if (!modalBackdrop.classList.contains("is-open")) return;

        if (e.key === "Escape") {
            closeDossier(true);
        } else if (e.key === "ArrowLeft") {
            navigateDossier(-1);
        } else if (e.key === "ArrowRight") {
            navigateDossier(1);
        }
    });

    // Handle Browser History Back / Forward (popstate)
    window.addEventListener("popstate", function () {
        const pathMatch = window.location.pathname.match(/\/projects\/(\d+)\/?/);
        if (pathMatch && pathMatch[1] !== undefined) {
            openDossier(pathMatch[1], false);
        } else {
            closeDossier(false);
        }
    });

    // Initial State Check (Direct Page Visit or Pre-opened Modal)
    const initialId = modalBackdrop.dataset.initialId;
    const directPathMatch = window.location.pathname.match(/\/projects\/(\d+)\/?/);

    if (initialId !== undefined && initialId !== "") {
        openDossier(initialId, false);
    } else if (directPathMatch && directPathMatch[1] !== undefined) {
        openDossier(directPathMatch[1], false);
    }
});