document.addEventListener("DOMContentLoaded", () => {
  const typedName = document.getElementById('typed-name');
  const landing = document.getElementById('landing');

  const navLinks = Array.from(document.querySelectorAll('.topnav .nav-link[data-page]'));

  const nameText = "Pravan Omprakash";
  let i = 0;

  function finishLanding() {
    if (!landing) return;
    if (document.body.classList.contains('landing-done')) return;
    document.body.classList.add('landing-done');
    landing.setAttribute('aria-hidden', 'true');
    setTimeout(() => document.body.classList.add('landing-removed'), 520);
  }

  // Typing animation (then landing disappears)
  function type() {
    if (!typedName) {
      finishLanding();
      return;
    }

    if (i < nameText.length) {
      typedName.textContent += nameText.charAt(i);
      i++;
      setTimeout(type, 120);
    } else {
      typedName.style.border = 'none';
      setTimeout(finishLanding, 650);
    }
  }

  // Ensure we start clean if user refreshes
  if (typedName) typedName.textContent = "";
  type();

  // Top nav: smooth scroll + active state
  function setActive(id) {
    navLinks.forEach(a => a.classList.toggle('active', a.dataset.page === id));
  }

  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.dataset.page;
      const section = document.getElementById(id);
      if (!section) return; // let default happen if href exists
      e.preventDefault();
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActive(id);
      history.replaceState(null, '', '#' + id);
    });
  });

  const sections = navLinks
    .map(a => document.getElementById(a.dataset.page))
    .filter(Boolean);

  function updateActiveOnScroll() {
    const y = window.scrollY + 120; // offset for fixed topbar
    let current = sections.length ? sections[0].id : 'about';
    for (const s of sections) {
      if (s.offsetTop <= y) current = s.id;
    }
    setActive(current);
  }

  window.addEventListener('scroll', updateActiveOnScroll, { passive: true });
  window.addEventListener('load', updateActiveOnScroll);

  // If page loads with a hash, scroll to it (after landing finishes)
  if (window.location.hash) {
    const id = window.location.hash.replace('#', '');
    const section = document.getElementById(id);
    if (section) {
      setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'start' }), 800);
    }
  }
});

// --- Expand/collapse research cards ---
document.addEventListener("click", (e) => {
  const card = e.target.closest(".expandable");
  if (!card) return;

  // Toggle only this card
  card.classList.toggle("active");

  // Optionally collapse others at the same time:
  // document.querySelectorAll(".expandable").forEach(c => {
  //   if (c !== card) c.classList.remove("active");
  // });
});
document.addEventListener("DOMContentLoaded", async () => {
  // === PUBLICATIONS MODAL ===

  const modal = document.getElementById("pubModal");
  const modalTitle = document.getElementById("modal-title");
  const modalAuthors = document.getElementById("modal-authors");
  const modalAbstract = document.getElementById("modal-abstract");
  const closeBtn = document.querySelector(".close-btn");
  const scholarLink = document.getElementById("modal-scholar");
  const doiLink = document.getElementById("modal-doi");

  // ---- Load publication data dynamically ----
  let pubData = {};
  try {
    const response = await fetch("assets/data/publications.json");
    if (!response.ok) throw new Error("Failed to load JSON file");
    pubData = await response.json();
    console.log(`Loaded ${Object.keys(pubData).length} publications`);
  } catch (err) {
    console.error("Error loading publication data:", err);
  }

  // ---- Bind event listeners to each card ----
  document.querySelectorAll(".pub-card").forEach(card => {
    card.addEventListener("click", () => {
      const pub = pubData[card.dataset.pub];
      if (!pub) {
        console.warn(`No data found for ${card.dataset.pub}`);
        return;
      }

      // Populate modal with publication info
      modalTitle.textContent = pub.title || "Untitled";
      modalAuthors.textContent = pub.authors || "";
      // Limit abstract length
	  const maxLen = 800;
	  const abstract = pub.abstract || "No abstract available.";
	  const truncated = abstract.slice(0, maxLen).trim() + "...";

// add inline scholar link with graduation-cap icon
	  modalAbstract.innerHTML = `
  	${truncated}
  	<a href="${pub.scholar}" target="_blank" class="inline-link">
    <i class="fa-solid fa-graduation-cap"></i>
  	</a>
`;
//       scholarLink.href = pub.scholar || "#";
      doiLink.href = pub.doi || "#";
	  scholarLink.style.display = "none";
      doiLink.style.display = "inline";
      modal.style.display = "flex";
      document.body.style.overflow = "visible"; // lock scroll
    });
  });

  // ---- Close modal behavior ----
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  });

  modal.addEventListener("click", e => {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

});


