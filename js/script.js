document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const menuButton = document.getElementById("menu-toggle");
  const primaryNav = document.getElementById("primary-nav");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.getElementById("year").textContent = new Date().getFullYear();

  const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    primaryNav.classList.toggle("open", !isOpen);
  });

  navLinks.forEach(link => link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("open");
  }));

  const observedSections = ["about", "research", "projects", "publications", "conferences", "contact"]
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach(link => link.classList.toggle("active", link.hash === `#${visible.target.id}`));
  }, { rootMargin: "-25% 0px -60%", threshold: [0, .2, .5] });
  observedSections.forEach(section => sectionObserver.observe(section));

  if (reduceMotion) {
    document.querySelectorAll(".reveal").forEach(element => element.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: "0px 0px -35px" });
    document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));
  }

  const modals = [...document.querySelectorAll(".modal")];
  let returnFocus = null;

  function openModal(modal, trigger) {
    returnFocus = trigger;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    requestAnimationFrame(() => modal.querySelector(".modal-close")?.focus());
  }

  function closeModal(modal) {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    returnFocus?.focus();
    returnFocus = null;
  }

  modals.forEach(modal => {
    modal.querySelectorAll("[data-close-modal]").forEach(control => control.addEventListener("click", () => closeModal(modal)));
  });

  document.addEventListener("keydown", event => {
    const open = modals.find(modal => !modal.hidden);
    if (!open) return;
    if (event.key === "Escape") closeModal(open);
    if (event.key === "Tab") {
      const focusable = [...open.querySelectorAll("a[href], button:not([disabled])")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  const projectData = {
    proj1: {
      title: "SymPlex Visualization Framework",
      description: "A Python visualization framework for projecting N-component composition spaces into intuitive two-dimensional polar maps. SymPlex concentrates information around equimolar compositions while preserving meaningful pathways to lower-order alloys.",
      links: [
        { label: "View code", url: "https://github.com/Materials-Modelling-Microscopy/Symplex", primary: true },
        { label: "Read paper", url: "https://doi.org/10.1016/j.scriptamat.2025.116840" },
        { label: "View poster", url: "assets/posters/TMS26.pdf" }
      ],
      related: ["Scripta Materialia, 2025", "Presented at MRS Fall 2025"]
    },
    proj2: {
      title: "Alloy Thermodynamics Toolkit",
      description: "A modular computational workflow for rapidly evaluating solid-solution and precipitate stability in high-entropy alloys. It combines first-principles inputs, classical thermodynamic models, and interpretable visual outputs.",
      links: [
        { label: "View poster", url: "assets/posters/farheaa_poster.png", primary: true }
      ],
      related: ["Active research project", "Open-source release in preparation"]
    },
    proj3: {
      title: "Spinodal Decomposition in Complex Materials",
      description: "A phase-field simulation framework for exploring how free-energy landscapes, elastic effects, and composition influence phase-segregated microstructures in multicomponent materials.",
      links: [],
      related: ["Active research project", "Code and results in preparation"]
    }
  };

  const projectModal = document.getElementById("projModal");
  const projectTitle = document.getElementById("proj-title");
  const projectDescription = document.getElementById("proj-desc");
  const projectLinks = document.getElementById("proj-links");
  const projectRelated = document.getElementById("proj-related");

  document.querySelectorAll(".project-card").forEach(card => {
    const trigger = card.querySelector(".card-hit");
    trigger.addEventListener("click", () => {
      const project = projectData[card.dataset.proj];
      if (!project) return;
      projectTitle.textContent = project.title;
      projectDescription.textContent = project.description;
      projectLinks.replaceChildren();
      project.related = project.related || [];

      project.links.forEach(link => {
        const anchor = document.createElement("a");
        anchor.className = `button ${link.primary ? "button-primary" : "button-secondary"}`;
        anchor.href = link.url;
        anchor.target = "_blank";
        anchor.rel = "noopener";
        anchor.innerHTML = `${link.label} <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>`;
        projectLinks.append(anchor);
      });

      projectRelated.replaceChildren();
      if (project.related.length) {
        const label = document.createElement("p");
        label.textContent = "Project status";
        projectRelated.append(label);
        project.related.forEach(item => {
          const line = document.createElement("span");
          line.textContent = item;
          line.style.display = "block";
          line.style.color = "var(--muted)";
          line.style.marginTop = "8px";
          projectRelated.append(line);
        });
      }
      openModal(projectModal, trigger);
    });
  });

  const publicationModal = document.getElementById("pubModal");
  const modalTitle = document.getElementById("modal-title");
  const modalAuthors = document.getElementById("modal-authors");
  const modalAbstract = document.getElementById("modal-abstract");
  const modalScholar = document.getElementById("modal-scholar");
  let publicationData = {};

  fetch("assets/data/publications.json")
    .then(response => {
      if (!response.ok) throw new Error("Publication data could not be loaded.");
      return response.json();
    })
    .then(data => { publicationData = data; })
    .catch(error => console.error(error));

  document.querySelectorAll("[data-pub]").forEach(card => {
    const trigger = card.matches("button") ? card : card.querySelector(".card-hit");
    trigger.addEventListener("click", () => {
      const publication = publicationData[card.dataset.pub];
      if (!publication) return;
      modalTitle.textContent = publication.title || "Selected publication";
      modalAuthors.textContent = [publication.authors, publication.venue, publication.year].filter(Boolean).join(" · ");
      const abstract = publication.abstract || "Abstract not available here. Follow the publication link for the complete paper.";
      modalAbstract.textContent = abstract.length > 950 ? `${abstract.slice(0, 947).trim()}…` : abstract;
      const destination = publication.scholar || publication.doi;
      modalScholar.hidden = !destination;
      if (destination) modalScholar.href = destination;
      openModal(publicationModal, trigger);
    });
  });

  const contactForm = document.getElementById("contact-form");
  contactForm.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const subject = encodeURIComponent(`Website inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
    window.location.href = `mailto:o.pravan@wustl.edu?subject=${subject}&body=${body}`;
  });
});
