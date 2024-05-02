const elementsToAnimate = document.querySelectorAll(
  "body > *:not(.header) >:not(canvas)"
);

const aboutSection = document.getElementById("about");
const divider = document.querySelector(".divider");

gsap.set(elementsToAnimate, { opacity: 0, x: "-100vw" });

if (aboutSection) {
  gsap.set(aboutSection, { opacity: 0, x: "100vw" });
}
if (divider) {
  if (window.innerWidth > 768) {
    gsap.set(divider, { opacity: 0, y: "100vh" });
  } else {
    gsap.set(divider, { display: "none" });
  }
}

gsap.to(elementsToAnimate, {
  duration: 1.5,
  opacity: 1,
  x: 0,
  ease: "power2.out",
  stagger: 0.2,
});

if (aboutSection) {
  gsap.to(aboutSection, {
    duration: 1.5,
    opacity: 1,
    x: 0,
    ease: "power2.out",
    delay: 0.5,
  });
}

// Animate .divider if present
if (divider) {
  if (window.innerWidth > 768) {
    gsap.to(divider, {
      duration: 1.5,
      opacity: 1,
      y: 0,
      ease: "power2.out",
      delay: 0.5,
    });
  }
}
