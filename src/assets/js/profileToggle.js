document.addEventListener("DOMContentLoaded", function(){
    const profileToggle = document.getElementById("toggle");
    const lensImg = document.querySelector(".lens");
    profileToggle.addEventListener("change", function(){
        console.log("hello");
        toggleVisibility(lensImg, this.checked);
    })

    profileToggle.checked = true;
    toggleVisibility(lensImg, profileToggle.checked);
})

function toggleVisibility(element, isVisible){
    if(isVisible){
        element.classList.remove("invisible");
    }
    else{
        element.classList.add("invisible");
    }
}