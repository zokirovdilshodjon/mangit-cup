/* ============================================================
   MANG'IT CUP 2026 — Main App Logic
   ============================================================ */

// ── INIT ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  TournamentData.load();
  initTheme();
  propagateWinners();
  renderAll();
  setupNav();
  setupAdmin();
  setupModal();
  renderTodaysMatches();
});

// ── THEME (Day / Night) ───────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem("mangitcup_theme") || "dark";
  applyTheme(saved);
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("mangitcup_theme", theme);
  const btn = document.getElementById("theme-toggle");
  if (btn) btn.textContent = theme === "dark" ? "☀️ Kun" : "🌙 Tun";
}

// ── NAVIGATION ────────────────────────────────────────────
function setupNav() {
  const pages = document.querySelectorAll(".page");
  const navBtns = document.querySelectorAll("[data-page]");

  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.page;
      pages.forEach(p => p.classList.toggle("active", p.id === id));
      navBtns.forEach(b => b.classList.toggle("active", b === btn));
      if (id === "bracket-page")  renderBracket();
      if (id === "scorers-page")  renderScorers();
      if (id === "upcoming-page") renderUpcoming();
      if (id === "today-page")    renderTodaysMatches();
    });
  });

  document.querySelector('[data-page="bracket-page"]').click();
}

// ── RENDER ALL ────────────────────────────────────────────
function renderAll() {
  renderBracket();
  renderScorers();
  renderUpcoming();
  renderTodaysMatches();
}

// ══════════════════════════════════════════════════════════
//  WINNER PROPAGATION
// ══════════════════════════════════════════════════════════
const PROGRESSION = {
  // LEFT half
  "L-R16-1": { target:"L-R8-1", slot:"team1" },
  "L-R16-2": { target:"L-R8-1", slot:"team2" },
  "L-R16-3": { target:"L-R8-2", slot:"team1" },
  "L-R16-4": { target:"L-R8-2", slot:"team2" },
  "L-R16-5": { target:"L-R8-3", slot:"team1" },
  "L-R16-6": { target:"L-R8-3", slot:"team2" },
  "L-R16-7": { target:"L-R8-4", slot:"team1" },
  "L-R16-8": { target:"L-R8-4", slot:"team2" },
  "L-R8-1":  { target:"L-QF-1", slot:"team1" },
  "L-R8-2":  { target:"L-QF-1", slot:"team2" },
  "L-R8-3":  { target:"L-QF-2", slot:"team1" },
  "L-R8-4":  { target:"L-QF-2", slot:"team2" },
  "L-QF-1":  { target:"SF-LEFT", slot:"team1" },
  "L-QF-2":  { target:"SF-LEFT", slot:"team2" },
  "SF-LEFT": { target:"FINAL",   slot:"team1" },
  // RIGHT half
  "R-R16-1": { target:"R-R8-1", slot:"team1" },
  "R-R16-2": { target:"R-R8-1", slot:"team2" },
  "R-R16-3": { target:"R-R8-2", slot:"team1" },
  "R-R16-4": { target:"R-R8-2", slot:"team2" },
  "R-R16-5": { target:"R-R8-3", slot:"team1" },
  "R-R16-6": { target:"R-R8-3", slot:"team2" },
  "R-R16-7": { target:"R-R8-4", slot:"team1" },
  "R-R16-8": { target:"R-R8-4", slot:"team2" },
  "R-R8-1":  { target:"R-QF-1", slot:"team1" },
  "R-R8-2":  { target:"R-QF-1", slot:"team2" },
  "R-R8-3":  { target:"R-QF-2", slot:"team1" },
  "R-R8-4":  { target:"R-QF-2", slot:"team2" },
  "R-QF-1":  { target:"SF-RIGHT", slot:"team1" },
  "R-QF-2":  { target:"SF-RIGHT", slot:"team2" },
  "SF-RIGHT":{ target:"FINAL",    slot:"team2" },
};

function propagateWinners() {
  TournamentData.matches.forEach(m => {
    const w = TournamentData.winner(m);
    const prog = PROGRESSION[m.id];
    if (w && prog) {
      const next = TournamentData.getMatch(prog.target);
      if (next) next[prog.slot] = w;
    }
  });
}

// ══════════════════════════════════════════════════════════
//  BRACKET — SVG canvas approach
//  SWAPPED: Right half is now on the LEFT visually,
//           Left half is now on the RIGHT visually.
// ══════════════════════════════════════════════════════════

const CW      = 168;
const CH      = 66;
const HGAP    = 48;
const VGAP    = 10;
const GRP_GAP = 28;
const HDR     = 36;
const PAD_TOP = 16;

