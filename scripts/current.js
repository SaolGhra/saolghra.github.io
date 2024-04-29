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
