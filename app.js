const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const KEY = "yoch.v1";
const defaultState = () => ({
  onboarded: false,
  profile: {
    name: "You",
    handle: "you",
    bio: "Daily life, on my terms.",
    mood: "Building my channel",
    vibe: "Late-night gold light · lo-fi",
    privacy: "friends",
    radiusKm: 25,
    city: "",
    lat: null,
    lng: null,
    theme: "amber"
  },
  posts: [{ id: "p1", author: "You", when: "today", text: "First adventure on YOCH — keeping this local, choosing who watches.", kind: "life" }],
  friends: [
    { name: "Mira", meta: "2.1 km · creator", color: "#e8c36a", top: true },
    { name: "Jules", meta: "4.8 km · nearby", color: "#6ec8b8", top: true },
    { name: "Ren", meta: "invite only", color: "#e07a7a", top: true },
    { name: "Asha", meta: "YOCR collab", color: "#9b8cff", top: true },
    { name: "Theo", meta: "8.0 km", color: "#7dcaa0", top: true },
    { name: "Noor", meta: "local market", color: "#f3d78a", top: true },
    { name: "Sol", meta: "film night", color: "#c9a227", top: true },
    { name: "Bee", meta: "YOLI", color: "#f0b0b0", top: true },
    { name: "Kenji", meta: "12 km", color: "#88a", top: false },
    { name: "Priya", meta: "request", color: "#a97", top: false }
  ],
  messages: [
    { from: "Mira", text: "Your channel skin is gorgeous. Local-only tonight?", me: false },
    { from: "You", text: "Yes — 5 mile radius. Come through if you're close.", me: true },
    { from: "Jules", text: "Dropped a YOCR cut in your creations.", me: false }
  ],
  money: { balance: 128.4, tips: 42, subs: 11, sales: 3 },
  creations: [],
  journal: [{ title: "Tuesday light", body: "Coffee on the porch. Decided the channel stays small on purpose." }]
});

let state = load();
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}
function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.style.display = "block";
  clearTimeout(toast._t);
  toast._t = setTimeout(() => (el.style.display = "none"), 2400);
}

function initials(name) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function showView(id) {
  $$(".view").forEach((v) => v.classList.toggle("active", v.id === `view-${id}`));
  $$(".tab").forEach((t) => t.classList.toggle("active", t.dataset.view === id));
  if (id === "messages") openMessages(true);
  location.hash = id === "home" && !state.onboarded ? "welcome" : id;
}

function renderAll() {
  renderWelcome();
  renderChannel();
  renderFriends();
  renderCreate();
  renderMoney();
  renderLife();
  renderMessages();
  renderGeoPill();
  if (state.onboarded) {
    $("#view-welcome").classList.remove("active");
    if (!$$(".view.active").length) showView("channel");
  }
}

function renderWelcome() {
  $("#hero-name").textContent = state.profile.name === "You" ? "your" : state.profile.name + "'s";
}

function renderGeoPill() {
  const loc = state.profile.city || (state.profile.lat ? "Located" : "Local off");
  $("#geo-pill").innerHTML = `<span class="live-dot"></span>${loc} · ${state.profile.radiusKm} km`;
  $("#geo-pill").classList.toggle("live", Boolean(state.profile.lat || state.profile.city));
}

function renderChannel() {
  const p = state.profile;
  $("#ch-name").textContent = p.name;
  $("#ch-handle").textContent = `@${p.handle}`;
  $("#ch-bio").textContent = p.bio;
  $("#ch-mood").textContent = p.mood;
  $("#ch-vibe").textContent = p.vibe;
  $("#ch-avatar").textContent = initials(p.name);
  $("#privacy-label").textContent = privacyLabel(p.privacy);
  const feed = $("#feed");
  feed.innerHTML = state.posts.map((post) => `
      <article class="post">
        <div class="who">${post.author} <span>${post.when} · ${post.kind}</span></div>
        <p>${escapeHtml(post.text)}</p>
        ${post.media ? `<div class="post-media">${escapeHtml(post.media)}</div>` : ""}
      </article>`).join("");
}

function privacyLabel(v) {
  return ({ public: "Anyone can watch", friends: "Friends only", local: "Local radius only", private: "Invite only", me: "Only you" }[v] || v);
}

