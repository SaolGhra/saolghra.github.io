// Adjust canvas height
var canvas = document.querySelector("canvas");
canvas.height = document.documentElement.scrollHeight;

// GSAP animation
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
    gsap.set(divider, {
      opacity: 0,
      y: "100vh",
      x: "50%",
      transform: "translateX(-50%)",
    });
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

// Additional animations
const skillsSection = document.getElementById("skills");
if (skillsSection) {
  const h2Skills = skillsSection.querySelector("h2");
  const languages = document.querySelector(".languages");
  const frameworks = document.querySelector(".frameworks");

  if (h2Skills) {
    gsap.from(h2Skills, {
      duration: 2,
      opacity: 0,
      y: "-250vh",
      ease: "power2.out",
      delay: 0.5,
    });
  }

  if (languages) {
    gsap.from(languages, {
      duration: 1.5,
      opacity: 0,
      x: "-100%",
      ease: "power2.out",
      delay: 0.5,
    });
  }

  if (frameworks) {
    gsap.from(frameworks, {
      duration: 1.5,
      opacity: 0,
      x: "100%",
      ease: "power2.out",
      delay: 0.5,
    });
  }
}