const HALF_MATCHES = {
  left: {
    "1/16": ["L-R16-1","L-R16-2","L-R16-3","L-R16-4","L-R16-5","L-R16-6","L-R16-7","L-R16-8"],
    "1/8":  ["L-R8-1","L-R8-2","L-R8-3","L-R8-4"],
    "1/4":  ["L-QF-1","L-QF-2"],
    "1/2":  ["SF-LEFT"],
  },
  right: {
    "1/16": ["R-R16-1","R-R16-2","R-R16-3","R-R16-4","R-R16-5","R-R16-6","R-R16-7","R-R16-8"],
    "1/8":  ["R-R8-1","R-R8-2","R-R8-3","R-R8-4"],
    "1/4":  ["R-QF-1","R-QF-2"],
    "1/2":  ["SF-RIGHT"],
  },
};

const FEED_PAIRS = [
  ["L-R16-1","L-R16-2","L-R8-1"],
  ["L-R16-3","L-R16-4","L-R8-2"],
  ["L-R16-5","L-R16-6","L-R8-3"],
  ["L-R16-7","L-R16-8","L-R8-4"],
  ["L-R8-1","L-R8-2","L-QF-1"],
  ["L-R8-3","L-R8-4","L-QF-2"],
  ["L-QF-1","L-QF-2","SF-LEFT"],
  ["R-R16-1","R-R16-2","R-R8-1"],
  ["R-R16-3","R-R16-4","R-R8-2"],
  ["R-R16-5","R-R16-6","R-R8-3"],
  ["R-R16-7","R-R16-8","R-R8-4"],
  ["R-R8-1","R-R8-2","R-QF-1"],
  ["R-R8-3","R-R8-4","R-QF-2"],
  ["R-QF-1","R-QF-2","SF-RIGHT"],
  ["SF-LEFT","SF-RIGHT","FINAL"],
];

function computeYPositions(side) {
  const ids16 = HALF_MATCHES[side]["1/16"];
  const yMap  = new Map();
  ids16.forEach((id, i) => {
    const groupOffset = i >= 4 ? GRP_GAP : 0;
    const cy = PAD_TOP + HDR + i * (CH + VGAP) + groupOffset + CH / 2;
    yMap.set(id, cy);
  });
  FEED_PAIRS.forEach(([a, b, t]) => {
    if (yMap.has(a) && yMap.has(b)) {
      yMap.set(t, (yMap.get(a) + yMap.get(b)) / 2);
    }
  });
  return yMap;
}

