document.addEventListener("DOMContentLoaded", function(){
    const menuToggleButton = document.getElementById("menuToggle");
    let menuIsOpen = false;

    // Add event to Open Close menu
    menuToggleButton.addEventListener("click", function(event){
        event.stopPropagation();
        menuIsOpen = !menuIsOpen;
        displayMenu(menuIsOpen);
    })

    // Close Menu if there is a click outside the main-menu container.
    const menuContainer = document.querySelector(".main-menu");
    document.addEventListener('click', (event) => {
        if (!menuContainer.contains(event.target) && !menuToggleButton.contains(event.target)) {
            displayMenu(false);
        }
    });

    displayMenu(false);
})

function displayMenu(open){
    const navGroup = document.querySelector(".nav-group");
    if(open){
        navGroup.classList.remove("close");
    }
    else{
        navGroup.classList.add("close");
    }
}