document.addEventListener('DOMContentLoaded', async () => {
  await loadAllProjects();
  await setupProjectFilters();
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

  // Only add read more button if description is long enough to be truncated
  let readMoreBtn = null;
  if (project.description && project.description.length > 100) {
    readMoreBtn = document.createElement('button');
    readMoreBtn.className = 'read-more-btn';
    readMoreBtn.textContent = 'Read More';
    readMoreBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      description.classList.toggle('project-description-expanded');
      this.textContent = description.classList.contains('project-description-expanded')
        ? 'Read Less'
        : 'Read More';
    });
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

  // Create left container for read more button
  const linksLeft = document.createElement('div');
  linksLeft.className = 'project-links-left';

  // Create right container for GitHub and website links
  const linksRight = document.createElement('div');
  linksRight.className = 'project-links-right';

  // Add GitHub link to right container
  if (project.github) {
    const githubLink = document.createElement('a');
    githubLink.href = project.github;
    githubLink.className = 'project-link';
    githubLink.target = '_blank';
    githubLink.rel = 'noopener noreferrer';
    githubLink.innerHTML = '<i class="fab fa-github"></i>';
    githubLink.title = 'View Source Code';
    linksRight.appendChild(githubLink);
  }

  // Add website link to right container
  if (project.link) {
    const demoLink = document.createElement('a');
    demoLink.href = project.link;
    demoLink.className = 'project-link';
    demoLink.target = '_blank';
    demoLink.rel = 'noopener noreferrer';
    demoLink.innerHTML = '<i class="fas fa-external-link-alt"></i>';
    demoLink.title = 'View Live Project';
    linksRight.appendChild(demoLink);
  }

  // Add read more button to left container if it exists
  if (readMoreBtn) {
    linksLeft.appendChild(readMoreBtn);
  }

  // Add both containers to main links container
  linksContainer.appendChild(linksLeft);
  linksContainer.appendChild(linksRight);

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

async function setupProjectFilters() {
  // Get all unique categories from projects
  const projectsData = await fetchJsonData('data/projects.json');
  const categories = new Set(['all']); // Always include 'all'
  
  if (projectsData && Array.isArray(projectsData)) {
    projectsData.forEach(project => {
      if (project.category) {
        categories.add(project.category.toLowerCase());
      }
    });
  }
  
  // Generate filter buttons for both main and modal
  const filterContainers = document.querySelectorAll('.project-filters, .modal-filters');
  
  filterContainers.forEach(container => {
    if (container) {
      container.innerHTML = '';
      
      // Create buttons for each category
      Array.from(categories).sort().forEach(category => {
        const button = document.createElement('button');
        button.className = `filter-btn${category === 'all' ? ' active' : ''}`;
        button.setAttribute('data-filter', category);
        button.textContent = category === 'all' ? 'All' : 
          category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        container.appendChild(button);
      });
    }
  });
  
  // Setup event listeners for all filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons in the same container
      const container = button.closest('.project-filters, .modal-filters');
      if (container) {
        container.querySelector('.filter-btn.active')?.classList.remove('active');
      }
      
      button.classList.add('active');
      const filterValue = button.getAttribute('data-filter');
      filterProjects(filterValue);
    });
  });
}

function filterProjects(filterValue) {
  // Filter both main projects and modal projects
  const projectGrids = document.querySelectorAll('#projects-grid, #modal-projects-grid');
  
  projectGrids.forEach(grid => {
    const projectCards = grid.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      if (filterValue === 'all') {
        card.classList.remove('filtered-out');
        return;
      }
      
      const categories = card.getAttribute('data-categories') || '';
      const matches = categories.includes(filterValue);
      
      if (matches) {
        card.classList.remove('filtered-out');
      } else {
        card.classList.add('filtered-out');
      }
    });
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