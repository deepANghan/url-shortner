// ===== Configuration =====
const API_BASE = "http://localhost:3000/api/v1/url";

// ===== DOM Elements =====
const tabBtns = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

// Shorten panel
const shortenForm = document.getElementById("shorten-form");
const shortenInput = document.getElementById("shorten-input");
const shortenBtn = document.getElementById("shorten-btn");
const shortenResult = document.getElementById("shorten-result");
const shortenResultLabel = document.getElementById("shorten-result-label");
const shortenResultUrl = document.getElementById("shorten-result-url");
const shortenResultError = document.getElementById("shorten-result-error");
const copyBtn = document.getElementById("copy-btn");

// Lookup panel
const lookupForm = document.getElementById("lookup-form");
const lookupInput = document.getElementById("lookup-input");
const lookupBtn = document.getElementById("lookup-btn");
const lookupResult = document.getElementById("lookup-result");
const lookupResultLabel = document.getElementById("lookup-result-label");
const lookupOriginalUrl = document.getElementById("lookup-original-url");
const lookupShortenUrl = document.getElementById("lookup-shorten-url");
const lookupResultError = document.getElementById("lookup-result-error");

// Toast
const toast = document.getElementById("toast");

// ===== Tab Switching =====
tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;

    tabBtns.forEach((b) => b.classList.remove("active"));
    tabPanels.forEach((p) => p.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(`panel-${target}`).classList.add("active");
  });
});

// ===== Shorten URL =====
shortenForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const originalUrl = shortenInput.value.trim();
  if (!originalUrl) return;

  setLoading(shortenBtn, true);
  hideResult(shortenResult);

  try {
    const res = await fetch(API_BASE + "/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ originalUrl }),
    });

    const data = await res.json();

    if (data.success) {
      showShortenSuccess(data.data.shortenUrl);
    } else {
      showShortenError(data.message || "Something went wrong");
    }
  } catch (err) {
    showShortenError("Could not connect to the server. Is it running?");
  } finally {
    setLoading(shortenBtn, false);
  }
});

function showShortenSuccess(shortCode) {
  const fullUrl = `${API_BASE}/${shortCode}`;

  shortenResult.className = "result-box visible success";
  shortenResultLabel.textContent = "Shortened URL";
  shortenResultUrl.textContent = fullUrl;
  shortenResultUrl.style.display = "block";
  shortenResultError.style.display = "none";
  copyBtn.style.display = "inline-flex";
  copyBtn.dataset.url = fullUrl;
  resetCopyBtn();
}

function showShortenError(message) {
  shortenResult.className = "result-box visible error";
  shortenResultLabel.textContent = "Error";
  shortenResultUrl.style.display = "none";
  shortenResultError.style.display = "block";
  shortenResultError.textContent = message;
  copyBtn.style.display = "none";
}

// ===== Lookup URL =====
lookupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const shortUrl = lookupInput.value.trim();
  if (!shortUrl) return;

  setLoading(lookupBtn, true);
  hideResult(lookupResult);

  try {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(shortUrl)}`);
    const data = await res.json();

    if (data.success) {
      showLookupSuccess(data.data);
    } else {
      showLookupError(data.message || "Short URL not found");
    }
  } catch (err) {
    showLookupError("Could not connect to the server. Is it running?");
  } finally {
    setLoading(lookupBtn, false);
  }
});

function showLookupSuccess(data) {
  lookupResult.className = "result-box visible success";
  lookupResultLabel.textContent = "URL Found";

  lookupOriginalUrl.innerHTML = `<a href="${escapeHtml(data.originalUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(data.originalUrl)}</a>`;
  lookupShortenUrl.textContent = data.shortenUrl;

  document.getElementById("lookup-details").style.display = "flex";
  lookupResultError.style.display = "none";
}

function showLookupError(message) {
  lookupResult.className = "result-box visible error";
  lookupResultLabel.textContent = "Error";
  document.getElementById("lookup-details").style.display = "none";
  lookupResultError.style.display = "block";
  lookupResultError.textContent = message;
}

// ===== Copy to Clipboard =====
copyBtn.addEventListener("click", async () => {
  const url = copyBtn.dataset.url;
  if (!url) return;

  try {
    await navigator.clipboard.writeText(url);
    copyBtn.classList.add("copied");
    copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    showToast("Copied to clipboard!");

    setTimeout(resetCopyBtn, 2000);
  } catch {
    showToast("Failed to copy");
  }
});

function resetCopyBtn() {
  copyBtn.classList.remove("copied");
  copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
}

// ===== Helpers =====
function setLoading(btn, isLoading) {
  if (isLoading) {
    btn.classList.add("loading");
    btn.disabled = true;
  } else {
    btn.classList.remove("loading");
    btn.disabled = false;
  }
}

function hideResult(el) {
  el.classList.remove("visible", "success", "error");
  el.style.display = "none";
  // Force reflow for re-animation
  void el.offsetHeight;
  el.style.display = "";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
