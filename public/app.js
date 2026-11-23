const app = document.querySelector("#app");
const nav = document.querySelector("#navigation");
const account = document.querySelector("#account");
const effects = document.querySelector("#effects");
const confirmBox = document.querySelector("#confirm");
const sticker = "/ronaldo.png";
const subjects = [
  ["Toán", "🔢", "#e9f4d1"],
  ["Tiếng Việt", "📚", "#ffeaca"],
  ["Tiếng Anh", "🎧", "#e9e8ff"],
];
let state = {name: "", profile: null, catalog: [], rewards: []};
let view = "home";
let quiz;
let busy = false;
let update = 0;
let redemption;
let parentRole = "dad";
let parentPassword = "";
let pendingGift = null;
const subjectPages = new Map();
const lessonsPerPage = 5;
const date = new Intl.DateTimeFormat("vi-VN", {dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh"});

const esc = value => String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[ch]);
const banner = (title, description) => '<section class="hero"><div><span class="eyebrow">Lớp 2 · Học kỳ I</span><h1>' + title + '</h1><p>' + description + '</p></div><div class="hero-art"><img src="' + sticker + '" alt="Sticker Ronaldo mặc áo số 7"></div></section>';
const status = '<p class="status" id="status" role="status"></p>';
const stickerImage = '<img src="' + sticker + '" alt="">';

function report(message, ok = false) {
  const el = document.querySelector("#status");
  if (el) {
    el.textContent = message;
    el.classList.toggle("ok", ok);
  }
}

async function api(action, fields = {}, name = state.name) {
  const response = await fetch("/api/classroom", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({action, name, ...fields}),
  });
  const json = await response.json().catch(() => null);
  if (!response.ok || !json) throw new Error(json?.error || "Chưa kết nối được lớp học. Hãy thử lại.");
  return json;
}

