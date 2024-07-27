document.addEventListener("DOMContentLoaded", function(){
    const filterBar = document.getElementById("filterBar");
    const projects = document.querySelectorAll(".d-project");
    // For each button in filter bar, use filter word to select through category
    // for all project cards.
    const filterWord = "VR";
    for (const project of projects) {
        const projectCategory = project.querySelector(".d-projectType");
        console.log(projectCategory);
    }

    // add event to buttons
    const buttons = filterBar.querySelectorAll(".button");
    
})