function renderBracket() {
  const container = document.getElementById("bracket-container");
  container.innerHTML = "";

  const yL = computeYPositions("left");
  const yR = computeYPositions("right");

  const totalH = PAD_TOP + HDR + 8 * (CH + VGAP) + GRP_GAP + 40;

  // ── SWAPPED LAYOUT ────────────────────────────────────
  // Visual left side now shows RIGHT half data (mirror)
  // Visual right side now shows LEFT half data
  const colW   = CW + HGAP;
  // Visual Left side (right half data, mirrored): 1/16 | 1/8 | 1/4 | SEMI
  const xVL16  = 0;
  const xVL8   = xVL16 + colW;
  const xVL4   = xVL8  + colW;
  const xVLSF  = xVL4  + colW;
  // Final center
  const xFinal = xVLSF + colW + 16;
  // Visual Right side (left half data): SEMI | 1/4 | 1/8 | 1/16
  const xVRSF  = xFinal + CW + 16;
  const xVR4   = xVRSF + colW;
  const xVR8   = xVR4  + colW;
  const xVR16  = xVR8  + colW;
  const totalW = xVR16 + CW;

  const NS  = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${totalW} ${totalH}`);
  svg.setAttribute("width",  totalW);
  svg.setAttribute("height", totalH);
  svg.style.cssText = "display:block;overflow:visible;";

  function addCard(matchId, cx, cy) {
    const m = TournamentData.getMatch(matchId);
    if (!m) return;
    const fo = document.createElementNS(NS, "foreignObject");
    fo.setAttribute("x", cx);
    fo.setAttribute("y", cy - CH / 2);
    fo.setAttribute("width",  CW);
    fo.setAttribute("height", CH + (m.date ? 18 : 0));
    fo.dataset.matchId = matchId;
    const card = buildMatchCard(m);
    card.style.width = CW + "px";
    fo.appendChild(card);
    svg.appendChild(fo);
  }

  function addHeader(label, cx) {
    const txt = document.createElementNS(NS, "text");
    txt.setAttribute("x", cx + CW / 2);
    txt.setAttribute("y", PAD_TOP + HDR * 0.65);
    txt.setAttribute("text-anchor", "middle");
    txt.setAttribute("font-family", "Rajdhani, sans-serif");
    txt.setAttribute("font-size",   "11");
    txt.setAttribute("font-weight", "700");
    txt.setAttribute("letter-spacing", "2");
    txt.setAttribute("fill", "#f5c518");
    txt.textContent = label;
    svg.appendChild(txt);
    const line = document.createElementNS(NS, "line");
    line.setAttribute("x1", cx); line.setAttribute("x2", cx + CW);
    line.setAttribute("y1", PAD_TOP + HDR - 4); line.setAttribute("y2", PAD_TOP + HDR - 4);
    line.setAttribute("stroke", "rgba(245,197,24,0.25)"); line.setAttribute("stroke-width", "1");
    svg.appendChild(line);
  }

  // Draw headers — left visual side shows right data (mirrored), right shows left
  addHeader("1/16", xVL16);
  addHeader("1/8",  xVL8);
  addHeader("1/4",  xVL4);
  addHeader("SEMI", xVLSF);
  addHeader("FINAL",xFinal);
  addHeader("SEMI", xVRSF);
  addHeader("1/4",  xVR4);
  addHeader("1/8",  xVR8);
  addHeader("1/16", xVR16);

  // Visual LEFT = RIGHT half data (mirrored layout: 1/16 outward)
  HALF_MATCHES.right["1/16"].forEach(id => addCard(id, xVL16, yR.get(id)));
  HALF_MATCHES.right["1/8"] .forEach(id => addCard(id, xVL8,  yR.get(id)));
  HALF_MATCHES.right["1/4"] .forEach(id => addCard(id, xVL4,  yR.get(id)));
  HALF_MATCHES.right["1/2"] .forEach(id => addCard(id, xVLSF, yR.get(id)));

  // Visual RIGHT = LEFT half data
  HALF_MATCHES.left["1/16"].forEach(id => addCard(id, xVR16, yL.get(id)));
  HALF_MATCHES.left["1/8"] .forEach(id => addCard(id, xVR8,  yL.get(id)));
  HALF_MATCHES.left["1/4"] .forEach(id => addCard(id, xVR4,  yL.get(id)));
  HALF_MATCHES.left["1/2"] .forEach(id => addCard(id, xVRSF, yL.get(id)));

  const yFinal = (yR.get("SF-RIGHT") + yL.get("SF-LEFT")) / 2;

  // Trophy
  const trophyY = yFinal - CH / 2 - 52;
  const trophyTxt = document.createElementNS(NS, "text");
  trophyTxt.setAttribute("x", xFinal + CW / 2);
  trophyTxt.setAttribute("y", trophyY);
  trophyTxt.setAttribute("text-anchor", "middle");
  trophyTxt.setAttribute("font-size", "32");
  trophyTxt.textContent = "🏆";
  svg.appendChild(trophyTxt);

  addCard("FINAL", xFinal, yFinal);

  // Connector lines group (behind cards)
  const lineGroup = document.createElementNS(NS, "g");
  lineGroup.setAttribute("class","connector-lines");
  svg.insertBefore(lineGroup, svg.firstChild);

  function line(x1,y1,x2,y2, color, w) {
    const l = document.createElementNS(NS,"line");
    l.setAttribute("x1",x1); l.setAttribute("y1",y1);
    l.setAttribute("x2",x2); l.setAttribute("y2",y2);
    l.setAttribute("stroke", color);
    l.setAttribute("stroke-width", w);
    lineGroup.appendChild(l);
  }

  const C_NORM  = "rgba(80,110,150,0.55)";
  const C_FINAL = "rgba(245,197,24,0.5)";
  const LW = 1.5;

  // Visual LEFT connectors (right half data, reading left→right, 1/16 at xVL16)
  function drawVisualLeftPair(id1, id2, tid, srcX, tgtX, yMap) {
    const y1  = yMap.get(id1);
    const y2  = yMap.get(id2);
    const yt  = yMap.get(tid) ?? yFinal;
    const mx  = srcX + CW + HGAP / 2;
    line(srcX+CW, y1, mx, y1, C_NORM, LW);
    line(srcX+CW, y2, mx, y2, C_NORM, LW);
    line(mx, y1, mx, y2, C_NORM, LW);
    line(mx, yt, tgtX, yt, C_NORM, LW);
  }

  // Visual RIGHT connectors (left half data, reading right→left, 1/16 at xVR16)
  function drawVisualRightPair(id1, id2, tid, srcX, tgtX, yMap) {
    const y1  = yMap.get(id1);
    const y2  = yMap.get(id2);
    const yt  = yMap.get(tid) ?? yFinal;
    const mx  = srcX - HGAP / 2;
    line(srcX,    y1, mx, y1, C_NORM, LW);
    line(srcX,    y2, mx, y2, C_NORM, LW);
    line(mx, y1, mx, y2, C_NORM, LW);
    line(mx, yt, tgtX+CW, yt, C_NORM, LW);
  }

  // Visual Left (RIGHT half data)
  drawVisualLeftPair("R-R16-1","R-R16-2","R-R8-1", xVL16, xVL8, yR);
  drawVisualLeftPair("R-R16-3","R-R16-4","R-R8-2", xVL16, xVL8, yR);
  drawVisualLeftPair("R-R16-5","R-R16-6","R-R8-3", xVL16, xVL8, yR);
  drawVisualLeftPair("R-R16-7","R-R16-8","R-R8-4", xVL16, xVL8, yR);
  drawVisualLeftPair("R-R8-1","R-R8-2","R-QF-1",   xVL8,  xVL4, yR);
  drawVisualLeftPair("R-R8-3","R-R8-4","R-QF-2",   xVL8,  xVL4, yR);
  drawVisualLeftPair("R-QF-1","R-QF-2","SF-RIGHT", xVL4,  xVLSF, yR);

  // Visual Right (LEFT half data)
  drawVisualRightPair("L-R16-1","L-R16-2","L-R8-1", xVR16, xVR8, yL);
  drawVisualRightPair("L-R16-3","L-R16-4","L-R8-2", xVR16, xVR8, yL);
  drawVisualRightPair("L-R16-5","L-R16-6","L-R8-3", xVR16, xVR8, yL);
  drawVisualRightPair("L-R16-7","L-R16-8","L-R8-4", xVR16, xVR8, yL);
  drawVisualRightPair("L-R8-1","L-R8-2","L-QF-1",   xVR8,  xVR4, yL);
  drawVisualRightPair("L-R8-3","L-R8-4","L-QF-2",   xVR8,  xVR4, yL);
  drawVisualRightPair("L-QF-1","L-QF-2","SF-LEFT",  xVR4,  xVRSF, yL);

  // Semi → Final connectors (gold)
  const sfRightY = yR.get("SF-RIGHT");
  const sfLeftY  = yL.get("SF-LEFT");
  const mxL  = xVLSF + CW + (xFinal - xVLSF - CW) / 2;
  const mxR  = xVRSF - (xVRSF - xFinal - CW) / 2;

  line(xVLSF+CW, sfRightY, mxL, sfRightY, C_FINAL, 2);
  line(mxL, sfRightY, mxL, yFinal, C_FINAL, 2);
  line(mxL, yFinal, xFinal, yFinal, C_FINAL, 2);

  line(xVRSF, sfLeftY, mxR, sfLeftY, C_FINAL, 2);
  line(mxR, sfLeftY, mxR, yFinal, C_FINAL, 2);
  line(mxR, yFinal, xFinal+CW, yFinal, C_FINAL, 2);

  container.appendChild(svg);
}

function buildMatchCard(m) {
  const card = document.createElement("div");
  card.className = "match-card";
  card.addEventListener("click", () => openMatchModal(m.id));

  const w = TournamentData.winner(m);
  const isDraw = m.played && m.score1 !== null && m.score2 !== null && m.score1 === m.score2;

  card.appendChild(buildTeamRow(m.team1, m.score1, w === m.team1, m.team2 === "-", isDraw && m.pen1 !== null ? m.pen1 : null, "pen"));
  card.appendChild(buildTeamRow(m.team2, m.score2, w === m.team2, m.team2 === "-", isDraw && m.pen2 !== null ? m.pen2 : null, "pen"));

  if (m.date) {
    const d = document.createElement("div");
    d.className = "match-date";
    d.textContent = "📅 " + formatDate(m.date);
    card.appendChild(d);
  }

  return card;
}

function buildTeamRow(teamName, score, isWinner, isBye, penScore, _type) {
  const row = document.createElement("div");
  row.className = "match-team";
  if (isWinner) row.classList.add("winner");
  if (isBye)    row.classList.add("bye");
  if (!teamName || teamName === "") row.classList.add("tbd");

  const name = document.createElement("div");
  name.className = "team-name";
  // Replace "-" (bye) with "---"
  name.textContent = (teamName === "-") ? "---" : (teamName || "TBD");
  row.appendChild(name);

  const sc = document.createElement("div");
  sc.className = "team-score";
  let scoreText = score !== null && score !== undefined ? score : "-";
  if (penScore !== null && penScore !== undefined) {
    scoreText += ` (${penScore})`;
  }
  sc.textContent = scoreText;
  row.appendChild(sc);

  return row;
}

// ══════════════════════════════════════════════════════════
//  TODAY'S MATCHES
// ══════════════════════════════════════════════════════════
function renderTodaysMatches() {
  const grid = document.getElementById("today-grid");
  if (!grid) return;
  const matches = TournamentData.todaysMatches();

  if (matches.length === 0) {
    grid.innerHTML = `<div class="today-empty">
      <span style="font-size:2.5rem;">📭</span>
      <p>Bugun o'yin rejalashtirilmagan.</p>
    </div>`;
    return;
  }

  grid.innerHTML = matches.map(m => {
    const timeStr = m.date ? formatTime(m.date) : "";
    const t1 = m.team1 || "TBD";
    const t2 = (m.team2 === "-") ? "---" : (m.team2 || "TBD");
    const w  = TournamentData.winner(m);
    const roundLabel = m.round + (m.half !== "center" ? " · " + m.half.toUpperCase() : "");
    return `
    <div class="today-card ${m.played ? 'played' : ''}" onclick="openMatchModal('${m.id}')">
      <div class="today-card-header">
        <span class="today-round-tag">${roundLabel}</span>
        ${m.played ? '<span class="today-status-played">✅ O\'ynaldi</span>' : '<span class="today-status-upcoming">⏳ Kutilmoqda</span>'}
      </div>
      <div class="today-matchup">
        <span class="today-team ${w === m.team1 ? 'today-winner' : ''}">${t1}</span>
        <div class="today-center">
          ${m.played
            ? `<span class="today-score">${m.score1}${m.pen1 !== null ? `<sup>(${m.pen1})</sup>` : ""} : ${m.score2}${m.pen2 !== null ? `<sup>(${m.pen2})</sup>` : ""}</span>`
            : `<span class="today-vs">VS</span>`
          }
          ${timeStr ? `<div class="today-time">🕐 ${timeStr}</div>` : ""}
        </div>
        <span class="today-team ${w === m.team2 ? 'today-winner' : ''}">${t2}</span>
      </div>
      ${w ? `<div class="today-winner-badge">🏆 G'olib: ${w}</div>` : ""}
    </div>`;
  }).join("");
}

// ══════════════════════════════════════════════════════════
//  MATCH DETAIL MODAL
// ══════════════════════════════════════════════════════════
function setupModal() {
  document.getElementById("modal-overlay").addEventListener("click", e => {
    if (e.target === document.getElementById("modal-overlay")) closeModal();
  });
  document.getElementById("modal-close").addEventListener("click", closeModal);
}

function openMatchModal(matchId) {
  const m = TournamentData.getMatch(matchId);
  if (!m) return;

  document.getElementById("modal-title").textContent =
    `${m.round} · ${m.half === "center" ? "FINAL" : m.half.toUpperCase()}`;

  const body = document.getElementById("modal-body");
  const w = TournamentData.winner(m);
  const isDraw = m.played && m.score1 !== null && m.score2 !== null && m.score1 === m.score2;

  const penaltyDisplay = isDraw && m.pen1 !== null && m.pen2 !== null
    ? `<div style="text-align:center;margin-top:-0.5rem;margin-bottom:0.5rem;font-family:'Rajdhani',sans-serif;font-size:0.9rem;color:var(--text2);">
        Penalti: <span style="color:var(--gold);font-weight:700;">${m.pen1} – ${m.pen2}</span>
       </div>`
    : "";

  let html = `
    <div style="text-align:center;margin-bottom:0.5rem">
      <span style="font-family:'Rajdhani',sans-serif;font-size:0.72rem;letter-spacing:2px;color:var(--text2);text-transform:uppercase;">
        ${m.date ? "📅 " + formatDate(m.date) : "Sana belgilanmagan"}
      </span>
    </div>
    <div class="match-detail-score">
      <div>
        <div class="detail-team" style="${w===m.team1?'color:var(--winner)':''}">${m.team1||"TBD"}</div>
        <div class="detail-score" style="${w===m.team1?'color:var(--winner)':''}">${m.score1 !== null ? m.score1 : "–"}</div>
      </div>
      <div class="detail-dash">:</div>
      <div>
        <div class="detail-team" style="${w===m.team2?'color:var(--winner)':''}">${(m.team2==="-")?"---":(m.team2||"TBD")}</div>
        <div class="detail-score" style="${w===m.team2?'color:var(--winner)':''}">${m.score2 !== null ? m.score2 : "–"}</div>
      </div>
    </div>
    ${penaltyDisplay}`;

  if (w) {
    html += `<div style="text-align:center;margin-bottom:1rem;">
      <span style="background:rgba(0,200,83,0.12);border:1px solid rgba(0,200,83,0.25);color:var(--green);
        font-family:'Rajdhani',sans-serif;font-weight:700;letter-spacing:1.5px;font-size:0.78rem;
        text-transform:uppercase;padding:3px 10px;border-radius:4px;">
        🏆 G'olib: ${w}
      </span>
    </div>`;
  }

  if (!m.played) {
    html += `<div style="text-align:center;margin-top:0.5rem;color:var(--text2);font-family:'Rajdhani',sans-serif;font-size:0.9rem;">
      Bu o'yin hali o'ynalmagan.
    </div>`;
  }

  if (m.scorers && m.scorers.length > 0) {
    html += `<div class="scorers-list"><h4>⚽ Gollar</h4>`;
    m.scorers.forEach(s => {
      html += `<div class="scorer-entry">
        <span class="scorer-minute">${s.minute}'</span>
        <span class="scorer-name">${s.player}</span>
        <span class="scorer-team">${s.team}</span>
      </div>`;
    });
    html += `</div>`;
  }

  body.innerHTML = html;
  document.getElementById("modal-overlay").classList.add("open");
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("open");
}

// ══════════════════════════════════════════════════════════
//  TOP SCORERS
// ══════════════════════════════════════════════════════════
function renderScorers() {
  const scorers = TournamentData.topScorers();
  const tbody = document.getElementById("scorers-tbody");

  if (scorers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text3);padding:2rem;">
      Hali gollar kiritilmagan.</td></tr>`;
    return;
  }

  const max = scorers[0].goals;
  tbody.innerHTML = scorers.map((s, i) => {
    const rankClass = i === 0 ? "rank-1" : i === 1 ? "rank-2" : i === 2 ? "rank-3" : "rank-n";
    const pct = Math.round((s.goals / max) * 100);
    return `<tr>
      <td><span class="rank-badge ${rankClass}">${i+1}</span></td>
      <td>${s.player}</td>
      <td style="color:var(--text2)">${s.team}</td>
      <td>
        <div class="goals-bar-wrap">
          <div class="goals-bar" style="width:${pct}px;max-width:120px;"></div>
          <span class="goals-num">${s.goals}</span>
        </div>
      </td>
    </tr>`;
  }).join("");
}

