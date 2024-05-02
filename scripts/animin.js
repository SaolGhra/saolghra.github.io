import { gsap } from "../node_modules/gsap/index.js";

// Select all elements except the header
const elementsToAnimate = document.querySelectorAll(
  "body > *:not(.header) >:not(canvas)"
);

// Set initial properties
gsap.set(elementsToAnimate, { opacity: 0, x: "-100vw" });

// Animate the elements
gsap.to(elementsToAnimate, {
  duration: 1.5,
  opacity: 1,
  x: 0,
  ease: "power2.out",
  stagger: 0.2,
});
