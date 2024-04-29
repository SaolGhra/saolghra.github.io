// Sample data for the timeline
const experiences = [
  {
    date: "2018-2024",
    title: "Head of Data Entry / Operations - Volunteer",
    description:
      "Volunteer at Nexarda working in the Data Entry and Operations department. Responsible for managing the data entry team and ensuring the data is accurate and up-to-date. also responsible for managing the operations team and ensuring the smooth running of the operations department. Furthermore, i also worked on increasing the speed of games being added by coding a script that would automatically add games to the database.",
    company: "Nexarda",
  },
  {
    date: "2023 - 2024",
    title: "Student Placement",
    description:
      "During my time on the placement, I worked on a variety of projects including crafting our own website called Atmosify which can be found in my projects section. I also worked on creating an information scraper that would scrape information from a website and store it in a database. this project can be found in my projects section under the name of 'Airliners Information Scraper'.",
    company: "Placement with David Powell at Crawley College",
  },
];

// Function to generate timeline items dynamically
function generateTimelineItems() {
  const timeline = document.querySelector(".timeline");
  experiences.forEach((exp) => {
    const item = document.createElement("div");
    item.classList.add("timeline-item");
    item.innerHTML = `
        <div class="timeline-item-content">
          <div class="timeline-item-date">${exp.date}</div>
          <div class="timeline-item-details">
            <h3>${exp.title}</h3>
            <h4>${exp.company}</h4>
            <h5>${exp.description}</h5>
          </div>
        </div>
      `;
    timeline.appendChild(item);
  });
}

// Call the function to generate timeline items
generateTimelineItems();
