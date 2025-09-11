// DOM Elements
const header = document.getElementById('header');
const scrollProgress = document.querySelector('.scroll-progress');
const blogToggleBtn = document.getElementById('blog-toggle-btn');
const blogGrid = document.querySelector('.blog-grid');
const contactForm = document.getElementById('contact-form');
const themeToggle = document.getElementById('theme-toggle');
const themeToggleIcon = document.querySelector('.theme-toggle-icon');
const projectsContainer = document.getElementById('projects-grid');
const skillsContainer = document.getElementById('skills-container');

// Data paths
const DATA_PATHS = {
  projects: 'data/projects.json',
  skills: 'data/skills.json',
  general: 'data/general.json',
  blogConfig: 'data/blog-config.json'
};

// Typing Animation Variables
const textArray = ["Software Engineer", "Mod Developer", "Web Developer"];
let textArrayIndex = 0;
let charIndex = 0;
let typingDelay = 100; // Delay between each character typing
let erasingDelay = 50; // Delay between each character erasing
let newTextDelay = 2000; // Delay before typing starts again
let isTyping = true;

// Terminal Variables
let currentDirectory = '/';
let generalData = null;

// Initialize Website
document.addEventListener('DOMContentLoaded', async () => {
  // Load general data
  await loadGeneralData();
  
  // Load projects
  loadProjects(6); // Show up to 6 projects
  
  // Set up project filters
  setupProjectFilters();
  
  // Load skills
  await loadSkills();
  
  // Check if blog should be visible
  await checkBlogVisibility();
  
  // Start typing animation
  const typedTextElement = document.querySelector('.typed-text');
  const cursorElement = document.querySelector('.cursor');
  if (typedTextElement && cursorElement) {
    setTimeout(type, newTextDelay + 250);
  }
  
  // Set initial scroll position for header
  checkScroll();

  // Render terminal from general.json
  await renderTerminalFromGeneralJson();
  
  // Setup projects modal
  setupProjectsModal();
  
  // Handle window resize for responsive neofetch layout
  window.addEventListener('resize', () => {
    // Re-render terminal if needed for layout changes
    const terminalBody = document.querySelector('.terminal-body');
    if (terminalBody && terminalBody.children.length > 0) {
      // Check if the last output is neofetch and re-run it if layout changed
      const lastOutput = terminalBody.lastElementChild;
      if (lastOutput && lastOutput.classList.contains('terminal-output') && 
          lastOutput.textContent.includes('OS: Portfolio v3.0')) {
        // Clear and re-run neofetch
        terminalBody.innerHTML = '';
        processTerminalCommand('neofetch', terminalBody, document.querySelector('.terminal-input-line'), {});
      }
    }
  });
  
  // Setup mobile menu functionality
  setupMobileMenu();
});

// Setup mobile menu functionality
function setupMobileMenu() {
  // Re-select elements to ensure they exist
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuLinks = document.querySelectorAll('.mobile-nav-link');
  
  // Check if mobile menu elements exist
  if (!mobileMenuBtn || !mobileMenu) {
    console.warn('Mobile menu elements not found');
    return;
  }
  
  // Mobile Menu Toggle
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
    
    // Change icon
    const icon = mobileMenuBtn.querySelector('i');
    if (icon) {
      if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    }
  });

  // Close mobile menu when clicking on a link
  if (mobileMenuLinks && mobileMenuLinks.length > 0) {
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      });
    });
  }
}

// Fix loading of hero content
async function loadGeneralData() {
  try {
    const generalDataTemp = await fetchJsonData(DATA_PATHS.general);
    if (!generalDataTemp) return;

    // Load projects data and merge it into generalData
    const projectsData = await fetchJsonData(DATA_PATHS.projects);
    if (projectsData) {
      generalDataTemp.projects = projectsData;
    }

    // Set the global generalData
    generalData = generalDataTemp;

    // Set hero content
    if (generalData.hero) {
      const introElem = document.querySelector('.hero-intro');
      const nameElem = document.querySelector('.hero-name');
      const descElem = document.querySelector('.hero-description');
      
      if (introElem) introElem.textContent = generalData.hero.intro || 'Hi, my name is';
      if (nameElem) nameElem.textContent = generalData.hero.name || 'Spencer Bullock.';
      if (descElem) descElem.textContent = generalData.hero.description || '';
      
      // If custom typing texts are provided
      if (generalData.hero.typingTexts && generalData.hero.typingTexts.length > 0) {
        textArray.length = 0; // Clear default array
        generalData.hero.typingTexts.forEach(text => textArray.push(text));
      }
    }
    
    // Set contact info
    if (generalData.contact) {
      const emailLink = document.querySelector('a[href^="mailto:"]');
      const githubLink = document.querySelector('a[href^="https://github.com"]');
      const linkedinLink = document.querySelector('a[href^="https://linkedin.com"]');
      
      if (emailLink && generalData.contact.email) {
        emailLink.href = `mailto:${generalData.contact.email}`;
        const span = emailLink.querySelector('span');
        if (span) span.textContent = generalData.contact.email;
      }
      
      if (githubLink && generalData.contact.github) {
        githubLink.href = generalData.contact.github.url;
        const span = githubLink.querySelector('span');
        if (span) span.textContent = generalData.contact.github.username;
      }
      
      if (linkedinLink && generalData.contact.linkedin) {
        linkedinLink.href = generalData.contact.linkedin.url;
        const span = linkedinLink.querySelector('span');
        if (span) span.textContent = generalData.contact.linkedin.username;
      }
    }
    
    // Set footer content
    if (generalData.footer) {
      const footerText = document.querySelector('.footer-text');
      if (footerText) footerText.innerHTML = generalData.footer.copyright || '';
    }
  } catch (error) {
    console.error('Error loading general data:', error);
  }
}

