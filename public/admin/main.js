const owner = "camdownproductions-stack";
const repo = "camdownproductions";
const branch = "main";

const files = {
  folders: "public/drive-folders.json",
  content: "public/site-content.json"
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

function fillForm() {
  editor.querySelectorAll("[name]").forEach((field) => {
    const source = field.name.startsWith("videos.") || field.name.startsWith("photos.")
      ? state.folders
      : state.content;

    field.value = getPathValue(source, field.name);
  });
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
    setStatus("Loaded. You can edit and publish now.");
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
    setStatus("Saved. GitHub Pages will redeploy the website automatically.");
  } catch (error) {
    setStatus(`Could not save changes: ${error.message}`);
  }
});
