document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  if (!header) {
    console.error("Header element not found");
    return;
  }
  let isNearTop = false;

  window.addEventListener("mousemove", (event) => {
    const distanceFromTop = event.clientY;
    if (distanceFromTop < window.innerHeight * 0.15 && !isNearTop) {
      header.classList.add("show");
      isNearTop = true;
    } else if (distanceFromTop >= window.innerHeight * 0.15 && isNearTop) {
      header.classList.remove("show");
      isNearTop = false;
    }
  });
});

// add resizing for mobile
window.addEventListener("resize", () => {
  const header = document.querySelector(".header");
  if (window.innerWidth < 768) {
    header.classList.add("show");
  } else {
    header.classList.remove("show");
  }
});