// ══════════════════════════════════════════════════════════
//  UPCOMING MATCHES
// ══════════════════════════════════════════════════════════
function renderUpcoming() {
  const grid = document.getElementById("upcoming-grid");
  const upcoming = TournamentData.matches.filter(m =>
    !m.played && m.team1 && m.team2 && m.team2 !== "-" && m.team1 !== ""
  );

  if (upcoming.length === 0) {
    grid.innerHTML = `<div style="color:var(--text3);font-family:'Rajdhani',sans-serif;padding:1rem;">
      Kutilayotgan o'yinlar mavjud emas.</div>`;
    return;
  }

  grid.innerHTML = upcoming.map(m => `
    <div class="upcoming-card" onclick="openMatchModal('${m.id}')">
      <div class="upcoming-round-tag">${m.round} · ${m.half.toUpperCase()}</div>
      <div class="upcoming-teams">
        <span>${m.team1 || "TBD"}</span>
        <span class="upcoming-vs">VS</span>
        <span>${(m.team2==="-") ? "---" : (m.team2 || "TBD")}</span>
      </div>
      <div class="upcoming-date">
        📅 ${m.date ? formatDate(m.date) : "Sana belgilanmagan"}
      </div>
      <span class="not-played-tag">O'ynalmagan</span>
    </div>
  `).join("");
}

