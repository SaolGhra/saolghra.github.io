// Sample data for the timeline
const experiences = [
  {
    date: "2018-2024",
    title: "Head of Data Entry / Operations",
    company: "Nexarda",
  },
  {
    date: "2023 - 2024",
    title: "Student Placement",
    company: "Placement for David Powell at Crawley College",
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
            <p>${exp.company}</p>
          </div>
        </div>
      `;
    timeline.appendChild(item);
  });
}

// Call the function to generate timeline items
generateTimelineItems();
