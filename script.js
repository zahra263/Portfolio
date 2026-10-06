const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const links = document.querySelectorAll(".nav-link");
const themeToggle = document.getElementById("themeToggle");
const backToTop = document.getElementById("backToTop");
const sections = document.querySelectorAll("main section");
const contactForm = document.getElementById("contactForm");

// ===== 1. Mobile hamburger menu =====
hamburger.addEventListener("click", function () {
  const isOpen = navLinks.classList.toggle("open");
  hamburger.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", isOpen);
});

// ===== 2. Smooth scrolling (and close mobile menu on click) =====
links.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      window.scrollTo({ top: target.offsetTop - 70, behavior: "smooth" });
    }
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
  });
});

// ===== 3. Dark / Light mode toggle (saved in localStorage) =====
function setTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("theme", theme);
}

setTheme(localStorage.getItem("theme") || "light");

themeToggle.addEventListener("click", function () {
  const isDark = document.body.classList.contains("dark");
  setTheme(isDark ? "light" : "dark");
});

// ===== 4. Active nav link + navbar shadow + back-to-top on scroll =====
function onScroll() {
  const scrollY = window.scrollY;

  navbar.classList.toggle("scrolled", scrollY > 20);
  backToTop.classList.toggle("show", scrollY > 400);

  sections.forEach(function (section) {
    const top = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      links.forEach(function (link) {
        link.classList.toggle("active", link.getAttribute("href") === "#" + section.id);
      });
    }
  });
}

window.addEventListener("scroll", onScroll);
onScroll();

// ===== 5. Back-to-top button =====
backToTop.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== 6. Scroll reveal animations =====
const revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach(function (el) {
  revealObserver.observe(el);
});

// ===== 7. Contact form validation =====
function showError(input, message) {
  const group = input.parentElement;
  group.classList.add("error");
  group.querySelector(".error-msg").textContent = message;
}

function clearError(input) {
  const group = input.parentElement;
  group.classList.remove("error");
  group.querySelector(".error-msg").textContent = "";
}

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");
  const success = document.getElementById("formSuccess");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let isValid = true;

  success.textContent = "";
  [name, email, message].forEach(clearError);

  if (name.value.trim() === "") {
    showError(name, "Please enter your name.");
    isValid = false;
  }
  if (!emailPattern.test(email.value.trim())) {
    showError(email, "Please enter a valid email address.");
    isValid = false;
  }
  if (message.value.trim().length < 10) {
    showError(message, "Message should be at least 10 characters.");
    isValid = false;
  }

  if (isValid) {
    success.textContent = "Thank you! Your message has been sent.";
    contactForm.reset();
  }
});