function renderFriends() {
  const top = state.friends.filter((f) => f.top).slice(0, 8);
  $("#top8").innerHTML = top.map((f) => `
      <button class="friend" data-name="${f.name}">
        <div class="dot" style="background:${f.color}22;color:${f.color}">${initials(f.name)}</div>
        ${escapeHtml(f.name)}
      </button>`).join("");
  $("#friend-list").innerHTML = state.friends.map((f) => `
      <div class="person">
        <div class="dot" style="background:${f.color}22;color:${f.color};width:36px;height:36px;border-radius:12px;display:grid;place-items:center">${initials(f.name)}</div>
        <div class="grow"><b>${escapeHtml(f.name)}</b><small>${escapeHtml(f.meta)}</small></div>
        <button class="btn btn-ghost" data-msg="${f.name}">Message</button>
      </div>`).join("");
}

function renderCreate() {
  const list = $("#creation-list");
  if (!state.creations.length) {
    list.innerHTML = `<p class="muted">Nothing yet. Make a star video or a minimal Grok draft — it stays on your channel until you publish.</p>`;
    return;
  }
  list.innerHTML = state.creations.map((c) => `<article class="post"><div class="who">${c.type} <span>${c.when}</span></div><p>${escapeHtml(c.title)}</p><div class="post-media">${escapeHtml(c.note)}</div></article>`).join("");
}

function renderMoney() {
  const m = state.money;
  $("#yo-balance").textContent = `$${m.balance.toFixed(2)}`;
  $("#st-tips").textContent = `$${m.tips}`;
  $("#st-subs").textContent = m.subs;
  $("#st-sales").textContent = m.sales;
}

function renderLife() {
  $("#journal").innerHTML = state.journal.map((j) => `<article class="post"><div class="who">${escapeHtml(j.title)}</div><p>${escapeHtml(j.body)}</p></article>`).join("");
}

function renderMessages() {
  const box = $("#msgs");
  box.innerHTML = state.messages.map((m) => `<div class="bubble ${m.me ? "out" : "in"}"><b>${escapeHtml(m.from)}</b><br>${escapeHtml(m.text)}</div>`).join("");
  box.scrollTop = box.scrollHeight;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&", "<": "<", ">": ">", '"': """, "'": "&#39;" }[c]));
}

function openMessages(open) {
  $("#drawer").classList.toggle("open", open);
  $("#backdrop").classList.toggle("open", open);
}

function publishAdventure() {
  const text = $("#adventure").value.trim();
  if (!text) return toast("Write a moment first");
  state.posts.unshift({ id: crypto.randomUUID(), author: state.profile.name, when: "just now", text, kind: "adventure" });
  $("#adventure").value = "";
  save();
  renderChannel();
  toast("Added to your channel");
}

function saveProfileFromForm() {
  const name = $("#f-name").value.trim() || "You";
  state.profile.name = name;
  state.profile.handle = ($("#f-handle").value.trim() || name.toLowerCase().replace(/\s+/g, "")).replace(/^@/, "");
  state.profile.bio = $("#f-bio").value.trim() || state.profile.bio;
  state.profile.mood = $("#f-mood").value.trim() || state.profile.mood;
  state.profile.privacy = $("#f-privacy").value;
  state.profile.radiusKm = Number($("#f-radius").value) || 25;
  state.onboarded = true;
  save();
  renderAll();
  showView("channel");
  toast("Channel live — you choose who watches");
}

async function locate() {
  $("#geo-pill").textContent = "Finding you…";
  const apply = (city, lat, lng) => {
    state.profile.city = city;
    state.profile.lat = lat;
    state.profile.lng = lng;
    save();
    renderGeoPill();
    toast("Local mode on");
  };
  if (!navigator.geolocation) {
    apply("Sacramento", 38.58, -121.49);
    return;
  }
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      let city = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`, { headers: { "Accept-Language": "en" } });
        const data = await res.json();
        city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || city;
      } catch {}
      apply(city, latitude, longitude);
    },
    () => apply("Nearby (approx)", null, null),
    { enableHighAccuracy: false, timeout: 8000 }
  );
}

function grokDraft() {
  const seed = $("#grok-seed").value.trim() || state.profile.mood;
  const lines = [
    `Caption: "${seed}" — kept close, shot at golden hour, no performance except being here.`,
    `Channel note: Today stays inside ${state.profile.radiusKm} km. If you know the light on this street, you're invited.`,
    `Star-video beat sheet: 1) hands + morning 2) the walk 3) one honest line to camera 4) cut to friends.`,
    `YOLI entry: I don't need the whole internet. I need the people who would show up.`
  ];
  const pick = lines[Math.floor(Math.random() * lines.length)];
  $("#grok-out").textContent = pick;
  state.creations.unshift({ type: "Grok draft", title: seed, note: pick, when: "just now" });
  save();
  renderCreate();
  toast("Minimal Grok draft saved");
}