// Load projects with fixed bento box layout
async function loadProjects(limit = 6) {
  const projectsContainer = document.getElementById('projects-grid') || document.querySelector('.bento-grid');
  if (!projectsContainer) return;
  
  try {
    const projectsData = await fetchJsonData('data/projects.json');
    if (!projectsData || !Array.isArray(projectsData)) {
      projectsContainer.innerHTML = '<div class="error-message">Failed to load projects.</div>';
      return;
    }
    
    // Clear current projects
    projectsContainer.innerHTML = '';
    
    // Filter projects for display - prioritize featured projects first
    let featuredProjects = projectsData.filter(project => project.featured);
    let regularProjects = projectsData.filter(project => !project.featured);
    
    // Combine featured and regular projects, but make sure featured come first
    let displayProjects = [...featuredProjects, ...regularProjects].slice(0, limit || projectsData.length);
    
    // Create project cards - no need to assign size classes as they're positioned by nth-child
    displayProjects.forEach(project => {
      const projectCard = createProjectCard(project);
      projectsContainer.appendChild(projectCard);
    });
    
    // Set up project interactions
    setupProjectExpansion();
    
  } catch (error) {
    console.error('Error loading projects:', error);
    projectsContainer.innerHTML = '<div class="error-message">Failed to load projects.</div>';
  }
}

// Create project card
function createProjectCard(project) {
  // Create project card container
  const card = document.createElement('div');
  card.className = `project-card ${project.featured ? 'featured' : ''}`;
  
  // Use the category field from projects.json
  if (project.category) {
    card.setAttribute('data-categories', project.category.toLowerCase());
  } else if (project.categories) {
    card.setAttribute('data-categories', project.categories.join(',').toLowerCase());
  } else if (project.type) {
    card.setAttribute('data-categories', project.type.toLowerCase());
  } else if (project.skills) {
    // If no categories/type field, try to use skills as fallback
    card.setAttribute('data-categories', project.skills.join(',').toLowerCase());
  }
  
  // Create project image if available
  if (project.image) {
    const imgElement = document.createElement('img');
    
    // Direct path from projects.json
    imgElement.src = project.image;
    imgElement.alt = project.name || 'Project';
    imgElement.className = 'project-img';
    imgElement.loading = 'lazy';
    
    // Handle image loading errors with a simple color block fallback instead of using placeholder.com
    imgElement.onerror = function() {
      // Create a colored div element as fallback
      const fallbackElement = document.createElement('div');
      fallbackElement.className = 'project-img project-img-fallback';
      fallbackElement.style.background = 'linear-gradient(135deg, rgba(77, 127, 255, 0.1), rgba(157, 78, 221, 0.1))';
      fallbackElement.style.border = '1px solid rgba(77, 127, 255, 0.3)';
      fallbackElement.style.display = 'flex';
      fallbackElement.style.alignItems = 'center';
      fallbackElement.style.justifyContent = 'center';
      fallbackElement.style.color = 'var(--accent-primary)';
      fallbackElement.style.fontSize = 'var(--font-size-sm)';
      fallbackElement.style.fontFamily = 'var(--font-mono)';
      fallbackElement.style.fontWeight = '500';
      fallbackElement.innerHTML = 'Image not found';
      
      // Replace the img with the fallback div
      this.parentNode.replaceChild(fallbackElement, this);
    };
    
    card.appendChild(imgElement);
  } else {
    // If no image provided, create a default colored block
    const fallbackElement = document.createElement('div');
    fallbackElement.className = 'project-img project-img-fallback';
    fallbackElement.style.background = 'linear-gradient(135deg, rgba(77, 127, 255, 0.1), rgba(157, 78, 221, 0.1))';
    fallbackElement.style.border = '1px solid rgba(77, 127, 255, 0.3)';
    fallbackElement.style.display = 'flex';
    fallbackElement.style.alignItems = 'center';
    fallbackElement.style.justifyContent = 'center';
    fallbackElement.style.color = 'var(--accent-primary)';
    fallbackElement.style.fontSize = 'var(--font-size-sm)';
    fallbackElement.style.fontFamily = 'var(--font-mono)';
    fallbackElement.style.fontWeight = '500';
    fallbackElement.innerHTML = 'Image not found';
    card.appendChild(fallbackElement);
  }
  
  // Create content container
  const content = document.createElement('div');
  content.className = 'project-content';
  
  // Add title
  const title = document.createElement('h3');
  title.className = 'project-title';
  title.textContent = project.name || 'Project Name';
  content.appendChild(title);
  
  // Add description
  const description = document.createElement('p');
  description.className = 'project-description';
  description.textContent = project.description || 'No description available';
  content.appendChild(description);
  
  // Add tech stack tags
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
  
  // Add project links
  const linksContainer = document.createElement('div');
  linksContainer.className = 'project-links';
  
  // Add read more button to the left if description is long
  if (project.description && project.description.length > 120) {
    const readMoreBtn = document.createElement('button');
    readMoreBtn.className = 'read-more-btn';
    readMoreBtn.textContent = 'Read More →';
    readMoreBtn.addEventListener('click', function() {
      const descriptionEl = this.parentNode.parentNode.querySelector('.project-description');
      descriptionEl.classList.toggle('project-description-expanded');
      this.textContent = descriptionEl.classList.contains('project-description-expanded') ? 
        'Read Less ←' : 'Read More →';
    });
    linksContainer.appendChild(readMoreBtn);
  }
  
  // Add GitHub and live project links to the right
  const rightLinks = document.createElement('div');
  rightLinks.className = 'project-links-right';
  
  if (project.github) {
    const githubLink = document.createElement('a');
    githubLink.href = project.github;
    githubLink.className = 'project-link';
    githubLink.target = '_blank';
    githubLink.rel = 'noopener noreferrer';
    githubLink.innerHTML = '<i class="fab fa-github"></i>';
    githubLink.title = 'View Source Code';
    rightLinks.appendChild(githubLink);
  }
  
  if (project.link) {
    const demoLink = document.createElement('a');
    demoLink.href = project.link;
    demoLink.className = 'project-link';
    demoLink.target = '_blank';
    demoLink.rel = 'noopener noreferrer';
    demoLink.innerHTML = '<i class="fas fa-external-link-alt"></i>';
    demoLink.title = 'View Live Project';
    rightLinks.appendChild(demoLink);
  }
  
  linksContainer.appendChild(rightLinks);
  content.appendChild(linksContainer);
  
  card.appendChild(content);
  
  return card;
}