// ══════════════════════════════════════════════════════════
//  ADMIN PANEL
// ══════════════════════════════════════════════════════════
let adminLoggedIn = false;
let adminCurrentRound = "1/16";

function setupAdmin() {
  document.getElementById("login-form").addEventListener("submit", e => {
    e.preventDefault();
    const user = document.getElementById("admin-user").value.trim();
    const pass = document.getElementById("admin-pass").value;
    if (user === TournamentData.admin.user && pass === TournamentData.admin.pass) {
      adminLoggedIn = true;
      document.getElementById("login-box").style.display = "none";
      document.getElementById("admin-inner").classList.add("visible");
      renderAdminMatches();
    } else {
      document.getElementById("login-error").textContent = "Login yoki parol noto'g'ri!";
      document.getElementById("login-error").style.display = "block";
    }
  });

  document.getElementById("admin-logout").addEventListener("click", () => {
    adminLoggedIn = false;
    document.getElementById("login-box").style.display = "block";
    document.getElementById("admin-inner").classList.remove("visible");
    document.getElementById("admin-user").value = "";
    document.getElementById("admin-pass").value = "";
    document.getElementById("login-error").style.display = "none";
  });

  document.getElementById("admin-btn").addEventListener("click", () => {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.querySelectorAll("[data-page]").forEach(b => b.classList.remove("active"));
    document.getElementById("admin-page").classList.add("active");
  });

  document.querySelectorAll(".admin-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".admin-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      adminCurrentRound = tab.dataset.round;
      renderAdminMatches();
    });
  });
}

