/**************************************
 COMMON UTILITIES (GLOBAL)
**************************************/

/**
 * Highlight active navbar link
 */
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll("nav a");

  links.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
});

/**
 * Safe query selector
 * Usage: qs("#id")
 */
function qs(selector) {
  return document.querySelector(selector);
}

/**
 * Format currency (INR)
 */
function formatINR(value) {
  return "₹ " + Number(value).toLocaleString("en-IN");
}

/**
 * Save to localStorage safely
 */
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Load from localStorage safely
 */
function load(key, fallback = null) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
}

/**
 * Simple toast (non-blocking message)
 */
function toast(message, type = "info") {
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = message;

  document.body.appendChild(el);

  setTimeout(() => el.classList.add("show"), 50);
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 300);
  }, 2500);
}
document.addEventListener("keydown", (e) => {
  // Alt + D → Dashboard
  if (e.altKey && e.key.toLowerCase() === "d") {
    window.location.href = "dashboard.html";
  }

  // Alt + I → Interview
  if (e.altKey && e.key.toLowerCase() === "i") {
    window.location.href = "interview.html";
  }
});
