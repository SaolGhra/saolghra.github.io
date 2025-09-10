/**
 * Utility functions for the portfolio website
 */

/**
 * Fetch JSON data from a file
 * @param {string} url - Path to the JSON file
 * @returns {Promise<Object>} - The parsed JSON data
 */
async function fetchJsonData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return null;
  }
}

/**
 * Create an HTML element with given attributes and content
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - HTML attributes
 * @param {string|HTMLElement|Array} content - HTML content
 * @returns {HTMLElement} - The created element
 */
function createElement(tag, attributes = {}, content = '') {
  const element = document.createElement(tag);
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else {
      element.setAttribute(key, value);
    }
  });
  
  // Set content
  if (typeof content === 'string') {
    element.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    element.appendChild(content);
  } else if (Array.isArray(content)) {
    content.forEach(item => {
      if (item instanceof HTMLElement) {
        element.appendChild(item);
      } else if (typeof item === 'string') {
        element.innerHTML += item;
      }
    });
  }
  
  return element;
}