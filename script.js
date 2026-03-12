const body = document.body;
const yearNode = document.getElementById("year");
const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("main-nav");
const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll(".reveal");
const heroVisual = document.querySelector(".hero-visual img");

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

function closeMenu() {
  if (!menuToggle) return;
  body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function openMenu() {
  if (!menuToggle) return;
  body.classList.add("menu-open");
  menuToggle.setAttribute("aria-expanded", "true");
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = body.classList.contains("menu-open");
    if (isOpen) closeMenu();
    else openMenu();
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!body.classList.contains("menu-open")) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!nav.contains(target) && !menuToggle.contains(target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

function syncHeaderState() {
  if (!header) return;
  if (window.scrollY > 14) header.classList.add("scrolled");
  else header.classList.remove("scrolled");
}

window.addEventListener("scroll", syncHeaderState, { passive: true });
syncHeaderState();

if (heroVisual && window.matchMedia("(min-width: 921px)").matches) {
  const maxTilt = 7;
  const parent = heroVisual.parentElement;

  if (parent) {
    parent.addEventListener("mousemove", (event) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rx = (0.5 - y) * maxTilt;
      const ry = (x - 0.5) * maxTilt;
      heroVisual.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });

    parent.addEventListener("mouseleave", () => {
      heroVisual.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    });
  }
}