function header() {
  nav.hidden = !state.profile;
  account.innerHTML = state.profile
    ? '<div class="account-inner"><span class="wallet" aria-label="' + state.profile.balance + ' sticker Ronaldo">' + stickerImage + state.profile.balance + '</span><button class="plain" data-logout>Đổi tên</button></div>' : "";
  nav.querySelectorAll("button").forEach(button => {
    if (button.dataset.view === view) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
}

function home() {
  if (!state.profile) {
    app.innerHTML = banner('Lớp học của <em>Trường Sơn</em>', 'Ôn tập Toán, Tiếng Việt và Tiếng Anh. Làm bài để sưu tập sticker Ronaldo và đổi quà.') +
      '<form id="login" class="login"><h2>Vào lớp học</h2><p class="muted">Dùng lại cùng một tên đăng nhập trên các thiết bị để xem tiến độ của em.</p><label for="username">Tên đăng nhập</label><div class="login-row"><input id="username" name="username" autocomplete="username" minlength="2" maxlength="32" required placeholder="Nhập tên của em"><button class="primary">Vào lớp</button></div>' + status + '</form>';
    document.querySelector("#login").addEventListener("submit", event => {
      event.preventDefault();
      login(document.querySelector("#username").value);
    });
    return;
  }
  const scores = new Map();
  for (const record of state.profile.history) {
    if (record.kind === "submit") scores.set(record.id, Math.max(scores.get(record.id) ?? 0, record.score));
  }
  const cards = subjects.map(([label, icon, tone]) => {
    const subject = state.catalog.filter(item => item.subject === label);
    const numberOfPages = Math.ceil(subject.length / lessonsPerPage);
    const page = Math.min(subjectPages.get(label) ?? 0, numberOfPages - 1);
    const first = page * lessonsPerPage;
    const lessons = subject.slice(first, first + lessonsPerPage).map((item, index) => {
      const best = scores.get(item.id);
      const detail = best === undefined ? "10 câu" : "Tốt nhất " + best + "/10";
      return '<button class="lesson" data-quiz="' + item.id + '"><b><small>Bài ' + (first + index + 1) + '</small>' + esc(item.title) + '</b><span>' + detail + '</span></button>';
    }).join("");
    const pages = Array.from({length: numberOfPages}, (_, i) => {
      const start = i * lessonsPerPage + 1;
      const end = Math.min(subject.length, start + lessonsPerPage - 1);
      return '<option value="' + i + '"' + (page === i ? " selected" : "") + '>Bài ' + start + "–" + end + "</option>";
    }).join("");
    const pageSelect = '<select class="page-select" aria-label="Chọn nhóm bài ' + label + '" data-subject-page="' + label + '">' + pages + "</select>";
    return '<article class="subject" style="--tone:' + tone + '"><span class="subject-icon" aria-hidden="true">' + icon + '</span><h3>' + label + '</h3><p class="subject-count">' + subject.length + ' bài · ' + (subject.length * 10) + ' câu</p>' + pageSelect + lessons + '</article>';
  }).join("");
  app.innerHTML = banner('Chào <em>' + esc(state.name) + '</em>!', 'Chọn một bài ôn tập, trả lời 10 câu và tích sticker Ronaldo để đổi món quà em thích.') +
    '<section class="section"><h2>Chọn bài ôn tập</h2>' + status + '<div class="subjects">' + cards + '</div><div class="rules" aria-label="Cách nhận sticker"><span>10/10 · 3 sticker</span><span>9/10 · 2 sticker</span><span>8/10 · 1 sticker</span><span>0–7/10 · 0 sticker</span></div></section>';
}

function play() {
  const q = quiz.questions[quiz.index];
  const english = quiz.id.startsWith("en-");
  const n = quiz.index + 1;
  const opts = q.choices.map((choice, i) => '<label class="choice"><input type="radio" name="answer" value="' + i +
    '"' + (quiz.answers[quiz.index] === i ? " checked" : "") + '><b aria-hidden="true">' + "ABCD"[i] + '</b><span>' + esc(choice) + '</span></label>').join("");
  app.innerHTML = '<section class="quiz" lang="' + (english ? "en" : "vi") + '"><div class="quiz-head"><p>' +
    esc(quiz.title) + '</p><span>' + (english ? "Question " : "Câu ") + n + '/10</span></div><progress class="progress" max="10" value="' + n +
    '" aria-label="' + (english ? "Quiz progress" : "Tiến độ bài làm") + '"></progress><form id="answer-form" class="panel">' +
    (q.passage ? '<p class="passage">' + esc(q.passage) + '</p>' : "") +
    '<fieldset><legend id="question" tabindex="-1">' + esc(q.prompt) + '</legend>' +
    (q.audio ? '<audio controls preload="none" src="' + esc(q.audio) + '" aria-label="Play listening question"></audio>' : "") +
    '<div class="choices">' + opts + '</div></fieldset><div class="actions"><button type="button" class="secondary" data-back ' +
    (n === 1 ? "disabled" : "") + '>' + (english ? "Previous" : "Câu trước") +
    '</button><button class="primary" ' + (quiz.answers[quiz.index] === undefined ? "disabled" : "") + '>' +
    (n < 10 ? english ? "Next" : "Câu tiếp theo" : english ? "Submit quiz" : "Nộp bài") + '</button></div>' + status + '</form></section>';
  const form = document.querySelector("#answer-form");
  form.addEventListener("change", event => {
    quiz.answers[quiz.index] = Number(event.target.value);
    form.querySelector(".primary").disabled = false;
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (quiz.answers[quiz.index] === undefined || busy) return;
    if (n < 10) {
      quiz.index++;
      play();
      document.querySelector("#question").focus();
    } else {
      submitQuiz();
    }
  });
}

function showResult(result) {
  const english = quiz.id.startsWith("en-");
  const review = quiz.questions.map((q, i) => '<li><b>' + esc(q.prompt) + '</b><p>' +
    (english ? "Your answer" : "Em chọn") + ' · ' + esc(q.choices[result.answers[i]]) + '</p><p>' +
    (english ? "Correct answer" : "Đáp án đúng") + ' · ' + esc(q.choices[result.review[i]]) + '</p></li>').join("");
  const rewardText = result.earned ? "Chúc mừng! Em đã nhận được " + result.earned + " sticker Ronaldo." : "Cố lên! Từ 8 câu đúng, em sẽ nhận được sticker.";
  app.innerHTML = '<section class="result panel"><div class="result-intro"><p class="subtitle">' + esc(result.title) +
    '</p><h1 class="score">' + result.score + '/10</h1><p>' + rewardText + '</p><div class="earned" aria-hidden="true">' +
    stickerImage.repeat(result.earned) + '</div></div><div class="actions"><button class="secondary" data-view="home">Về bài ôn tập</button>' +
    '<button class="primary" data-quiz="' + quiz.id + '">Làm lại</button></div>' + status +
    '<details class="review" lang="' + (english ? "en" : "vi") + '"><summary>' +
    (english ? "Review answers" : "Xem đáp án") + '</summary><ol>' + review + '</ol></details></section>';
  celebrate(result.earned);
}

function celebrate(count) {
  if (!count || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#ffcc48","#f06959","#5dcc87","#659bf5","#e99af4"];
  effects.replaceChildren();
  for (let i = 0; i < [0, 16, 46, 100][count]; i++) {
    const dot = document.createElement("i");
    const theta = Math.random() * Math.PI * 2;
    const radius = (60 + Math.random() * 200) * count / 2;
    dot.className = "spark";
    const origin = count === 3 ? [27, 50, 73][i % 3] : count === 2 ? [37, 63][i % 2] : 50;
    dot.style.cssText = "--left:" + origin + "%;--top:45%;--x:" + Math.cos(theta) * radius +
      "px;--y:" + Math.sin(theta) * radius + "px;--r:" + (Math.random() * 720 - 360) +
      "deg;--duration:" + (0.65 + count * .37 + Math.random() * .5) + "s;--c:" + colors[i % colors.length];
    effects.append(dot);
  }
  for (let i = 0; i < count; i++) {
    const pic = new Image();
    pic.className = "flying";
    pic.src = sticker;
    pic.alt = "";
    const offset = (i - (count - 1) / 2) * Math.min(130, innerWidth * .24);
    pic.style.cssText = "--x:" + offset + "px;--y:" + (-95 - count * 23) + "px;--r:" + offset / 6 +
      "deg;--duration:" + (1 + count * .28) + "s;--delay:" + i * .12 + "s";
    effects.append(pic);
  }
  setTimeout(() => effects.replaceChildren(), 2450);
}

function shop() {
  const cards = state.rewards.map(prize => {
    const canBuy = state.profile.balance >= prize.cost;
    return '<article class="reward"><span class="reward-icon" aria-hidden="true">' + prize.icon + '</span><h3>' + esc(prize.title) +
      '</h3><p class="price">' + prize.cost + ' Ronaldo</p><button class="primary" aria-label="Đổi ' + esc(prize.title) +
      '" data-prize="' + prize.id + '" ' + (canBuy ? "" : "disabled") + '>' + (canBuy ? "Đổi quà" : "Chưa đủ sticker") + '</button></article>';
  }).join("");
  app.innerHTML = '<h1>Đổi quà</h1><p class="subtitle">Em có <b>' + state.profile.balance + '</b> sticker Ronaldo.</p>' + status +
    '<p><button class="secondary" data-view="parents">Bố hoặc mẹ tặng sticker</button></p><div class="reward-grid">' + cards + '</div>';
}

function parentPage() {
  const label = parentRole === "dad" ? "Bố" : "Mẹ";
  const configured = state.profile.parents?.[parentRole];
  const password = (name, caption, autocomplete = "current-password") =>
    '<label>' + caption + '<input type="password" name="' + name + '" autocomplete="' + autocomplete + '" minlength="8" maxlength="128" required></label>';
  const fresh = name => password(name, "Mật khẩu mới", "new-password") + password("confirmation", "Nhập lại mật khẩu mới", "new-password");
  const button = text => '<button class="primary">' + text + '</button>';
  const form = (action, fields) => '<form class="parent-form" data-parent="' + action + '">' + fields + '</form>';
  const choice = '<label class="parent-select">Vai trò <select class="page-select" id="parent-role">' +
    ["dad","mom"].map(role => '<option value="' + role + '"' + (role === parentRole ? ' selected' : '') + '>' +
    (role === "dad" ? "Bố" : "Mẹ") + '</option>').join("") + '</select></label>';
  const content = parentPassword
    ? '<h2>' + label + ' tặng sticker</h2>' +
      form("gift", '<label>Số sticker Ronaldo<input type="number" name="amount" min="1" step="1" required></label>' +
        '<label>Lý do tặng<textarea name="reason" rows="3" maxlength="300" required></textarea></label>' + button("Tặng sticker")) +
      '<details><summary>Đổi mật khẩu</summary>' + form("parent-password", password("password","Mật khẩu cũ") +
        fresh("newPassword") + button("Lưu mật khẩu mới")) + '</details>' +
      '<p class="section"><button class="secondary" data-parent-lock>Đăng xuất mục tặng sticker</button></p>'
    : choice + (configured
      ? form("parent-login", password("password", "Mật khẩu của " + label.toLowerCase()) + button("Đăng nhập"))
      : form("parent-setup", '<p class="muted">Thiết lập lần đầu cho ' + label.toLowerCase() + ' bằng mã thiết lập trên Netlify.</p>' +
        '<label>Mã thiết lập<input type="password" name="setupCode" autocomplete="off" maxlength="128" required></label>' +
        fresh("password") + button("Thiết lập mật khẩu")));
  app.innerHTML = '<section class="panel parent-panel"><p><button class="secondary" data-view="shop">Về mục Đổi quà</button></p>' +
    '<h1>Tặng sticker</h1><p>Số dư của ' + esc(state.name) + ' · <b>' + state.profile.balance + ' Ronaldo</b></p>' + status + content + '</section>';
}

function parentSubmit(event) {
  const form = event.target;
  const action = form.dataset.parent;
  if (!action) return;
  event.preventDefault();
  locked(form.querySelector("button"), async () => {
    const {confirmation, ...payload} = Object.fromEntries(new FormData(form));
    if (confirmation !== undefined && confirmation !== (payload.newPassword ?? payload.password)) {
      throw new Error("Hai lần nhập mật khẩu chưa khớp.");
    }
    payload.role = parentRole;
    if (action === "gift") {
      payload.password = parentPassword;
      payload.amount = Number(payload.amount);
      const key = JSON.stringify([parentRole, payload.amount, payload.reason.trim()]);
      if (pendingGift?.key !== key) pendingGift = {key, token:crypto.randomUUID()};
      payload.token = pendingGift.token;
    }
    update++;
    const data = await api(action, payload);
    state.profile = data.profile;
    if (action === "parent-setup" || action === "parent-login") parentPassword = payload.password;
    if (action === "parent-password") parentPassword = payload.newPassword;
    if (action === "gift") {
      pendingGift = null;
      parentPassword = "";
    }
    render();
    if (action === "gift") report("Đã tặng " + data.result.amount + " sticker Ronaldo.", true);
    if (action === "parent-password") report("Đã đổi mật khẩu.", true);
  });
}

function history() {
  const groups = [["submit", "Bài đã làm", "Em chưa nộp bài nào."], ["redeem", "Phần thưởng đã đổi", "Em chưa đổi phần thưởng nào."], ["gift", "Sticker bố mẹ tặng", "Chưa có sticker được tặng."]];
  app.innerHTML = '<h1>Lịch sử</h1><p class="subtitle">Bài làm và phần thưởng của ' + esc(state.name) + '.</p>' + status +
    groups.map(([kind, title, blank]) => {
      const items = state.profile.history.filter(record => record.kind === kind).map(record => {
        const detail = kind === "submit" ? record.score + '/10 · +' + record.earned : kind === "gift" ? "+" + record.amount : "−" + record.cost;
        return '<li><div><strong>' + esc(record.title) + '</strong><small>' + date.format(new Date(record.date)) +
          '</small>' + (kind === 'gift' ? '<p>' + esc(record.reason) + '</p>' : '') + '</div><strong>' + detail + '</strong></li>';
      }).join("");
      return '<section class="section panel"><h2>' + title + '</h2>' +
        (items ? '<ul class="records">' + items + '</ul>' : '<p class="muted">' + blank + '</p>') + '</section>';
    }).join("");
}

function render() {
  header();
  if (view === "shop") shop();
  else if (view === "history") history();
  else if (view === "parents") parentPage();
  else if (view === "quiz") play();
  else home();
}

async function locked(button, work) {
  if (busy) return;
  busy = true;
  if (button) button.disabled = true;
  report("");
  try {
    await work();
  } catch (error) {
    report(error instanceof TypeError ? "Mất kết nối. Hãy thử lại." : error.message);
  } finally {
    busy = false;
    if (button?.isConnected) button.disabled = false;
  }
}

async function login(name) {
  await locked(document.querySelector("#login .primary"), async () => {
    const data = await api("profile", {}, name);
    state = {...data, name: name.trim().replace(/\s+/g, " ")};
    try { localStorage.setItem("classroom-name", state.name); } catch {}
    view = "home";
    render();
  });
}

async function sync() {
  if (!state.name || busy) return;
  const revision = ++update;
  const name = state.name;
  try {
    const data = await api("profile");
    if (revision !== update || state.name !== name || busy) return;
    if (JSON.stringify(state.profile) === JSON.stringify(data.profile)) return;
    state = {...data, name};
    header();
    if (["home", "shop", "history"].includes(view) && !confirmBox.open) render();
  } catch {}
}

async function begin(id, button) {
  await locked(button, async () => {
    const token = crypto.randomUUID();
    const {questions} = await api("quiz", {id, token});
    const lesson = state.catalog.find(item => item.id === id);
    quiz = {...lesson, token, questions, answers: [], index: 0};
    view = "quiz";
    render();
    document.querySelector("#question").focus();
    window.scrollTo(0, 0);
  });
}

async function submitQuiz() {
  await locked(document.querySelector("#answer-form .primary"), async () => {
    update++;
    const {profile, result} = await api("submit", {id: quiz.id, token: quiz.token, answers: quiz.answers});
    state.profile = profile;
    view = "result";
    header();
    showResult(result);
    window.scrollTo(0, 0);
  });
}

confirmBox.addEventListener("close", () => {
  const prize = redemption;
  if (confirmBox.returnValue !== "yes" || !prize) return;
  const button = document.querySelector('[data-prize="' + prize.id + '"]');
  locked(button, async () => {
    update++;
    const {profile} = await api("redeem", {id: prize.id, token: prize.token});
    state.profile = profile;
    redemption = undefined;
    render();
    report("Đã đổi quà thành công: " + prize.title + ".", true);
  });
});

app.addEventListener("submit", parentSubmit);
app.addEventListener("change", event => {
  if (event.target.id === "parent-role" && !busy) {
    parentRole = event.target.value;
    parentPage();
    document.querySelector("#parent-role").focus();
    return;
  }
  const subject = event.target.dataset.subjectPage;
  if (!subject || busy) return;
  subjectPages.set(subject, Number(event.target.value));
  home();
  [...app.querySelectorAll("[data-subject-page]")].find(select => select.dataset.subjectPage === subject)?.focus();
});

document.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button || busy) return;
  if (button.hasAttribute("data-parent-lock")) {
    parentPassword = "";
    parentPage();
    return;
  }
  if (button.dataset.view || button.hasAttribute("data-logout")) parentPassword = "";
  if (button.hasAttribute("data-logout")) {
    update++;
    state = {name: "", profile: null, catalog: [], rewards: []};
    quiz = undefined;
    redemption = undefined;
    subjectPages.clear();
    parentRole = "dad";
    pendingGift = null;
    try { localStorage.removeItem("classroom-name"); } catch {}
    view = "home";
    render();
    document.querySelector("#username").focus();
  } else if (button.dataset.view) {
    view = state.profile ? button.dataset.view : "home";
    render();
    window.scrollTo(0, 0);
    sync();
  } else if (button.dataset.quiz) {
    begin(button.dataset.quiz, button);
  } else if (button.hasAttribute("data-back") && quiz.index > 0) {
    quiz.index--;
    play();
    document.querySelector("#question").focus();
  } else if (button.dataset.prize) {
    const prize = state.rewards.find(item => item.id === button.dataset.prize);
    if (redemption?.id !== prize.id) redemption = {...prize, token: crypto.randomUUID()};
    document.querySelector("#confirm-text").textContent = prize.title + " · " + prize.cost + " Ronaldo";
    confirmBox.returnValue = "";
    confirmBox.showModal();
  }
});

window.addEventListener("focus", sync);
render();
try {
  const saved = localStorage.getItem("classroom-name");
  if (saved) {
    document.querySelector("#username").value = saved;
    login(saved);
  }
} catch {}
