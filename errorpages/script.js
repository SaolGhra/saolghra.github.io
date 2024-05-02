document.addEventListener("DOMContentLoaded", function () {
  // Adjust canvas height
  var canvas = document.querySelector("canvas");
  canvas.height = document.documentElement.scrollHeight;

  // GSAP animation
  gsap.from(".card", {
    duration: 1,
    x: "-100%",
    opacity: 0,
    ease: "power4.out",
    delay: 0.5,
  });
});

// Resize listener
window.addEventListener("resize", function () {
  var canvas = document.querySelector("canvas");
  canvas.height = document.documentElement.scrollHeight;
});