function renderAdminMatches() {
  const list = document.getElementById("admin-match-list");
  const matches = TournamentData.matches.filter(m => m.round === adminCurrentRound);

  list.innerHTML = "";

  matches.forEach(m => {
    if (m.team2 === "-") return; // skip bye matches

    const row = document.createElement("div");
    row.className = "admin-match-row";
    row.id = "admin-row-" + m.id;

    const t1 = m.team1 || "TBD";
    const t2 = (m.team2 === "-") ? "---" : (m.team2 || "TBD");
    const date = m.date || "";
    const sc1 = m.score1 !== null ? m.score1 : "";
    const sc2 = m.score2 !== null ? m.score2 : "";
    const pen1 = m.pen1 !== null ? m.pen1 : "";
    const pen2 = m.pen2 !== null ? m.pen2 : "";
    const isDrawPlayed = m.played && m.score1 !== null && m.score2 !== null && m.score1 === m.score2;

    const scorersHtml = (m.scorers || []).map((s, i) => `
      <div class="scorer-admin-row" id="scorer-${m.id}-${i}">
        <input class="admin-input" placeholder="Ismlar" value="${s.player}" id="sp-${m.id}-${i}" style="max-width:140px;">
        <select class="admin-input" id="st-${m.id}-${i}" style="max-width:100px;">
          <option value="${t1}" ${s.team===t1?'selected':''}>${t1}</option>
          <option value="${t2}" ${s.team===t2?'selected':''}>${t2}</option>
        </select>
        <input class="admin-input" placeholder="Daqiqa" type="number" min="1" max="120"
          value="${s.minute}" id="sm-${m.id}-${i}" style="max-width:70px;">
        <button class="btn btn-red btn-sm" onclick="removeScorer('${m.id}',${i})">✕</button>
      </div>`).join("");

    row.innerHTML = `
      <h4>
        <span class="status-dot ${m.played ? 'dot-green' : 'dot-gray'}"></span>
        &nbsp;${t1} vs ${t2}
        &nbsp;<span style="color:var(--text3);font-size:0.65rem;">[${m.id}]</span>
      </h4>

      <!-- Date -->
      <div class="form-group" style="margin-bottom:0.75rem;">
        <label>📅 Sana & Vaqt</label>
        <input class="admin-input" type="datetime-local" id="date-${m.id}" value="${date}" style="max-width:240px;">
      </div>

      <!-- Score -->
      <div class="admin-score-row">
        <span class="admin-team-label">${t1}</span>
        <input class="admin-input score-input" type="number" min="0" id="s1-${m.id}" value="${sc1}" placeholder="0">
        <span style="color:var(--text3);font-family:'Bebas Neue',sans-serif;font-size:1.1rem;">:</span>
        <input class="admin-input score-input" type="number" min="0" id="s2-${m.id}" value="${sc2}" placeholder="0">
        <span class="admin-team-label">${t2}</span>
      </div>

      <!-- Penalty (shown when draw or always editable) -->
      <div class="penalty-section" id="pen-section-${m.id}">
        <div class="pen-label">
          🥅 Penalti natijalari
          <span style="font-size:0.7rem;color:var(--text3);font-weight:400;">(Agar o'yin durrang tugasa)</span>
        </div>
        <div class="admin-score-row" style="margin-bottom:0;">
          <span class="admin-team-label">${t1}</span>
          <input class="admin-input score-input" type="number" min="0" id="p1-${m.id}" value="${pen1}" placeholder="–" style="border-color:rgba(245,197,24,0.3);">
          <span style="color:var(--text3);font-family:'Bebas Neue',sans-serif;font-size:1.1rem;">:</span>
          <input class="admin-input score-input" type="number" min="0" id="p2-${m.id}" value="${pen2}" placeholder="–" style="border-color:rgba(245,197,24,0.3);">
          <span class="admin-team-label">${t2}</span>
        </div>
      </div>

      <!-- Scorers -->
      <div class="scorers-admin" id="scorers-admin-${m.id}">
        <div style="font-family:'Rajdhani',sans-serif;font-size:0.72rem;letter-spacing:1.5px;color:var(--text2);text-transform:uppercase;margin-bottom:0.4rem;">
          ⚽ Gol urganlar
        </div>
        <div id="scorer-list-${m.id}">${scorersHtml}</div>
        <button class="btn btn-ghost btn-sm" style="margin-top:0.4rem;" onclick="addScorer('${m.id}','${t1}','${t2}')">
          + Gol qo'shish
        </button>
      </div>

      <!-- Save -->
      <div style="margin-top:0.85rem;display:flex;gap:0.5rem;flex-wrap:wrap;">
        <button class="btn btn-green" style="flex:1;" onclick="saveMatch('${m.id}','${t1}','${t2}')">
          💾 Saqlash
        </button>
        ${m.played ? `<button class="btn btn-red btn-sm" onclick="resetMatch('${m.id}')">Bekor</button>` : ""}
      </div>
      <div id="msg-${m.id}" style="margin-top:0.5rem;font-size:0.82rem;display:none;"></div>
    `;

    list.appendChild(row);
  });

  if (list.innerHTML === "") {
    list.innerHTML = `<div style="color:var(--text3);font-family:'Rajdhani',sans-serif;padding:1rem;">
      Bu raundda o'yinlar mavjud emas yoki hali belgilanmagan.</div>`;
  }

  // Update stats
  const played  = TournamentData.matches.filter(m => m.played).length;
  const pending = TournamentData.matches.filter(m => !m.played && m.team2 !== "-").length;
  const goals   = TournamentData.topScorers().reduce((a,s) => a + s.goals, 0);
  const teams   = new Set(TournamentData.matches.flatMap(m => [m.team1, m.team2])
                    .filter(t => t && t !== "-" && t !== "" && t !== "TBD")).size;

  const statsEl = document.getElementById("admin-stats");
  if (statsEl) {
    statsEl.innerHTML = [
      ["✅ O'ynaldi",    played,  "var(--green)"],
      ["⏳ Kutilmoqda", pending, "var(--gold)"],
      ["⚽ Gollar",     goals,   "var(--text)"],
      ["🏟️ Jamoalar",  teams,   "var(--text2)"],
    ].map(([label, val, col]) => `
      <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:1rem;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:2rem;color:${col};">${val}</div>
        <div style="font-family:'Rajdhani',sans-serif;font-size:0.72rem;letter-spacing:1.5px;
          text-transform:uppercase;color:var(--text2);">${label}</div>
      </div>`).join("");
  }
}