// Add this if it's not already in your code
function setupProjectExpansion() {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Don't expand if clicking on a link or button
      if (e.target.closest('a') || e.target.closest('button')) return;
      
      const description = this.querySelector('.project-description');
      if (!description) return;
      
      description.classList.toggle('project-description-expanded');
      
      // Find the read more button if it exists and update its text
      const readMoreBtn = this.querySelector('.read-more-btn');
      if (readMoreBtn) {
        readMoreBtn.textContent = description.classList.contains('project-description-expanded') ? 
          'Read Less ←' : 'Read More →';
      }
    });
  });
}

// Setup project filters
function setupProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  console.log('Found filter buttons:', filterButtons.length);
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Make this button active
      document.querySelector('.filter-btn.active')?.classList.remove('active');
      button.classList.add('active');
      
      // Get filter value
      const filterValue = button.getAttribute('data-filter');
      console.log('Filter clicked:', filterValue);
      
      // Filter projects
      filterProjects(filterValue);
    });
  });
}

// Filter projects function with improved category matching
function filterProjects(filterValue) {
  const projectsContainer = document.getElementById('projects-grid') || document.querySelector('.bento-grid');
  const projectCards = projectsContainer ? projectsContainer.querySelectorAll('.project-card') : document.querySelectorAll('.project-card');
  console.log('Found project cards:', projectCards.length);
  console.log('Filtering by:', filterValue);
  
  // Create mapping between filter values and category terms to match
  const filterMap = {
    'web development': ['web development', 'ui/ux', 'web game', 'web animation', 'web scraping'],
    'game development': ['game development'],
    'data science': ['data science']
  };
  
  projectCards.forEach((card, index) => {
    const categoriesAttribute = card.getAttribute('data-categories');
    console.log(`Card ${index} categories:`, categoriesAttribute);
    
    // Show all projects if "All" is selected
    if (filterValue === 'all') {
      card.classList.remove('filtered-out');
      return;
    }
    
    // Handle null/empty categories gracefully
    if (!categoriesAttribute) {
      card.classList.add('filtered-out');
      return;
    }
    
    // Check either for direct match or using the mapping
    const matchesFilter = filterMap[filterValue] ? 
      filterMap[filterValue].some(term => 
        categoriesAttribute.toLowerCase().includes(term.toLowerCase())
      ) : 
      categoriesAttribute.toLowerCase().includes(filterValue.toLowerCase());
    
    console.log(`Card ${index} matches ${filterValue}:`, matchesFilter);
    
    if (matchesFilter) {
      card.classList.remove('filtered-out');
    } else {
      card.classList.add('filtered-out');
    }
  });
}

