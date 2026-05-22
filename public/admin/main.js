const owner = "camdownproductions-stack";
const repo = "camdownproductions";
const branch = "main";

const files = {
  folders: "public/drive-folders.json",
  content: "public/site-content.json"
};

const defaultContent = {
  navigation: {
    left: [],
    portfolio: [],
    right: []
  },
  blogs: []
};

const state = {
  token: "",
  folders: null,
  content: null,
  sha: {}
};

const tokenInput = document.querySelector("#token");
const loadButton = document.querySelector("#load");
const clearButton = document.querySelector("#clear");
const editor = document.querySelector("#editor");
const statusBox = document.querySelector("#status");
const messageInput = document.querySelector("#message");

const repeaters = {
  "nav-left": document.querySelector("#nav-left"),
  "nav-portfolio": document.querySelector("#nav-portfolio"),
  "nav-right": document.querySelector("#nav-right"),
  blogs: document.querySelector("#blogs")
};

function setStatus(message) {
  statusBox.textContent = message;
}

function getPathValue(source, path) {
  return path.split(".").reduce((value, key) => value?.[key], source) || "";
}

function setPathValue(target, path, value) {
  const keys = path.split(".");
  const finalKey = keys.pop();
  let current = target;

  keys.forEach((key) => {
    current[key] = current[key] || {};
    current = current[key];
  });

  current[finalKey] = value.trim();
}

function encodeBase64(value) {
  return btoa(unescape(encodeURIComponent(value)));
}

function decodeBase64(value) {
  return decodeURIComponent(escape(atob(value.replace(/\n/g, ""))));
}

async function githubRequest(path, options = {}) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${state.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {})
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "GitHub request failed.");
  }

  return data;
}

async function loadJson(key) {
  const file = await githubRequest(files[key]);
  state.sha[key] = file.sha;
  return JSON.parse(decodeBase64(file.content));
}

async function saveJson(key, data, message) {
  const body = {
    message,
    branch,
    sha: state.sha[key],
    content: encodeBase64(`${JSON.stringify(data, null, 2)}\n`)
  };

  const file = await githubRequest(files[key], {
    method: "PUT",
    body: JSON.stringify(body)
  });

  state.sha[key] = file.content.sha;
}

function navRow(item = { label: "", href: "" }) {
  const row = document.createElement("div");
  row.className = "repeater-row";
  row.innerHTML = `
    <label>Label <input data-field="label" value="${escapeHtml(item.label || "")}" /></label>
    <label>Link <input data-field="href" value="${escapeHtml(item.href || "")}" /></label>
    <button type="button" class="remove-row">Remove</button>
  `;
  return row;
}

function blogRow(item = { title: "", category: "", excerpt: "", image: "", url: "" }) {
  const row = document.createElement("div");
  row.className = "repeater-row blog-row";
  row.innerHTML = `
    <label>Title <input data-field="title" value="${escapeHtml(item.title || "")}" /></label>
    <label>Category <input data-field="category" value="${escapeHtml(item.category || "")}" /></label>
    <label class="wide">Excerpt <textarea data-field="excerpt">${escapeHtml(item.excerpt || "")}</textarea></label>
    <label>Image URL <input data-field="image" value="${escapeHtml(item.image || "")}" /></label>
    <label>Read More URL <input data-field="url" value="${escapeHtml(item.url || "")}" /></label>
    <button type="button" class="remove-row">Remove</button>
  `;
  return row;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderRepeater(target, items, createRow) {
  target.innerHTML = "";
  items.forEach((item) => target.append(createRow(item)));
}

function readRows(target) {
  return [...target.querySelectorAll(".repeater-row")]
    .map((row) => {
      const item = {};
      row.querySelectorAll("[data-field]").forEach((field) => {
        item[field.dataset.field] = field.value.trim();
      });
      return item;
    })
    .filter((item) => Object.values(item).some(Boolean));
}

function fillForm() {
  const content = {
    ...defaultContent,
    ...state.content,
    navigation: {
      ...defaultContent.navigation,
      ...(state.content.navigation || {})
    },
    blogs: state.content.blogs || []
  };

  state.content = content;

  editor.querySelectorAll("[name]").forEach((field) => {
    const source = field.name.startsWith("videos.") || field.name.startsWith("photos.")
      ? state.folders
      : state.content;

    field.value = getPathValue(source, field.name);
  });

  renderRepeater(repeaters["nav-left"], content.navigation.left, navRow);
  renderRepeater(repeaters["nav-portfolio"], content.navigation.portfolio, navRow);
  renderRepeater(repeaters["nav-right"], content.navigation.right, navRow);
  renderRepeater(repeaters.blogs, content.blogs, blogRow);
}

function collectForm() {
  const folders = structuredClone(state.folders);
  const content = structuredClone(state.content);

  editor.querySelectorAll("[name]").forEach((field) => {
    const target = field.name.startsWith("videos.") || field.name.startsWith("photos.")
      ? folders
      : content;

    setPathValue(target, field.name, field.value);
  });

  content.navigation = {
    left: readRows(repeaters["nav-left"]),
    portfolio: readRows(repeaters["nav-portfolio"]),
    right: readRows(repeaters["nav-right"])
  };
  content.blogs = readRows(repeaters.blogs);

  return { folders, content };
}

loadButton.addEventListener("click", async () => {
  state.token = tokenInput.value.trim();

  if (!state.token) {
    setStatus("Paste a GitHub token first.");
    return;
  }

  try {
    setStatus("Loading website data from GitHub...");
    const [folders, content] = await Promise.all([loadJson("folders"), loadJson("content")]);
    state.folders = folders;
    state.content = content;
    fillForm();
    editor.hidden = false;
    setStatus("Loaded. You can add, remove, edit, and publish now.");
  } catch (error) {
    setStatus(`Could not load data: ${error.message}`);
  }
});

clearButton.addEventListener("click", () => {
  tokenInput.value = "";
  state.token = "";
  editor.hidden = true;
  setStatus("Token cleared.");
});

document.addEventListener("click", (event) => {
  const addButton = event.target.closest(".add-row");
  const removeButton = event.target.closest(".remove-row");

  if (addButton) {
    const list = addButton.dataset.list;
    repeaters[list].append(list === "blogs" ? blogRow() : navRow());
  }

  if (removeButton) {
    removeButton.closest(".repeater-row")?.remove();
  }
});

editor.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    setStatus("Saving changes to GitHub...");
    const { folders, content } = collectForm();
    const message = messageInput.value.trim() || "Update website dashboard content";

    await saveJson("folders", folders, message);
    await saveJson("content", content, message);

    state.folders = folders;
    state.content = content;
    setStatus("Saved. Your hosting platform will redeploy the website automatically.");
  } catch (error) {
    setStatus(`Could not save changes: ${error.message}`);
  }
});