function addScorer(matchId, t1, t2) {
  const m = TournamentData.getMatch(matchId);
  if (!m) return;
  m.scorers.push({ player:"", team:t1, minute:"" });
  TournamentData.save();
  renderAdminMatches();
}

function removeScorer(matchId, idx) {
  const m = TournamentData.getMatch(matchId);
  if (!m) return;
  m.scorers.splice(idx, 1);
  TournamentData.save();
  renderAdminMatches();
}

function saveMatch(matchId, t1, t2) {
  const m = TournamentData.getMatch(matchId);
  if (!m) return;

  const s1raw = document.getElementById(`s1-${matchId}`).value;
  const s2raw = document.getElementById(`s2-${matchId}`).value;
  const dateVal = document.getElementById(`date-${matchId}`).value;
  const p1raw = document.getElementById(`p1-${matchId}`)?.value;
  const p2raw = document.getElementById(`p2-${matchId}`)?.value;

  if (s1raw === "" || s2raw === "") {
    showMsg(matchId, "Iltimos, ikkala jamoa uchun ham hisob kiriting.", "error");
    return;
  }

  const s1 = parseInt(s1raw);
  const s2 = parseInt(s2raw);
  if (isNaN(s1) || isNaN(s2) || s1 < 0 || s2 < 0) {
    showMsg(matchId, "Hisob noto'g'ri formatda.", "error");
    return;
  }

  // Penalty shootout
  let pen1 = null, pen2 = null;
  if (s1 === s2) {
    // Draw — check if penalty scores entered
    if (p1raw !== "" && p2raw !== "") {
      const pv1 = parseInt(p1raw);
      const pv2 = parseInt(p2raw);
      if (!isNaN(pv1) && !isNaN(pv2)) {
        pen1 = pv1;
        pen2 = pv2;
        if (pv1 === pv2) {
          showMsg(matchId, "Penalti ham durrang bo'lishi mumkin emas!", "error");
          return;
        }
      }
    }
  }

  // Collect scorers
  const scorers = [];
  m.scorers.forEach((_, i) => {
    const p = document.getElementById(`sp-${matchId}-${i}`)?.value?.trim();
    const t = document.getElementById(`st-${matchId}-${i}`)?.value;
    const min = document.getElementById(`sm-${matchId}-${i}`)?.value;
    if (p) scorers.push({ player:p, team:t||t1, minute: min ? parseInt(min) : "?" });
  });

  m.score1 = s1;
  m.score2 = s2;
  m.pen1 = pen1;
  m.pen2 = pen2;
  m.date = dateVal;
  m.scorers = scorers;
  m.played = true;

  propagateWinners();
  TournamentData.save();
  renderAll();
  renderAdminMatches();

  const winner = TournamentData.winner(m);
  const winMsg = winner
    ? `G'olib: ${winner}`
    : (s1 === s2 && pen1 === null ? "Durrang — penaltini kiriting!" : "");
  showMsg(matchId, `✅ Saqlandi! ${winMsg}`, winner ? "success" : "error");
}

