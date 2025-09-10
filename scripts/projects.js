document.addEventListener('DOMContentLoaded', async () => {
  await loadAllProjects();
  setupProjectFilters();
  applyThemePreference();
});

async function loadAllProjects() {
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) return;

  try {
    const projectsData = await fetchJsonData('data/projects.json');
    if (!projectsData || !Array.isArray(projectsData)) {
      projectsGrid.innerHTML = '<div class="error-message">Failed to load projects.</div>';
      return;
    }

    projectsGrid.innerHTML = '';

    // Show all projects that have at least a name
    const validProjects = projectsData.filter(project => project && project.name);

    validProjects.forEach(project => {
      const projectCard = createProjectCard(project);
      projectsGrid.appendChild(projectCard);
    });

    setupProjectExpansion();
  } catch (error) {
    console.error('Error loading projects:', error);
    projectsGrid.innerHTML = '<div class="error-message">Failed to load projects.</div>';
  }
}

function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = `project-card${project.featured ? ' featured' : ''}`;

  // Use the category field for filtering
  if (project.category) {
    card.setAttribute('data-categories', project.category.toLowerCase());
  } else if (project.skills) {
    card.setAttribute('data-categories', project.skills.join(',').toLowerCase());
  }

  // Project image or fallback
  if (project.image) {
    const img = document.createElement('img');
    img.src = project.image;
    img.alt = project.name || 'Project';
    img.className = 'project-img';
    img.loading = 'lazy';
    img.onerror = function () {
      const fallback = document.createElement('div');
      fallback.className = 'project-img project-img-fallback';
      fallback.style.backgroundColor = '#1a1a1a';
      const initials = project.name
        ? project.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
        : 'P';
      fallback.innerHTML = `<span>${initials}</span>`;
      this.parentNode.replaceChild(fallback, this);
    };
    card.appendChild(img);
  } else {
    const fallback = document.createElement('div');
    fallback.className = 'project-img project-img-fallback';
    fallback.style.backgroundColor = '#1a1a1a';
    const initials = project.name
      ? project.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
      : 'P';
    fallback.innerHTML = `<span>${initials}</span>`;
    card.appendChild(fallback);
  }

  // Content
  const content = document.createElement('div');
  content.className = 'project-content';

  const title = document.createElement('h3');
  title.className = 'project-title';
  title.textContent = project.name || 'Project Name';
  content.appendChild(title);

  const description = document.createElement('p');
  description.className = 'project-description';
  description.textContent = project.description || 'No description available';
  content.appendChild(description);

  if (project.description && project.description.length > 120) {
    const readMoreBtn = document.createElement('button');
    readMoreBtn.className = 'read-more-btn';
    readMoreBtn.textContent = 'Read More →';
    readMoreBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      description.classList.toggle('project-description-expanded');
      this.textContent = description.classList.contains('project-description-expanded')
        ? 'Read Less ←'
        : 'Read More →';
    });
    content.appendChild(readMoreBtn);
  }

  if (project.skills && project.skills.length) {
    const techContainer = document.createElement('div');
    techContainer.className = 'project-tech';
    project.skills.slice(0, 4).forEach(skill => {
      const techItem = document.createElement('span');
      techItem.className = 'project-tech-item';
      techItem.textContent = skill;
      techContainer.appendChild(techItem);
    });
    content.appendChild(techContainer);
  }

  const linksContainer = document.createElement('div');
  linksContainer.className = 'project-links';

  if (project.github) {
    const githubLink = document.createElement('a');
    githubLink.href = project.github;
    githubLink.className = 'project-link';
    githubLink.target = '_blank';
    githubLink.rel = 'noopener noreferrer';
    githubLink.innerHTML = '<i class="fab fa-github"></i>';
    githubLink.title = 'View Source Code';
    linksContainer.appendChild(githubLink);
  }

  if (project.link) {
    const demoLink = document.createElement('a');
    demoLink.href = project.link;
    demoLink.className = 'project-link';
    demoLink.target = '_blank';
    demoLink.rel = 'noopener noreferrer';
    demoLink.innerHTML = '<i class="fas fa-external-link-alt"></i>';
    demoLink.title = 'View Live Project';
    linksContainer.appendChild(demoLink);
  }

  content.appendChild(linksContainer);
  card.appendChild(content);

  return card;
}

function setupProjectExpansion() {
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('click', function (e) {
      if (e.target.closest('a') || e.target.closest('button')) return;
      const description = this.querySelector('.project-description');
      if (!description) return;
      description.classList.toggle('project-description-expanded');
      const readMoreBtn = this.querySelector('.read-more-btn');
      if (readMoreBtn) {
        readMoreBtn.textContent = description.classList.contains('project-description-expanded')
          ? 'Read Less ←'
          : 'Read More →';
      }
    });
  });
}

function setupProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      document.querySelector('.filter-btn.active')?.classList.remove('active');
      button.classList.add('active');
      const filterValue = button.getAttribute('data-filter');
      filterProjects(filterValue);
    });
  });
}

function filterProjects(filterValue) {
  const projectCards = document.querySelectorAll('.project-card');
  const filterMap = {
    'web': ['web development', 'ui/ux', 'web game', 'web animation'],
    'software': ['software', 'utility', 'data science', 'computer vision', 'graphics'],
    'mod': ['game development', 'mod', 'minecraft'],
  };
  projectCards.forEach(card => {
    if (filterValue === 'all') {
      card.classList.remove('filtered-out');
      return;
    }
    const categories = card.getAttribute('data-categories') || '';
    const matches = filterMap[filterValue]
      ? filterMap[filterValue].some(term => categories.includes(term))
      : categories.includes(filterValue);
    if (matches) {
      card.classList.remove('filtered-out');
    } else {
      card.classList.add('filtered-out');
    }
  });
}

function applyThemePreference() {
  const savedTheme = localStorage.getItem('theme');
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleIcon = document.querySelector('.theme-toggle-icon');
  if (savedTheme === 'light' && themeToggle && themeToggleIcon) {
    document.body.classList.add('light-theme');
    themeToggleIcon.classList.remove('fa-moon');
    themeToggleIcon.classList.add('fa-sun');
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      if (document.body.classList.contains('light-theme')) {
        themeToggleIcon.classList.remove('fa-moon');
        themeToggleIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
      } else {
        themeToggleIcon.classList.remove('fa-sun');
        themeToggleIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
      }
    });
  }
}

// Utility: fetchJsonData (if not globally available)
async function fetchJsonData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return null;
  }
}