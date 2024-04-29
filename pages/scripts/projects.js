// Function to fetch project data from JSON file
async function fetchProjects() {
  try {
    const response = await fetch("./scripts/projects.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching project data:", error);
    return [];
  }
}

// Function to generate project cards
async function generateProjectCards() {
  const projectList = document.getElementById("project-list");
  const grid = document.createElement("div");
  grid.classList.add("grid");

  const projects = await fetchProjects();
  projects.forEach((project) => {
    const card = document.createElement("div");
    card.classList.add("project-card");

    if (project.link) {
      const link = document.createElement("a");
      link.href = project.link;
      link.target = "_blank";
      link.innerHTML = `
              <h3>${project.name}</h3>
              <p>${project.description}</p>
              <p>Skills: ${project.skills.join(", ")}</p>
          `;
      card.appendChild(link);
    } else {
      card.innerHTML = `
              <h3>${project.name}</h3>
              <p>${project.description}</p>
              <p>Skills: ${project.skills.join(", ")}</p>
          `;
    }

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

document.getElementById("search").addEventListener("input", searchProjects);
