// Sample project data
const projects = [
  {
    name: "Project 1",
    description: "Description of Project 1",
    skills: ["HTML", "CSS", "JavaScript"],
  },
  {
    name: "Project 2",
    description: "Description of Project 2",
    skills: ["Python", "Django", "SQL"],
  },
  {
    name: "Project 3",
    description: "Description of Project 3",
    skills: ["React", "Node.js", "MongoDB"],
  },
];

// Function to generate project cards
function generateProjectCards() {
  const projectList = document.getElementById("project-list");
  const grid = document.createElement("div");
  grid.classList.add("grid");

  projects.forEach((project) => {
    const card = document.createElement("a"); // Change div to anchor tag
    card.classList.add("project-card");
    card.href = project.link; // Set href to project link
    card.innerHTML = `
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <p>Skills: ${project.skills.join(", ")}</p>
        `;
    grid.appendChild(card);
  });

  projectList.appendChild(grid);
}

// Call the function to generate project cards when the page loads
window.onload = generateProjectCards;

// Function to implement search feature
function searchProjects() {
  const searchTerm = document.getElementById("search").value.toLowerCase();
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    const projectName = card.querySelector("h3").textContent.toLowerCase();
    const projectDescription = card
      .querySelector("p")
      .textContent.toLowerCase();

    if (
      projectName.includes(searchTerm) ||
      projectDescription.includes(searchTerm)
    ) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Optional: Add event listener for search input
document.getElementById("search").addEventListener("input", searchProjects);
