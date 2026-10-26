const STORAGE_KEY = "archPortalProjects";

let projects = loadProjects();
let selectedProjectId = null;

function loadProjects() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const data = saved ? JSON.parse(saved) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveProjects() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function makeId() {
  return Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8);
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function safeImageURL(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol)
      ? url.href : "";
  } catch {
    return "";
  }
}

function getSelectedProject() {
  return projects.find(p => p.id === selectedProjectId);
}

function getAllProposals() {
  return projects.flatMap(project => project.proposals || []);
}

function renderDashboard() {
  document.getElementById("projectCount").textContent =
    projects.length;

  const proposals = getAllProposals();

  document.getElementById("proposalCount").textContent =
    proposals.length;

  document.getElementById("approvedCount").textContent =
    proposals.filter(p => p.status === "Approved").length;

  const list = document.getElementById("projectList");

  if (!projects.length) {
    list.innerHTML = `
      <div class="empty">
        No projects yet. Click "+ New Project" to create your first one.
      </div>`;
    return;
  }

  list.innerHTML = projects.map(project => `
    <article class="project-card">
      <p class="eyebrow">ARCHITECTURE PROJECT</p>
      <h4>${escapeHTML(project.name)}</h4>
      <p>${escapeHTML(project.description)}</p>
      <p>Owner: ${escapeHTML(project.owner || "Not specified")}</p>
      <p>${(project.proposals || []).length} design proposal(s)</p>
      <button data-open-project="${escapeHTML(project.id)}">
        Open Project
      </button>
    </article>
  `).join("");
}

function renderProposals() {
  const project = getSelectedProject();
  const section = document.getElementById("detailSection");

  if (!project) {
    section.hidden = true;
    return;
  }

  section.hidden = false;

  document.getElementById("detailName").textContent = project.name;
  document.getElementById("detailDescription").textContent =
    project.description;
  document.getElementById("detailOwner").textContent =
    "Owner: " + (project.owner || "Not specified");

  const list = document.getElementById("proposalList");
  const proposals = project.proposals || [];

  if (!proposals.length) {
    list.innerHTML = `
      <div class="empty">
        No proposals yet. Use the form above to add your first design.
      </div>`;
    return;
  }

  list.innerHTML = proposals.map(proposal => {
    const current = proposal.versions[proposal.versions.length - 1];
    const imageURL = safeImageURL(current.image || "");
    const statusClass = proposal.status === "Approved"
      ? "Approved"
      : proposal.status === "Rejected"
        ? "Rejected"
        : proposal.status === "Needs Changes"
          ? "needs-changes"
          : "";

    const versionsHTML = proposal.versions.map(version => `
      <li>
        <strong>V${version.number}</strong> —
        ${escapeHTML(version.notes || "Design revision")}
        <span class="version">
          (${escapeHTML(version.date)})
        </span>
      </li>
    `).join("");

    const commentsHTML = proposal.comments.length
      ? proposal.comments.map(comment => `
          <li>
            ${escapeHTML(comment.text)}
            <span class="version">
              — ${escapeHTML(comment.date)}
            </span>
          </li>
        `).join("")
      : "<li>No comments yet.</li>";

    return `
      <article class="proposal-card">
        ${imageURL
          ? `<img src="${escapeHTML(imageURL)}"
               alt="Design proposal"
               loading="lazy"
               onerror="this.hidden=true">`
          : ""}
        <h4>${escapeHTML(proposal.name)}</h4>
        <p>${escapeHTML(current.notes || "No design notes added.")}</p>
        <p>
          <span class="status ${statusClass}">
            ${escapeHTML(proposal.status)}
          </span>
        </p>
        <p class="version">
          Current version: V${current.number}
        </p>

        <h4>Version History</h4>
        <ul class="comment-list">${versionsHTML}</ul>

        <label for="status-${escapeHTML(proposal.id)}">
          Approval status
        </label>
        <select id="status-${escapeHTML(proposal.id)}"
          data-status="${escapeHTML(proposal.id)}">
          ${["Pending", "Approved", "Needs Changes", "Rejected"]
            .map(status => `
              <option value="${status}"
                ${proposal.status === status ? "selected" : ""}>
                ${status}
              </option>
            `).join("")}
        </select>

        <div class="card-actions">
          <button data-revise="${escapeHTML(proposal.id)}">
            + New Version
          </button>
          <button data-comment="${escapeHTML(proposal.id)}">
            + Add Comment
          </button>
        </div>

        <h4>Review Comments</h4>
        <ul class="comment-list">${commentsHTML}</ul>
      </article>
    `;
  }).join("");
}

