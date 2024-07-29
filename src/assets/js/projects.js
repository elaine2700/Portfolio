document.addEventListener("DOMContentLoaded", function(){
    
    const projects = document.querySelectorAll(".d-project");
    // For each button in filter bar, use filter word to select through category
    // for all project cards.
    

    // add event to buttons
    const filterBar = document.getElementById("filterBar");
    const buttons = filterBar.querySelectorAll(".button");
    for (const button of buttons) {
        const filterLabel = button.innerHTML;
        button.addEventListener("click", function(){
            console.log(`${filterLabel} button`);
            filterProjects(filterLabel, projects);
        })
    }
})

function filterProjects(filterKey, projects){
    if(filterKey === "All"){
        console.log("reset");
        return;
    }
    for (const project of projects) {
        const projectCategory = project.querySelector(".d-projectType");
        if(filterKey !== projectCategory.innerHTML){
            project.classList.add("hidden");
        }
        console.log(projectCategory);
    }
}