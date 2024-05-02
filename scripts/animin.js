// Select all elements except the header
const elementsToAnimate = document.querySelectorAll(
  "body > *:not(.header) >:not(canvas)"
);

// Select the elements with specific IDs and classes
const aboutSection = document.getElementById("about");
const divider = document.querySelector(".divider");

// Set initial properties for elementsToAnimate
gsap.set(elementsToAnimate, { opacity: 0, x: "-100vw" });

// Set initial properties for #about and .divider if present
if (aboutSection) {
  gsap.set(aboutSection, { opacity: 0, x: "100vw" });
}
if (divider) {
  // Hide the divider on mobile screens
  if (window.innerWidth > 768) {
    // Adjust the breakpoint as needed
    gsap.set(divider, { opacity: 0, y: "100vh" });
  } else {
    gsap.set(divider, { display: "none" });
  }
}

// Animate the elementsToAnimate
gsap.to(elementsToAnimate, {
  duration: 1.5,
  opacity: 1,
  x: 0,
  ease: "power2.out",
  stagger: 0.2,
});

// Animate #about if present
if (aboutSection) {
  gsap.to(aboutSection, {
    duration: 1.5,
    opacity: 1,
    x: 0,
    ease: "power2.out",
    delay: 0.5, // Delay to start after elementsToAnimate animation
  });
}

// Animate .divider if present
if (divider) {
  if (window.innerWidth > 768) {
    // Adjust the breakpoint as needed
    gsap.to(divider, {
      duration: 1.5,
      opacity: 1,
      y: 0, // Change from x: 0 to y: 0
      ease: "power2.out",
      delay: 0.5, // Delay to start after elementsToAnimate animation
    });
  }
}