document.addEventListener("DOMContentLoaded", () => {
  const projData = {
    proj1: {
      title: "SymPlex Visualization Framework",
      desc: "A Python visualization suite for visualizing N-component spaces in 2D using polar projections...",
      code: "https://github.com/Materials-Modelling-Microscopy/SymPlex",
      poster: "assets/posters/symplex_poster.png",
      presentations: [
        { title: "High-Entropy Materials (SF03), MRS Fall '25", link: "https://drive.google.com/.../symplex_APS.pdf" }
      ],
      publications: [
        { title: "SymPlex plots for visualizing properties in high-dimensional alloy spaces", link: "https://doi.org/10.1016/j.scriptamat.2025.116840" },
      ]
    },
    proj2: {
      title: "Fast and Robust High Entropy Alloy Analysis",
      desc: "An open-source Python based modular library for analyzing stability of solid solutions and precipitates in alloys. A workflow for high-throughput analyse to accelerate alloy design.",
      code: "https://github.com/yourrepo/far_heaa",
      poster: "assets/posters/farheaa_poster.png",
      presentations: [
        { title: "Materials at High Temperatures—Fabrication, Characterization and Performance (SF09), MRS Fall '25", link: "https://drive.google.com/.../farheaa_TMS.pdf" },
        { title: "Computational Thermodynamics and Kinetics, TMS Fall '26", link: "https://drive.google.com/.../farheaa_TMS.pdf" }
      ],
      publications: [
        { title: "TBD", link: "https://doi.org/10.1016/j.commatsci.2025.XXXX" },
        { title: "TBD", link: "https://doi.org/10.1016/j.commatsci.2025.XXXX" },
        { title: "TBD", link: "https://doi.org/10.1016/j.commatsci.2025.XXXX" },
      ]
    },
    proj3: {
      title: "Phase Field simulations and Spinodal Decomposition in multinary alloys",
      desc: "An open-source Python based modular library for analyzing spiondal decomposition of solid solutions in HEAs, supplemented with phase field simulations.[Update coming soon].",
      code: "https://github.com/yourrepo/far_heaa",
      poster: "assets/posters/farheaa_poster.png",
      presentations: [
        { title: "Materials at High Temperatures—Fabrication, Characterization and Performance (SF09), MRS Fall '25", link: "https://drive.google.com/.../farheaa_TMS.pdf" },
        { title: "Computational Thermodynamics and Kinetics, TMS Fall '26", link: "https://drive.google.com/.../farheaa_TMS.pdf" }
      ],
      publications: [
        { title: "TBD", link: "https://doi.org/10.1016/j.commatsci.2025.XXXX" }
      ]
    },
    proj4: {
      title: "Monte Carlo Lattice Model",
      desc: "Python based custom simulation framework to study segregation and order–disorder transitions in high entropy alloys",
      code: "https://github.com/yourrepo/montecarlo",
      poster: "assets/posters/montecarlo_poster.png",
      presentations: [

      ],
      publications: [

      ]
    }
  };

  // Cache all elements used below
  const projModal    = document.getElementById("projModal");
  const presList     = document.getElementById("presentation-list");
  const pubList      = document.getElementById("publication-list");
  const lightbox     = document.getElementById("poster-lightbox");
  const lightboxImg  = document.getElementById("poster-image");
  const btnCode      = document.getElementById("proj-code");
  const btnPoster    = document.getElementById("proj-poster");
  const btnPres      = document.getElementById("proj-presentation");
  const btnPubs      = document.getElementById("proj-publication");
  const titleEl      = document.getElementById("proj-title");
  const descEl       = document.getElementById("proj-desc");

  // Basic sanity checks to avoid silent failures
  if (!projModal || !presList || !pubList || !lightbox || !lightboxImg || !btnCode || !btnPoster || !btnPres || !btnPubs || !titleEl || !descEl) {
    console.error("Projects modal: one or more required elements are missing. Check IDs in your HTML.");
    return;
  }

  document.querySelectorAll(".proj-card").forEach(card => {
    card.addEventListener("click", () => {
      const key = card.dataset.proj;
      const proj = projData[key];
      if (!proj) {
        console.warn("No project data for:", key);
        return;
      }

      // Fill static fields
      titleEl.textContent = proj.title;
      descEl.textContent  = proj.desc;
      btnCode.href        = proj.code || "#";

      // Reset lists and lightbox each open
      presList.style.display = "none";
      presList.innerHTML = "";
      pubList.style.display  = "none";
      pubList.innerHTML = "";
      lightbox.style.display = "none";
      lightboxImg.src = "";

      // Rebind actions (onclick replaces any previous)
      btnPoster.onclick = e => {
        e.preventDefault();
        if (!proj.poster) return;
        lightboxImg.src = proj.poster;
        lightbox.style.display = "flex";
      };

      btnPres.onclick = e => {
        e.preventDefault();
        const items = Array.isArray(proj.presentations) ? proj.presentations : [];
        presList.innerHTML = items.length
          ? items.map(p => `<li><a href="${p.link}" target="_blank" rel="noopener">${p.title}</a></li>`).join("")
          : `<li><em>No talks listed yet.</em></li>`;
        presList.style.display = (presList.style.display === "none") ? "block" : "none";
      };

      btnPubs.onclick = e => {
        e.preventDefault();
        const items = Array.isArray(proj.publications) ? proj.publications : [];
        pubList.innerHTML = items.length
          ? items.map(p => `<li><a href="${p.link}" target="_blank" rel="noopener"><i class="fa-solid fa-graduation-cap"></i> ${p.title}</a></li>`).join("")
          : `<li><em>No publications linked yet.</em></li>`;
        pubList.style.display = (pubList.style.display === "none") ? "block" : "none";
      };

      // Show modal
      projModal.style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  });

  // Close the lightbox on click (if you haven't already elsewhere)
  lightbox.addEventListener("click", () => {
    lightbox.style.display = "none";
    lightboxImg.src = "";
  });
  // === Close project modal ===
const closeProjBtn = document.querySelector(".proj-close");
if (closeProjBtn) {
  closeProjBtn.addEventListener("click", () => {
    projModal.style.display = "none";
    document.body.style.overflow = "auto";
  });
}

// Optional: close when clicking outside the modal content
projModal.addEventListener("click", e => {
  if (e.target === projModal) {
    projModal.style.display = "none";
    document.body.style.overflow = "auto";
  }
});
});
// --- Contact form handler ---
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const subject = encodeURIComponent(`Message from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
    window.location.href = `mailto:youremail@domain.com?subject=${subject}&body=${body}`;
  });
});