function resetMatch(matchId) {
  const m = TournamentData.getMatch(matchId);
  if (!m) return;
  m.score1 = null; m.score2 = null;
  m.pen1 = null; m.pen2 = null;
  m.played = false; m.scorers = [];

  const prog = PROGRESSION[matchId];
  if (prog) {
    const next = TournamentData.getMatch(prog.target);
    if (next) next[prog.slot] = "";
    propagateWinners();
  }
  TournamentData.save();
  renderAll();
  renderAdminMatches();
}

function showMsg(matchId, text, type) {
  const el = document.getElementById(`msg-${matchId}`);
  if (!el) return;
  el.textContent = text;
  el.className = `alert alert-${type}`;
  el.style.display = "block";
  setTimeout(() => { el.style.display = "none"; }, 5000);
}

// ── UTILS ─────────────────────────────────────────────────
function formatDate(dt) {
  if (!dt) return "";
  try {
    const d = new Date(dt);
    return d.toLocaleDateString("uz-UZ", {
      day:"2-digit", month:"2-digit", year:"numeric",
      hour:"2-digit", minute:"2-digit"
    });
  } catch { return dt; }
}

function formatTime(dt) {
  if (!dt) return "";
  try {
    const d = new Date(dt);
    return d.toLocaleTimeString("uz-UZ", { hour:"2-digit", minute:"2-digit" });
  } catch { return ""; }
}