function render() {
  renderDashboard();
  renderProposals();
}

// Show the new-project form.
document.getElementById("newProjectBtn").addEventListener("click", () => {
  const panel = document.getElementById("projectFormPanel");
  panel.hidden = false;
  document.getElementById("projectName").focus();
});

document.getElementById("cancelProjectBtn").addEventListener("click", () => {
  document.getElementById("projectFormPanel").hidden = true;
});

// Create a project.
document.getElementById("projectForm").addEventListener("submit", event => {
  event.preventDefault();

  const project = {
    id: makeId(),
    name: document.getElementById("projectName").value.trim(),
    description: document.getElementById("projectDescription").value.trim(),
    owner: document.getElementById("projectOwner").value.trim(),
    proposals: []
  };

  if (!project.name || !project.description) return;

  projects.unshift(project);
  selectedProjectId = project.id;

  saveProjects();
  event.target.reset();
  document.getElementById("projectFormPanel").hidden = true;
  render();
});

// Open a project from its card.
document.getElementById("projectList").addEventListener("click", event => {
  const button = event.target.closest("[data-open-project]");
  if (!button) return;

  selectedProjectId = button.dataset.openProject;
  renderProposals();

  document.getElementById("detailSection").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

document.getElementById("closeDetailBtn").addEventListener("click", () => {
  selectedProjectId = null;
  renderProposals();
});

// Add a design proposal.
document.getElementById("proposalForm").addEventListener("submit", event => {
  event.preventDefault();

  const project = getSelectedProject();
  if (!project) return;

  const imageInput = document.getElementById("proposalImage").value.trim();

  if (imageInput && !safeImageURL(imageInput)) {
    alert("Please enter a valid HTTP or HTTPS image URL.");
    return;
  }

  const proposal = {
    id: makeId(),
    name: document.getElementById("proposalName").value.trim(),
    status: "Pending",
    versions: [{
      number: 1,
      image: imageInput,
      notes: document.getElementById("proposalNotes").value.trim(),
      date: new Date().toLocaleDateString()
    }],
    comments: []
  };

  if (!proposal.name) return;

  project.proposals.push(proposal);
  saveProjects();
  event.target.reset();
  render();
});

// Update approval status, create versions, and add comments.
document.getElementById("proposalList").addEventListener("change", event => {
  const id = event.target.dataset.status;
  if (!id) return;

  const project = getSelectedProject();
  const proposal = project?.proposals.find(p => p.id === id);
  if (!proposal) return;

  proposal.status = event.target.value;
  saveProjects();
  render();
});

document.getElementById("proposalList").addEventListener("click", event => {
  const reviseButton = event.target.closest("[data-revise]");
  const commentButton = event.target.closest("[data-comment]");

  const project = getSelectedProject();
  if (!project) return;

  if (reviseButton) {
    const proposal = project.proposals.find(
      p => p.id === reviseButton.dataset.revise
    );
    if (!proposal) return;

    const previous = proposal.versions[proposal.versions.length - 1];

    const notes = prompt("Describe the changes in this version:");
    if (notes === null || !notes.trim()) return;

    const image = prompt(
      "Enter the image URL for this version, or leave blank:",
      previous.image || ""
    );
    if (image === null) return;

    if (image.trim() && !safeImageURL(image.trim())) {
      alert("Please enter a valid HTTP or HTTPS image URL.");
      return;
    }

    proposal.versions.push({
      number: previous.number + 1,
      image: image.trim(),
      notes: notes.trim(),
      date: new Date().toLocaleDateString()
    });

    proposal.status = "Pending";
    saveProjects();
    render();
  }

  if (commentButton) {
    const proposal = project.proposals.find(
      p => p.id === commentButton.dataset.comment
    );
    if (!proposal) return;

    const text = prompt("Enter your review comment:");
    if (text === null || !text.trim()) return;

    proposal.comments.push({
      text: text.trim(),
      date: new Date().toLocaleDateString()
    });

    saveProjects();
    render();
  }
});

// Display saved data on page load.
render();