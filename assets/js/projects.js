document.addEventListener("DOMContentLoaded", function(){
    const projects = document.querySelectorAll(".d-project");

    // add event to buttons
    const filterBar = document.getElementById("filterBar");
    const buttons = filterBar.querySelectorAll(".button");
    for (const button of buttons) {
        const filterLabel = button.innerHTML;
        button.addEventListener("click", function(){
            filterProjects(filterLabel, projects);
        })
    }
})

function ResetFilter(projects){
    for (const project of projects) {
        project.classList.remove("hidden");
    }
}

function filterProjects(filterKey, projects){
    ResetFilter(projects);
    if(filterKey === "All"){
        return;
    }
    for (const project of projects) {
        const projectCategory = project.querySelector(".d-projectType");
        if(filterKey !== projectCategory.innerHTML){
            project.classList.add("hidden");
        }
    }
}