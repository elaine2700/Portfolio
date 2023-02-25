
// menu Button
let toogleMenuButton = document.querySelector('.toggle');

function toggleMenu() {
    let x = document.querySelector(".main-nav");
    if(x.className == "main-nav")
        x.className += " display window";
    else
        x.className = "main-nav";

    //todo change icon from bars to x
    let icon = x.querySelector(".icon");
    if(icon.className === "icon fa fa-bars")
        icon.className = "icon fa-solid fa-x ";
    else
        icon.className = "icon fa fa-bars";
}

toogleMenuButton.onclick = toggleMenu;

// VR Checkbox

const vrCheckbox = document.getElementById("VR-Toggle");

function ClickVRCheckbox(){
    const lensImage = document.getElementById("icon-lens");

    if(vrCheckbox.checked == true){
        lensImage.className = "visible transition-normalState";
    }
    else{
        lensImage.className = "invisible transition-right";
    }
}

vrCheckbox.onclick = ClickVRCheckbox;