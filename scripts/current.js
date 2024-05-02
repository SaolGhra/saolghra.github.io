document.addEventListener("DOMContentLoaded", function () {
  fetch("./scripts/projects.json")
    .then((response) => response.json())
    .then((projects) => {
      const timeline = document.querySelector(".project-timeline");

      projects.sort((a, b) => new Date(b.date) - new Date(a.date));

      const currentDate = new Date();

      projects.forEach((project) => {
        const timelineItem = document.createElement("div");
        timelineItem.classList.add("project-timeline-item");

        let projectStartDate, projectEndDate;

        const dateFormats = ["DD/MM/YYYY"];
        const [startDate, endDate] = project.date.split(" - ");

        projectStartDate = parseDate(startDate.trim(), dateFormats);
        projectEndDate =
          endDate.trim() === "{date.now}"
            ? currentDate
            : parseDate(endDate.trim(), dateFormats);

        if (isNaN(projectStartDate.getTime())) {
          console.error("Invalid start date format:", startDate);
          return;
        }

        const formattedStartDate = formatDate(projectStartDate);
        const formattedEndDate =
          projectEndDate === currentDate ? "Today" : formatDate(projectEndDate);

        timelineItem.innerHTML = `
            <h3>${project.title}</h3>
            <p>${formattedStartDate} - ${formattedEndDate}</p>
            <p>${project.description}</p>
          `;

        timeline.appendChild(timelineItem);
      });
    })
    .catch((error) => console.error("Error loading projects:", error));

  // Fetch and update skills
  fetch("../pages/scripts/skills.json")
    .then((response) => response.json())
    .then((skills) => {
      const languagesCount = skills.languages.length;
      const frameworksCount = skills.frameworks.length;

      const aboutSection = document.getElementById("about");
      const aboutParagraph = aboutSection.querySelector("p");

      aboutParagraph.innerHTML = `
        Hey, I'm Spencer Bullock, a full-stack software engineer with a
        passion for turning ideas into functional solutions.<br /><br />

        Proficient in ${languagesCount} languages and ${frameworksCount} frameworks, including HTML, CSS,
        Python, Java, JavaScript, C#, C++, and Golang, I specialize in web and
        app development.<br /><br />

        Outside of coding, you'll find me gaming, honing my music skills, and
        hanging out with friends.<br /><br />

        Excited for the next challenge in software engineering!
      `;
    })
    .catch((error) => console.error("Error loading skills:", error));
});

function parseDate(dateString, formats) {
  for (let format of formats) {
    const [day, month, year] = dateString.split(/[/-]/);
    const parsedDate = new Date(year, month - 1, day);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }
  return new Date(NaN);
}

function formatDate(date) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
