let toggleBtn = document.getElementById("toggle-btn");
let menuItems = document.querySelectorAll(".menu a");
let menuActive = false;
toggleBtn.addEventListener("click", () => {
    if (!menuActive) {
        menuItems[0].style.transform = "translate(-150px,0)";
        menuItems[1].style.transform = "translate(-150px,90px)";
        menuItems[2].style.transform = "translate(-90px,150px)";
        menuItems[3].style.transform = "translate(0,150px)";
        menuActive = true;
        toggleBtn.classList.add("active");
    }
    else {
        menuItems.forEach(menuItem => {
            menuItem.style.transform = "translate(0,0)";
            menuActive = false;
        });
        toggleBtn.classList.remove("active");
    }
});


console.log(toggleBtn, menuItems);

function tiltWithMouse(event) {
    const project = event.currentTarget;
    const rect = project.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = (x - centerX) / 14; // Adjust the divisor for sensitivity
    const rotateX = (centerY - y) / 14;

    project.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function resetTilt(event) {
    const project = event.currentTarget;
    project.style.transform = 'none';
}