// Load skills from JSON
async function loadSkills() {
  if (!skillsContainer) return;
  
  const skillsData = await fetchJsonData(DATA_PATHS.skills);
  if (!skillsData) return;
  
  // Clear current skills
  skillsContainer.innerHTML = '';
  
  // Add languages category
  if (skillsData.languages && skillsData.languages.length > 0) {
    const languageCategory = createSkillCategory('Languages', skillsData.languages);
    skillsContainer.appendChild(languageCategory);
  }
  
  // Add frameworks category
  if (skillsData.frameworks && skillsData.frameworks.length > 0) {
    const frameworkCategory = createSkillCategory('Frameworks & Libraries', skillsData.frameworks);
    skillsContainer.appendChild(frameworkCategory);
  }
  
  // Add tools category if it exists
  if (skillsData.tools && skillsData.tools.length > 0) {
    const toolsCategory = createSkillCategory('Tools & Platforms', skillsData.tools);
    skillsContainer.appendChild(toolsCategory);
  }
}

// Create a skill category element
function createSkillCategory(title, skills) {
  const skillItems = skills.map(skill => {
    let iconElement;
    if (skill.icon) {
      // Create an img element and handle error fallback
      const img = document.createElement('img');
      img.src = skill.icon;
      img.alt = skill.name;
      img.className = 'skill-icon';
      img.onerror = function() {
        this.replaceWith(createElement('i', { className: 'fas fa-code skill-icon' }));
      };
      iconElement = img;
    } else {
      iconElement = createElement('i', { className: 'fas fa-code skill-icon' });
    }

    const skillItem = createElement('div', { className: 'skill-item' }, [
      createElement('div', { className: 'skill-icon-container' }, iconElement),
      createElement('span', { className: 'skill-name' }, skill.name)
    ]);
    return skillItem;
  });

  const skillList = createElement('div', { className: 'skill-list' }, skillItems);

  return createElement('div', { className: 'skill-category' }, [
    createElement('h3', { className: 'skill-category-title' }, title),
    skillList
  ]);
}

// Check if blog section should be visible
async function checkBlogVisibility() {
  const blogSection = document.getElementById('blog');
  if (!blogSection) return;
  
  const blogConfig = await fetchJsonData(DATA_PATHS.blogConfig);
  if (!blogConfig) return;
  
  // Show or hide blog section based on config
  if (!blogConfig.enabled) {
    // Completely hide the section
    blogSection.style.display = 'none';
    
    // Also remove blog link from navigation
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      if (link.getAttribute('href') === '#blog') {
        const listItem = link.closest('li');
        if (listItem) {
          listItem.remove();
        }
      }
    });
    
    console.log('Blog section is disabled in configuration');
  }
}

// Typing Animation
function type() {
  const typedTextElement = document.querySelector('.typed-text');
  const cursorElement = document.querySelector('.cursor');
  
  if (!typedTextElement || !cursorElement) return;
  
  if (isTyping && charIndex < textArray[textArrayIndex].length) {
    typedTextElement.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  } else if (isTyping && charIndex === textArray[textArrayIndex].length) {
    isTyping = false;
    setTimeout(type, newTextDelay);
  } else if (!isTyping && charIndex > 0) {
    typedTextElement.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(type, erasingDelay);
  } else if (!isTyping && charIndex === 0) {
    isTyping = true;
    textArrayIndex = (textArrayIndex + 1) % textArray.length;
    setTimeout(type, typingDelay + 100);
  }
}

// Scroll Progress Bar
window.addEventListener('scroll', () => {
  // Update scroll progress indicator
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercentage = (scrollTop / scrollHeight) * 100;
  scrollProgress.style.width = scrollPercentage + '%';
  
  // Check if we should change header style
  checkScroll();
});

function checkScroll() {
  const scrollPosition = window.scrollY;
  if (scrollPosition > 100) {
    header.classList.add('header-scrolled');
  } else {
    header.classList.remove('header-scrolled');
  }
}

// Blog Toggle View
if (blogToggleBtn && blogGrid) {
  blogToggleBtn.addEventListener('click', () => {
    blogGrid.classList.toggle('blog-list-view');
    
    const icon = blogToggleBtn.querySelector('i');
    if (icon.classList.contains('fa-th-large')) {
      icon.classList.remove('fa-th-large');
      icon.classList.add('fa-list');
    } else {
      icon.classList.remove('fa-list');
      icon.classList.add('fa-th-large');
    }
  });
}

// Contact Form Submission
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Create mailto link with prefilled data
    const mailtoLink = `mailto:${encodeURIComponent(document.querySelector('a[href^="mailto:"]').href.replace('mailto:', ''))}?subject=${encodeURIComponent(`Contact from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    
    // Open the email client
    window.location.href = mailtoLink;
    
    // Show success feedback
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Message Sent!';
    submitBtn.disabled = true;
    
    // Reset form after successful submission
    setTimeout(() => {
      contactForm.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 3000);
  });
}

