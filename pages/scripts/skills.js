// Fetch skills data from JSON file
fetch("./scripts/skills.json")
  .then((response) => response.json())
  .then((data) => {
    // Function to generate language elements dynamically
    function generateLanguageElements() {
      const languagesContainer = document.querySelector(".languages-container");
      data.languages.forEach((language) => {
        const skillElement = createSkillElement(language.name, language.icon);
        languagesContainer.appendChild(skillElement);
      });
    }

    // Function to generate framework elements dynamically
    function generateFrameworkElements() {
      const frameworksContainer = document.querySelector(
        ".frameworks-container"
      );
      data.frameworks.forEach((framework) => {
        const skillElement = createSkillElement(framework.name, framework.icon);
        frameworksContainer.appendChild(skillElement);
      });
    }

    // Function to create skill element with icon
    function createSkillElement(name, icon) {
      const skillElement = document.createElement("div");
      skillElement.classList.add("skill");
      const iconImg = document.createElement("img");
      iconImg.src = `icons/${icon}`;
      skillElement.appendChild(iconImg);
      const skillName = document.createElement("span");
      skillName.textContent = name;
      skillElement.appendChild(skillName);
      return skillElement;
    }

    // Call the functions to generate language and framework elements
    generateLanguageElements();
    generateFrameworkElements();
  })
  .catch((error) => console.error("Error fetching skills:", error));