function makeStarVideo() {
  const scene = document.querySelector(".choice.selected")?.dataset.scene || "golden hour walk";
  const title = `You, starring in ${scene}`;
  state.creations.unshift({ type: "Star video", title, note: "Storyboard locked · you are the only face · publish when ready", when: "just now" });
  state.posts.unshift({ id: crypto.randomUUID(), author: state.profile.name, when: "just now", text: title, kind: "YOCR", media: "★ Preview reel — you as the star" });
  save();
  renderCreate();
  renderChannel();
  $("#preview-copy").textContent = title;
  toast("Star video queued on your channel");
}

function sendMsg() {
  const input = $("#msg-input");
  const text = input.value.trim();
  if (!text) return;
  state.messages.push({ from: state.profile.name, text, me: true });
  input.value = "";
  save();
  renderMessages();
}

function addJournal() {
  const title = $("#j-title").value.trim();
  const body = $("#j-body").value.trim();
  if (!title || !body) return toast("Title and note, please");
  state.journal.unshift({ title, body });
  $("#j-title").value = "";
  $("#j-body").value = "";
  save();
  renderLife();
  toast("Saved to YOLI");
}

function tipMe() {
  state.money.tips += 5;
  state.money.balance += 5;
  save();
  renderMoney();
  toast("Demo tip +$5");
}

let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  $("#install-btn").style.display = "inline-flex";
});
async function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    $("#install-btn").style.display = "none";
    return;
  }
  toast("Use Share → Add to Home Screen on iOS, or Install in the browser menu");
}

function bind() {
  $$(".tab").forEach((t) => t.addEventListener("click", () => {
    if (t.dataset.view === "messages") { openMessages(true); return; }
    showView(t.dataset.view);
  }));
  $("#backdrop").addEventListener("click", () => openMessages(false));
  $("#close-drawer").addEventListener("click", () => openMessages(false));
  $("#publish").addEventListener("click", publishAdventure);
  $("#save-channel").addEventListener("click", saveProfileFromForm);
  $("#start-channel").addEventListener("click", () => { $("#modal-create").classList.add("open"); });
  $("#close-modal").addEventListener("click", () => $("#modal-create").classList.remove("open"));
  $("#geo-pill").addEventListener("click", locate);
  $("#btn-locate").addEventListener("click", locate);
  $("#btn-grok").addEventListener("click", grokDraft);
  $("#btn-star").addEventListener("click", makeStarVideo);
  $("#send-msg").addEventListener("click", sendMsg);
  $("#msg-input").addEventListener("keydown", (e) => { if (e.key === "Enter") sendMsg(); });
  $("#btn-journal").addEventListener("click", addJournal);
  $("#btn-tip").addEventListener("click", tipMe);
  $("#install-btn").addEventListener("click", installApp);
  $("#edit-channel").addEventListener("click", () => {
    $("#f-name").value = state.profile.name;
    $("#f-handle").value = state.profile.handle;
    $("#f-bio").value = state.profile.bio;
    $("#f-mood").value = state.profile.mood;
    $("#f-privacy").value = state.profile.privacy;
    $("#f-radius").value = state.profile.radiusKm;
    $("#modal-create").classList.add("open");
  });
  document.addEventListener("click", (e) => {
    const msg = e.target.closest("[data-msg]");
    if (msg) {
      openMessages(true);
      $("#msg-input").placeholder = `Message ${msg.dataset.msg}…`;
    }
    const choice = e.target.closest(".choice");
    if (choice) {
      $$(".choice").forEach((c) => c.classList.remove("selected"));
      choice.classList.add("selected");
    }
  });
  const hash = location.hash.replace("#", "");
  if (hash && $(`#view-${hash}`)) showView(hash);
  else if (state.onboarded) showView("channel");
  else showView("welcome");
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

bind();
renderAll();