// Theme Toggle - REMOVED: Theme toggle has been removed from HTML, keeping only dark mode
// if (themeToggle) {
//   themeToggle.addEventListener('click', () => {
//     document.body.classList.toggle('light-theme');
//
//     if (document.body.classList.contains('light-theme')) {
//       themeToggleIcon.classList.remove('fa-moon');
//       themeToggleIcon.classList.add('fa-sun');
//       localStorage.setItem('theme', 'light');
//     } else {
//       themeToggleIcon.classList.remove('fa-sun');
//       themeToggleIcon.classList.add('fa-moon');
//       localStorage.setItem('theme', 'dark');
//     }
//   });
//
//   // Check for saved theme preference
//   const savedTheme = localStorage.getItem('theme');
//   if (savedTheme === 'light') {
//     document.body.classList.add('light-theme');
//     themeToggleIcon.classList.remove('fa-moon');
//     themeToggleIcon.classList.add('fa-sun');
//   }
// }

// Add smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Animation on scroll
const animateElements = () => {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (elementTop < windowHeight - 100) {
      element.classList.add('animated');
    }
  });
};

window.addEventListener('scroll', animateElements);
window.addEventListener('load', animateElements);

// Render the terminal from general.json
async function renderTerminalFromGeneralJson() {
  const terminalBody = document.querySelector('.terminal-body');
  const terminalBox = document.querySelector('.terminal-box');
  const terminalTitle = document.querySelector('.terminal-title');
  if (!terminalBody || !terminalBox) return;

  // Fetch general.json
  generalData = await fetchJsonData(DATA_PATHS.general);
  if (!generalData || !generalData.terminal || !Array.isArray(generalData.terminal.lines)) return;

  // Update terminal title if provided
  if (terminalTitle && generalData.terminal.title) {
    terminalTitle.textContent = generalData.terminal.title;
  }

  // Clear current terminal lines (but keep the input line outside)
  terminalBody.innerHTML = '';

  // Render each line from JSON
  generalData.terminal.lines.forEach(line => {
    // Command line
    if (line.command) {
      const commandLine = document.createElement('div');
      commandLine.className = 'terminal-line';
      commandLine.innerHTML = `
        <span class="terminal-prompt">$</span>
        <span class="terminal-command">${line.command}</span>
      `;
      terminalBody.appendChild(commandLine);
    }

    if (line.output) {
      const outputLine = document.createElement('div');
      outputLine.className = 'terminal-output';
      outputLine.innerHTML = line.output.replace(/\n/g, '<br>');
      terminalBody.appendChild(outputLine);
    }
  });

  // Setup input handling for the existing input (now outside terminal-body)
  const input = terminalBox.querySelector('.terminal-input');
  const inputLine = terminalBox.querySelector('.terminal-input-line');

  if (input && inputLine) {
    // Focus input when clicking anywhere in terminal
    terminalBox.addEventListener('click', () => {
      input.focus();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const command = input.value.trim().toLowerCase();
        input.value = '';

        // Add command to terminal body
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        commandLine.innerHTML = `
          <span class="terminal-prompt">$</span>
          <span class="terminal-command">${command}</span>
        `;
        terminalBody.appendChild(commandLine);

        processTerminalCommand(command, terminalBody, inputLine, generalData.terminal.extraCommands);
      }
    });
  }
}
function processTerminalCommand(command, terminalBody, inputLine, extraCommands = {}) {
  let output = '';

  // Parse command and arguments
  const parts = command.trim().split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  // Check if command exists in extraCommands
  if (extraCommands && extraCommands[cmd]) {
    output = extraCommands[cmd];
  } else {
    // Handle commands with arguments
    switch (cmd) {
      case 'whoami':
        output = 'saolghra';
        break;
      case 'cat':
        if (args.length === 0) {
          output = 'Usage: cat <filename>';
        } else {
          output = handleCatCommand(args[0]);
        }
        break;
      case 'ls':
        output = handleLsCommand();
        break;
      case 'cd':
        if (args.length === 0) {
          output = 'Usage: cd <directory>';
        } else {
          output = handleCdCommand(args[0]);
        }
        break;
      case 'sudo':
        if (args.length > 0 && args[0] === 'make-coffee') {
          output = 'Error: Coffee maker not found. Have you tried turning it off and on again? Remember: 418 I\'m a teapot.';
        } else {
          output = 'sudo: command not found';
        }
        break;
      case 'clear':
        // Clear all content in terminal body (input is now outside)
        terminalBody.innerHTML = '';
        // After clearing, automatically run neofetch
        setTimeout(() => {
          const inputLine = document.querySelector('.terminal-input-line');
          processTerminalCommand('neofetch', terminalBody, inputLine, extraCommands);
        }, 100);
        return; // Don't add output for clear
      case 'help':
        output = 'Available commands: whoami, cat, ls, cd, pwd, clear, help, neofetch, cmatrix, reboot';
        break;
      case 'neofetch':
        // Load ASCII logo from file and format like traditional neofetch
        fetch('assets/logo.txt')
          .then(response => response.text())
          .then(logoText => {
            const logoLines = logoText.split('\n');
            const systemInfo = [
              'OS: Portfolio v3.0',
              'Host: Spencer Bullock',
              'Kernel: JavaScript',
              'Shell: zsh',
              'Resolution: 1920x1080',
              'DE: VS Code',
              'Theme: Dark Professional',
              'Icons: Font Awesome',
              'Terminal: Custom Terminal'
            ];

            // Check if we're on mobile (screen width <= 768px)
            const isMobile = window.innerWidth <= 768;
            let formattedOutput = '';

            if (isMobile) {
              // Mobile: Stack ASCII art above system info
              formattedOutput = logoLines.join('\n') + '\n\n';
              formattedOutput += systemInfo.join('\n');
            } else {
              // Desktop: Side by side layout
              // Find the maximum length of ASCII lines to ensure consistent padding
              const maxAsciiLength = Math.max(...logoLines.map(line => line.length));
              const asciiWidth = maxAsciiLength + 2; // Add minimal padding

              // Find the first non-empty line to start system info alignment
              const firstContentIndex = logoLines.findIndex(line => line.trim().length > 0);

              for (let i = 0; i < logoLines.length; i++) {
                const logoLine = logoLines[i].padEnd(asciiWidth, ' ');

                // Only show system info starting from the first content line
                const systemInfoIndex = i - firstContentIndex;
                const infoLine = (systemInfoIndex >= 0 && systemInfoIndex < systemInfo.length)
                  ? systemInfo[systemInfoIndex]
                  : '';

                formattedOutput += logoLine + infoLine + '\n';
              }
            }

            const outputLine = document.createElement('div');
            outputLine.className = 'terminal-output';
            outputLine.style.fontFamily = "'JetBrains Mono', monospace";
            outputLine.style.fontSize = '11px';
            outputLine.style.lineHeight = '1.2';
            outputLine.style.whiteSpace = 'pre';
            outputLine.textContent = formattedOutput;
            terminalBody.appendChild(outputLine);
            terminalBody.scrollTop = terminalBody.scrollHeight;
          })
          .catch(error => {
            // Fallback if logo file can't be loaded
            const outputLine = document.createElement('div');
            outputLine.className = 'terminal-output';
            outputLine.innerHTML = 'Error loading logo file<br><br>OS: Portfolio v3.0<br>Host: Spencer Bullock<br>Kernel: JavaScript<br>Shell: zsh<br>Resolution: 1920x1080<br>DE: VS Code<br>WM: GitHub Copilot<br>Theme: Dark Professional<br>Icons: Font Awesome<br>Terminal: Custom Terminal';
            terminalBody.appendChild(outputLine);
            terminalBody.scrollTop = terminalBody.scrollHeight;
          });
        return; // Don't add regular output for neofetch
      case 'cmatrix':
        // Start matrix animation
        startMatrixAnimation(terminalBody, inputLine);
        return; // Don't add regular output for cmatrix
      case 'reboot':
        // Show reboot message and reload page
        output = 'System rebooting...';
        // Add output first, then reload after a short delay
        if (output) {
          const outputLine = document.createElement('div');
          outputLine.className = 'terminal-output';
          outputLine.innerHTML = output.replace(/\n/g, '<br>');
          terminalBody.appendChild(outputLine);
          terminalBody.scrollTop = terminalBody.scrollHeight;
        }
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        return; // Don't continue with normal output processing
      default:
        output = `Command not found: ${cmd}. Type 'help' for available commands.`;
    }
  }

  // Add output if there's any
  if (output) {
    const outputLine = document.createElement('div');
    outputLine.className = 'terminal-output';
    outputLine.innerHTML = output.replace(/\n/g, '<br>');
    terminalBody.appendChild(outputLine);
  }

  // Scroll to bottom
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Helper function to handle cat command
function handleCatCommand(filename) {
  if (!generalData || !generalData.files) {
    return `cat: ${filename}: No such file or directory`;
  }

  // Strip quotes from filename
  const cleanFilename = filename.replace(/^["']|["']$/g, '');

  // Handle files in root directory
  if (currentDirectory === '/' && generalData.files[cleanFilename]) {
    return generalData.files[cleanFilename];
  }

  // Handle files in projects directory
  if (currentDirectory === '/projects/') {
    if (generalData.projects) {
      // Find project by name (remove .txt extension if present)
      const projectName = cleanFilename.replace('.txt', '');
      const project = generalData.projects.find(p => p.name.toLowerCase().includes(projectName.toLowerCase()));
      if (project) {
        return `${project.name}\n\n${project.description}\n\nSkills: ${project.skills.join(', ')}\n\n${project.link ? `Link: ${project.link}` : ''}${project.github ? `\nGitHub: ${project.github}` : ''}`;
      }
    }
    return `cat: ${cleanFilename}: No such file or directory`;
  }

  return `cat: ${cleanFilename}: No such file or directory`;
}

// Helper function to handle ls command
function handleLsCommand() {
  if (currentDirectory === '/') {
    // Root directory contents
    return 'about.txt    projects/    skills.txt    contact.txt';
  } else if (currentDirectory === '/projects/') {
    // Projects directory - show project names as .txt files
    if (generalData && generalData.projects) {
      return generalData.projects.map(project => `"${project.name}.txt"`).join('    ');
    }
    return 'No projects found';
  } else {
    return `ls: cannot access '${currentDirectory}': No such file or directory`;
  }
}

// Helper function to handle cd command
function handleCdCommand(directory) {
  if (directory === '..') {
    // Go up one directory
    if (currentDirectory === '/projects/') {
      currentDirectory = '/';
      return ''; // No output for successful cd
    } else {
      return `cd: cannot go up from ${currentDirectory}`;
    }
  } else if (directory === '/' || directory === '~') {
    // Go to root
    currentDirectory = '/';
    return ''; // No output for successful cd
  } else if (directory === 'projects/' || directory === 'projects') {
    // Go to projects directory
    if (currentDirectory === '/') {
      currentDirectory = '/projects/';
      return ''; // No output for successful cd
    } else {
      return `cd: ${directory}: No such file or directory`;
    }
  } else {
    return `cd: ${directory}: No such file or directory`;
  }
}

// Matrix animation function
function startMatrixAnimation(terminalBody, inputLine) {
  // Create background matrix overlay (behind everything)
  const matrixOverlay = document.createElement('div');
  matrixOverlay.id = 'matrix-background';
  matrixOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: transparent;
    z-index: -1;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    line-height: 12px;
    color: #00ff00;
    pointer-events: none;
    overflow: hidden;
    opacity: 0.7;
  `;

  document.body.appendChild(matrixOverlay);

  // Matrix characters (more authentic mix)
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
  const columns = Math.floor(window.innerWidth / 12);
  const drops = [];
  const speeds = [];

  // Initialize drops and speeds
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.floor(Math.random() * -50);
    speeds[i] = Math.random() * 2 + 0.5; // Slower, more subtle speeds
  }

  let animationFrame;
  let lastTime = 0;

    // Animation function with smooth, calm performance
  function draw(currentTime) {
    if (currentTime - lastTime < 120) { // Slower, more relaxed frame rate
      animationFrame = requestAnimationFrame(draw);
      return;
    }
    lastTime = currentTime;

    // Gentle trail effect
    const trail = document.createElement('div');
    trail.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.025);
      pointer-events: none;
    `;
    matrixOverlay.appendChild(trail);

    // Draw characters more frequently for denser rain
    for (let i = 0; i < drops.length; i++) {
      if (Math.random() > 0.75) { // Increased from 12% to 25% for more rain
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 12;
        const y = drops[i] * 12;

        if (y > -12 && y < window.innerHeight + 12) {
          const charElement = document.createElement('div');
          charElement.textContent = char;
          charElement.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            color: #00ff00;
            text-shadow: 0 0 6px #00ff00, 0 0 10px #00ff00;
            opacity: ${Math.random() * 0.5 + 0.3};
            font-size: 12px;
            font-weight: bold;
            transition: opacity 0.5s ease-out;
          `;
          matrixOverlay.appendChild(charElement);

          // Slower fade out for calmer effect
          setTimeout(() => {
            if (charElement.parentNode) {
              charElement.style.opacity = '0';
              setTimeout(() => {
                if (charElement.parentNode) {
                  charElement.parentNode.removeChild(charElement);
                }
              }, 500);
            }
          }, 200 + Math.random() * 300);
        }
      }

      // Reset drops more calmly
      if (drops[i] * 12 > window.innerHeight + 30) {
        drops[i] = Math.floor(Math.random() * -15);
      }

      // Slower, more deliberate falling
      drops[i] += speeds[i] * 0.7; // Reduce speed by 30%
    }

    // Relaxed cleanup
    while (matrixOverlay.children.length > 120) {
      matrixOverlay.removeChild(matrixOverlay.firstChild);
    }

    animationFrame = requestAnimationFrame(draw);
  }

  // Start animation
  animationFrame = requestAnimationFrame(draw);

  // Handle window resize
  const resizeHandler = () => {
    const newColumns = Math.floor(window.innerWidth / 12);
    if (newColumns !== columns) {
      // Restart animation with new dimensions
      stopMatrixAnimation();
      startMatrixAnimation(terminalBody, inputLine);
    }
  };

  window.addEventListener('resize', resizeHandler);

  // Stop animation function
  const stopMatrixAnimation = () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    if (matrixOverlay && matrixOverlay.parentNode) {
      matrixOverlay.parentNode.removeChild(matrixOverlay);
    }
    window.removeEventListener('resize', resizeHandler);
    document.removeEventListener('keydown', stopHandler);
  };

  // Stop animation on Escape key only (so other keys work for navigation)
  const stopHandler = (e) => {
    if (e.key === 'Escape') {
      stopMatrixAnimation();

      // Show exit message in terminal
      const exitMessage = document.createElement('div');
      exitMessage.className = 'terminal-output';
      exitMessage.innerHTML = 'Matrix background deactivated.';
      terminalBody.appendChild(exitMessage);
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  };

  document.addEventListener('keydown', stopHandler);

  // Auto-stop after 60 seconds
  setTimeout(() => {
    stopMatrixAnimation();

    // Show exit message
    const exitMessage = document.createElement('div');
    exitMessage.className = 'terminal-output';
    exitMessage.innerHTML = 'Matrix background faded away...';
    terminalBody.appendChild(exitMessage);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }, 60000);
}

// Modal functionality for projects
function setupProjectsModal() {
  const viewMoreBtn = document.querySelector('.view-more-btn');
  const modal = document.getElementById('projects-modal');
  const modalClose = document.getElementById('modal-close');
  const modalContent = document.querySelector('.modal-content');
  
  if (!viewMoreBtn || !modal) return;
  
  // Open modal
  viewMoreBtn.addEventListener('click', async () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Load all projects into modal
    await loadAllProjectsIntoModal();
    
    // Setup modal filters
    setupModalFilters();
  });
  
  // Close modal functions
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  };
  
  // Close on close button click
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Load all projects into modal
async function loadAllProjectsIntoModal() {
  const modalGrid = document.getElementById('modal-projects-grid');
  if (!modalGrid) return;
  
  try {
    const projectsData = await fetchJsonData('data/projects.json');
    if (!projectsData || !Array.isArray(projectsData)) {
      modalGrid.innerHTML = '<div class="error-message">Failed to load projects.</div>';
      return;
    }
    
    // Clear current projects
    modalGrid.innerHTML = '';
    
    // Create project cards for all projects
    projectsData.forEach(project => {
      const projectCard = createProjectCard(project);
      modalGrid.appendChild(projectCard);
    });
    
    // Setup project interactions for modal
    setupModalProjectExpansion();
    
  } catch (error) {
    console.error('Error loading projects into modal:', error);
    modalGrid.innerHTML = '<div class="error-message">Failed to load projects.</div>';
  }
}

// Setup modal filters
function setupModalFilters() {
  const modalFilterButtons = document.querySelectorAll('.modal-filters .filter-btn');
  
  modalFilterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Make this button active
      document.querySelector('.modal-filters .filter-btn.active')?.classList.remove('active');
      button.classList.add('active');
      
      // Get filter value
      const filterValue = button.getAttribute('data-filter');
      
      // Filter modal projects
      filterModalProjects(filterValue);
    });
  });
}

// Filter modal projects
function filterModalProjects(filterValue) {
  const modalProjectCards = document.querySelectorAll('#modal-projects-grid .project-card');
  
  // Create mapping between filter values and category terms to match
  const filterMap = {
    'web development': ['web development', 'ui/ux', 'web game', 'web animation', 'web scraping'],
    'game development': ['game development'],
    'data science': ['data science']
  };
  
  modalProjectCards.forEach(card => {
    // Show all projects if "All" is selected
    if (filterValue === 'all') {
      card.classList.remove('filtered-out');
      return;
    }
    
    // Get the categories from the data-categories attribute
    const categoriesAttribute = card.getAttribute('data-categories');
    
    // Handle null/empty categories gracefully
    if (!categoriesAttribute) {
      card.classList.add('filtered-out');
      return;
    }
    
    // Check either for direct match or using the mapping
    const matchesFilter = filterMap[filterValue] ? 
      filterMap[filterValue].some(term => 
        categoriesAttribute.toLowerCase().includes(term.toLowerCase())
      ) : 
      categoriesAttribute.toLowerCase().includes(filterValue.toLowerCase());
    
    if (matchesFilter) {
      card.classList.remove('filtered-out');
    } else {
      card.classList.add('filtered-out');
    }
  });
}

// Setup project expansion for modal
function setupModalProjectExpansion() {
  const modalProjectCards = document.querySelectorAll('#modal-projects-grid .project-card');
  
  modalProjectCards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Don't expand if clicking on a link or button
      if (e.target.closest('a') || e.target.closest('button')) return;
      
      const description = this.querySelector('.project-description');
      if (!description) return;
      
      description.classList.toggle('project-description-expanded');
      
      // Find the read more button if it exists and update its text
      const readMoreBtn = this.querySelector('.read-more-btn');
      if (readMoreBtn) {
        readMoreBtn.textContent = description.classList.contains('project-description-expanded') ? 
          'Read Less ←' : 'Read More →';
      }
    });
  });
}