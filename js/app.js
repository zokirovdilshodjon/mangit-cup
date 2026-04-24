/* ============================================================
   MANG'IT CUP 2026 — Main App Logic
   Features: Bracket, Today, Upcoming, Eng Yaxshilar (Scorers+MVP), Admin
   ============================================================ */

// ── INIT ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  setupNav();
  setupAdmin();
  setupModal();

  showLoadingOverlay(true);

  // Firebase is initialised in index.html <head> before scripts load.
  // TournamentData.load() calls onReady when data first arrives from Firebase.
  TournamentData.load(() => {
    propagateWinners();
    renderAll();
    showLoadingOverlay(false);
    updateConnectionBadge(!!TournamentData._dbRef);
  });

  window.addEventListener("online",  () => updateConnectionBadge(!!TournamentData._dbRef));
  window.addEventListener("offline", () => updateConnectionBadge(false, true));
});

function showLoadingOverlay(show) {
  const el = document.getElementById("loading-overlay");
  if(el) el.style.display = show ? "flex" : "none";
}

function updateConnectionBadge(connected, offline) {
  const badge = document.getElementById("conn-badge");
  if(!badge) return;
  if(offline) {
    badge.textContent = "📵 Offline";
    badge.style.cssText = "background:rgba(231,76,60,0.2);border:1px solid rgba(231,76,60,0.4);color:#e74c3c;padding:2px 10px;border-radius:12px;font-size:0.75rem;font-family:'Rajdhani',sans-serif;font-weight:700;";
  } else if(connected) {
    badge.textContent = "🟢 Real-time";
    badge.style.cssText = "background:rgba(46,204,113,0.15);border:1px solid rgba(46,204,113,0.3);color:#2ecc71;padding:2px 10px;border-radius:12px;font-size:0.75rem;font-family:'Rajdhani',sans-serif;font-weight:700;";
  } else {
    badge.textContent = "🔶 Lokal rejim";
    badge.style.cssText = "background:rgba(245,197,24,0.15);border:1px solid rgba(245,197,24,0.3);color:#f5c518;padding:2px 10px;border-radius:12px;font-size:0.75rem;font-family:'Rajdhani',sans-serif;font-weight:700;";
  }
  badge.style.display = "inline-block";
}

// ── THEME ─────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem("mangitcup_theme") || "dark";
  applyTheme(saved);
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(cur === "dark" ? "light" : "dark");
  });
}
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("mangitcup_theme", theme);
  const btn = document.getElementById("theme-toggle");
  if(btn) btn.textContent = theme === "dark" ? "☀️ Kun" : "🌙 Tun";
}

// ── NAV ───────────────────────────────────────────────────
function setupNav() {
  const pages   = document.querySelectorAll(".page");
  const navBtns = document.querySelectorAll("[data-page]");
  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.page;
      pages.forEach(p => p.classList.toggle("active", p.id === id));
      navBtns.forEach(b => b.classList.toggle("active", b === btn));
      if(id === "bracket-page")  renderBracket();
      if(id === "scorers-page")  renderScorers();
      if(id === "today-page")    renderTodaysMatches();
      if(id === "upcoming-page") renderUpcoming();
    });
  });
  document.querySelector('[data-page="bracket-page"]').click();
}

function renderAll() {
  renderBracket();
  renderScorers();
  renderTodaysMatches();
  renderUpcoming();
}

// ══════════════════════════════════════════════════════════
//  WINNER PROPAGATION
// ══════════════════════════════════════════════════════════
const PROGRESSION = {
  "L-R16-1":{target:"L-R8-1",slot:"team1"}, "L-R16-2":{target:"L-R8-1",slot:"team2"},
  "L-R16-3":{target:"L-R8-2",slot:"team1"}, "L-R16-4":{target:"L-R8-2",slot:"team2"},
  "L-R16-5":{target:"L-R8-3",slot:"team1"}, "L-R16-6":{target:"L-R8-3",slot:"team2"},
  "L-R16-7":{target:"L-R8-4",slot:"team1"}, "L-R16-8":{target:"L-R8-4",slot:"team2"},
  "L-R8-1": {target:"L-QF-1",slot:"team1"}, "L-R8-2": {target:"L-QF-1",slot:"team2"},
  "L-R8-3": {target:"L-QF-2",slot:"team1"}, "L-R8-4": {target:"L-QF-2",slot:"team2"},
  "L-QF-1": {target:"SF-LEFT",slot:"team1"},"L-QF-2": {target:"SF-LEFT",slot:"team2"},
  "SF-LEFT":{target:"FINAL",slot:"team1"},
  "R-R16-1":{target:"R-R8-1",slot:"team1"}, "R-R16-2":{target:"R-R8-1",slot:"team2"},
  "R-R16-3":{target:"R-R8-2",slot:"team1"}, "R-R16-4":{target:"R-R8-2",slot:"team2"},
  "R-R16-5":{target:"R-R8-3",slot:"team1"}, "R-R16-6":{target:"R-R8-3",slot:"team2"},
  "R-R16-7":{target:"R-R8-4",slot:"team1"}, "R-R16-8":{target:"R-R8-4",slot:"team2"},
  "R-R8-1": {target:"R-QF-1",slot:"team1"}, "R-R8-2": {target:"R-QF-1",slot:"team2"},
  "R-R8-3": {target:"R-QF-2",slot:"team1"}, "R-R8-4": {target:"R-QF-2",slot:"team2"},
  "R-QF-1": {target:"SF-RIGHT",slot:"team1"},"R-QF-2":{target:"SF-RIGHT",slot:"team2"},
  "SF-RIGHT":{target:"FINAL",slot:"team2"},
};
function propagateWinners() {
  TournamentData.matches.forEach(m => {
    const w = TournamentData.winner(m);
    const prog = PROGRESSION[m.id];
    if(w && prog){
      const next = TournamentData.getMatch(prog.target);
      if(next) next[prog.slot] = w;
    }
  });
}

// ══════════════════════════════════════════════════════════
//  BRACKET — Responsive SVG with viewBox scaling
// ══════════════════════════════════════════════════════════
const CW=168, CH=66, HGAP=48, VGAP=10, GRP_GAP=28, HDR=36, PAD_TOP=16;

const HALF_MATCHES = {
  left:  {"1/16":["L-R16-1","L-R16-2","L-R16-3","L-R16-4","L-R16-5","L-R16-6","L-R16-7","L-R16-8"],"1/8":["L-R8-1","L-R8-2","L-R8-3","L-R8-4"],"1/4":["L-QF-1","L-QF-2"],"1/2":["SF-LEFT"]},
  right: {"1/16":["R-R16-1","R-R16-2","R-R16-3","R-R16-4","R-R16-5","R-R16-6","R-R16-7","R-R16-8"],"1/8":["R-R8-1","R-R8-2","R-R8-3","R-R8-4"],"1/4":["R-QF-1","R-QF-2"],"1/2":["SF-RIGHT"]},
};

const FEED_PAIRS = [
  ["L-R16-1","L-R16-2","L-R8-1"],["L-R16-3","L-R16-4","L-R8-2"],
  ["L-R16-5","L-R16-6","L-R8-3"],["L-R16-7","L-R16-8","L-R8-4"],
  ["L-R8-1","L-R8-2","L-QF-1"],  ["L-R8-3","L-R8-4","L-QF-2"],
  ["L-QF-1","L-QF-2","SF-LEFT"],
  ["R-R16-1","R-R16-2","R-R8-1"],["R-R16-3","R-R16-4","R-R8-2"],
  ["R-R16-5","R-R16-6","R-R8-3"],["R-R16-7","R-R16-8","R-R8-4"],
  ["R-R8-1","R-R8-2","R-QF-1"],  ["R-R8-3","R-R8-4","R-QF-2"],
  ["R-QF-1","R-QF-2","SF-RIGHT"],
  ["SF-LEFT","SF-RIGHT","FINAL"],
];

function computeY(side) {
  const ids = HALF_MATCHES[side]["1/16"];
  const yMap = new Map();
  ids.forEach((id,i) => {
    const off = i >= 4 ? GRP_GAP : 0;
    yMap.set(id, PAD_TOP + HDR + i*(CH+VGAP) + off + CH/2);
  });
  FEED_PAIRS.forEach(([a,b,t]) => {
    if(yMap.has(a) && yMap.has(b)) yMap.set(t, (yMap.get(a)+yMap.get(b))/2);
  });
  return yMap;
}

function renderBracket() {
  const container = document.getElementById("bracket-container");
  container.innerHTML = "";

  const yL = computeY("left");
  const yR = computeY("right");
  const totalH = PAD_TOP + HDR + 8*(CH+VGAP) + GRP_GAP + 40;

  const colW  = CW + HGAP;
  const xVL16=0, xVL8=colW, xVL4=colW*2, xVLSF=colW*3;
  const xFinal= xVLSF + colW + 16;
  const xVRSF = xFinal + CW + 16;
  const xVR4  = xVRSF + colW;
  const xVR8  = xVR4  + colW;
  const xVR16 = xVR8  + colW;
  const totalW= xVR16 + CW;

  const NS  = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  // KEY: viewBox + preserveAspectRatio so it scales on mobile
  svg.setAttribute("viewBox", `0 0 ${totalW} ${totalH}`);
  svg.setAttribute("width",   "100%");
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.style.cssText = "display:block;max-width:100%;height:auto;";

  // ── Card builder ──────────────────────────────────────
  function addCard(matchId, cx, cy) {
    const m = TournamentData.getMatch(matchId);
    if(!m) return;
    const fo = document.createElementNS(NS, "foreignObject");
    fo.setAttribute("x", cx);
    fo.setAttribute("y", cy - CH/2);
    fo.setAttribute("width",  CW);
    fo.setAttribute("height", CH + (m.date?18:0));
    fo.dataset.matchId = matchId;
    const card = buildMatchCard(m);
    card.style.width = CW+"px";
    fo.appendChild(card);
    svg.appendChild(fo);
  }

  function addHeader(label, cx) {
    const t = document.createElementNS(NS,"text");
    t.setAttribute("x", cx+CW/2); t.setAttribute("y", PAD_TOP+HDR*0.65);
    t.setAttribute("text-anchor","middle"); t.setAttribute("font-family","Rajdhani,sans-serif");
    t.setAttribute("font-size","11"); t.setAttribute("font-weight","700");
    t.setAttribute("letter-spacing","2"); t.setAttribute("fill","#f5c518");
    t.textContent = label; svg.appendChild(t);
    const l = document.createElementNS(NS,"line");
    l.setAttribute("x1",cx); l.setAttribute("x2",cx+CW);
    l.setAttribute("y1",PAD_TOP+HDR-4); l.setAttribute("y2",PAD_TOP+HDR-4);
    l.setAttribute("stroke","rgba(245,197,24,0.25)"); l.setAttribute("stroke-width","1");
    svg.appendChild(l);
  }

  // Headers
  ["1/16","1/8","1/4","SEMI","FINAL","SEMI","1/4","1/8","1/16"]
    .forEach((lbl,i)=>{
      const xs=[xVL16,xVL8,xVL4,xVLSF,xFinal,xVRSF,xVR4,xVR8,xVR16];
      addHeader(lbl,xs[i]);
    });

  // Cards — visual left = right data, visual right = left data
  HALF_MATCHES.right["1/16"].forEach(id=>addCard(id,xVL16,yR.get(id)));
  HALF_MATCHES.right["1/8"] .forEach(id=>addCard(id,xVL8, yR.get(id)));
  HALF_MATCHES.right["1/4"] .forEach(id=>addCard(id,xVL4, yR.get(id)));
  HALF_MATCHES.right["1/2"] .forEach(id=>addCard(id,xVLSF,yR.get(id)));
  HALF_MATCHES.left["1/16"] .forEach(id=>addCard(id,xVR16,yL.get(id)));
  HALF_MATCHES.left["1/8"]  .forEach(id=>addCard(id,xVR8, yL.get(id)));
  HALF_MATCHES.left["1/4"]  .forEach(id=>addCard(id,xVR4, yL.get(id)));
  HALF_MATCHES.left["1/2"]  .forEach(id=>addCard(id,xVRSF,yL.get(id)));

  const yFinal = (yR.get("SF-RIGHT")+yL.get("SF-LEFT"))/2;

  // Trophy
  const trophy = document.createElementNS(NS,"text");
  trophy.setAttribute("x",xFinal+CW/2); trophy.setAttribute("y",yFinal-CH/2-52);
  trophy.setAttribute("text-anchor","middle"); trophy.setAttribute("font-size","32");
  trophy.textContent="🏆"; svg.appendChild(trophy);

  addCard("FINAL",xFinal,yFinal);

  // Connector lines (insert at top = behind cards)
  const lg = document.createElementNS(NS,"g");
  lg.setAttribute("class","connector-lines");
  svg.insertBefore(lg,svg.firstChild);

  function ln(x1,y1,x2,y2,col,w){
    const l=document.createElementNS(NS,"line");
    l.setAttribute("x1",x1);l.setAttribute("y1",y1);
    l.setAttribute("x2",x2);l.setAttribute("y2",y2);
    l.setAttribute("stroke",col);l.setAttribute("stroke-width",w);
    lg.appendChild(l);
  }

  const CN="rgba(80,110,150,0.55)", CF="rgba(245,197,24,0.5)", LW=1.5;

  function drawL(a,b,t,sx,tx,yMap){
    const y1=yMap.get(a),y2=yMap.get(b),yt=yMap.get(t)??yFinal;
    const mx=sx+CW+HGAP/2;
    ln(sx+CW,y1,mx,y1,CN,LW); ln(sx+CW,y2,mx,y2,CN,LW);
    ln(mx,y1,mx,y2,CN,LW);    ln(mx,yt,tx,yt,CN,LW);
  }
  function drawR(a,b,t,sx,tx,yMap){
    const y1=yMap.get(a),y2=yMap.get(b),yt=yMap.get(t)??yFinal;
    const mx=sx-HGAP/2;
    ln(sx,y1,mx,y1,CN,LW);   ln(sx,y2,mx,y2,CN,LW);
    ln(mx,y1,mx,y2,CN,LW);   ln(mx,yt,tx+CW,yt,CN,LW);
  }

  // Visual left (right data)
  drawL("R-R16-1","R-R16-2","R-R8-1",xVL16,xVL8,yR);
  drawL("R-R16-3","R-R16-4","R-R8-2",xVL16,xVL8,yR);
  drawL("R-R16-5","R-R16-6","R-R8-3",xVL16,xVL8,yR);
  drawL("R-R16-7","R-R16-8","R-R8-4",xVL16,xVL8,yR);
  drawL("R-R8-1","R-R8-2","R-QF-1",xVL8,xVL4,yR);
  drawL("R-R8-3","R-R8-4","R-QF-2",xVL8,xVL4,yR);
  drawL("R-QF-1","R-QF-2","SF-RIGHT",xVL4,xVLSF,yR);
  // Visual right (left data)
  drawR("L-R16-1","L-R16-2","L-R8-1",xVR16,xVR8,yL);
  drawR("L-R16-3","L-R16-4","L-R8-2",xVR16,xVR8,yL);
  drawR("L-R16-5","L-R16-6","L-R8-3",xVR16,xVR8,yL);
  drawR("L-R16-7","L-R16-8","L-R8-4",xVR16,xVR8,yL);
  drawR("L-R8-1","L-R8-2","L-QF-1",xVR8,xVR4,yL);
  drawR("L-R8-3","L-R8-4","L-QF-2",xVR8,xVR4,yL);
  drawR("L-QF-1","L-QF-2","SF-LEFT",xVR4,xVRSF,yL);
  // Semi → Final
  const sfRY=yR.get("SF-RIGHT"), sfLY=yL.get("SF-LEFT");
  const mxL=xVLSF+CW+(xFinal-xVLSF-CW)/2, mxR=xVRSF-(xVRSF-xFinal-CW)/2;
  ln(xVLSF+CW,sfRY,mxL,sfRY,CF,2); ln(mxL,sfRY,mxL,yFinal,CF,2); ln(mxL,yFinal,xFinal,yFinal,CF,2);
  ln(xVRSF,sfLY,mxR,sfLY,CF,2);    ln(mxR,sfLY,mxR,yFinal,CF,2); ln(mxR,yFinal,xFinal+CW,yFinal,CF,2);

  container.appendChild(svg);
}

function buildMatchCard(m) {
  const card = document.createElement("div");
  card.className = "match-card";
  card.addEventListener("click", () => openMatchModal(m.id));
  const w = TournamentData.winner(m);
  const isDraw = m.played && m.score1!==null && m.score2!==null && m.score1===m.score2;
  card.appendChild(buildTeamRow(m.team1,m.score1,w===m.team1,m.team2==="-",isDraw&&m.pen1!==null?m.pen1:null));
  card.appendChild(buildTeamRow(m.team2,m.score2,w===m.team2,m.team2==="-",isDraw&&m.pen2!==null?m.pen2:null));
  if(m.date){
    const d=document.createElement("div");
    d.className="match-date"; d.textContent="📅 "+formatDate(m.date);
    card.appendChild(d);
  }
  return card;
}

function buildTeamRow(name,score,isWinner,isBye,pen){
  const row=document.createElement("div");
  row.className="match-team";
  if(isWinner) row.classList.add("winner");
  if(isBye)    row.classList.add("bye");
  if(!name||name==="") row.classList.add("tbd");
  const nm=document.createElement("div"); nm.className="team-name";
  nm.textContent=(name==="-")?"---":(name||"TBD"); row.appendChild(nm);
  const sc=document.createElement("div"); sc.className="team-score";
  let txt=score!==null&&score!==undefined?score:"-";
  if(pen!==null&&pen!==undefined) txt+=` (${pen})`;
  sc.textContent=txt; row.appendChild(sc);
  return row;
}

// ══════════════════════════════════════════════════════════
//  TODAY'S MATCHES
// ══════════════════════════════════════════════════════════
function renderTodaysMatches() {
  const grid = document.getElementById("today-grid");
  if(!grid) return;
  const matches = TournamentData.todaysMatches();
  if(matches.length===0){
    grid.innerHTML=`<div class="today-empty"><span style="font-size:2.5rem;">📭</span><p>Bugun o'yin rejalashtirilmagan.</p></div>`;
    return;
  }
  grid.innerHTML = matches.map(m => {
    const t1=m.team1||"TBD", t2=(m.team2==="-")?"---":(m.team2||"TBD");
    const w=TournamentData.winner(m);
    const timeStr=m.date?formatTime(m.date):"";
    const rlbl=m.round+(m.half!=="center"?" · "+m.half.toUpperCase():"");
    return `<div class="today-card ${m.played?'played':''}" onclick="openMatchModal('${m.id}')">
      <div class="today-card-header">
        <span class="today-round-tag">${rlbl}</span>
        ${m.played?'<span class="today-status-played">✅ O\'ynaldi</span>':'<span class="today-status-upcoming">⏳ Kutilmoqda</span>'}
      </div>
      <div class="today-matchup">
        <span class="today-team ${w===m.team1?'today-winner':''}">${t1}</span>
        <div class="today-center">
          ${m.played?`<span class="today-score">${m.score1}${m.pen1!==null?`<sup>(${m.pen1})</sup>`:""} : ${m.score2}${m.pen2!==null?`<sup>(${m.pen2})</sup>`:""}</span>`:'<span class="today-vs">VS</span>'}
          ${timeStr?`<div class="today-time">🕐 ${timeStr}</div>`:""}
        </div>
        <span class="today-team ${w===m.team2?'today-winner':''}">${t2}</span>
      </div>
      ${w?`<div class="today-winner-badge">🏆 G'olib: ${w}</div>`:""}
    </div>`;
  }).join("");
}

// ══════════════════════════════════════════════════════════
//  MATCH DETAIL MODAL
// ══════════════════════════════════════════════════════════
function setupModal() {
  document.getElementById("modal-overlay").addEventListener("click", e => {
    if(e.target===document.getElementById("modal-overlay")) closeModal();
  });
  document.getElementById("modal-close").addEventListener("click", closeModal);
}

function openMatchModal(matchId) {
  const m = TournamentData.getMatch(matchId);
  if(!m) return;
  document.getElementById("modal-title").textContent=`${m.round} · ${m.half==="center"?"FINAL":m.half.toUpperCase()}`;
  const body=document.getElementById("modal-body");
  const w=TournamentData.winner(m);
  const isDraw=m.played&&m.score1!==null&&m.score2!==null&&m.score1===m.score2;
  const penDisp=isDraw&&m.pen1!==null&&m.pen2!==null
    ?`<div style="text-align:center;margin-bottom:0.5rem;font-family:'Rajdhani',sans-serif;font-size:0.9rem;color:var(--text2);">Penalti: <span style="color:var(--gold);font-weight:700;">${m.pen1} – ${m.pen2}</span></div>`:"";

  let html=`<div style="text-align:center;margin-bottom:0.5rem"><span style="font-family:'Rajdhani',sans-serif;font-size:0.72rem;letter-spacing:2px;color:var(--text2);text-transform:uppercase;">${m.date?"📅 "+formatDate(m.date):"Sana belgilanmagan"}</span></div>
    <div class="match-detail-score">
      <div><div class="detail-team" style="${w===m.team1?'color:var(--winner)':''}">${m.team1||"TBD"}</div><div class="detail-score" style="${w===m.team1?'color:var(--winner)':''}">${m.score1!==null?m.score1:"–"}</div></div>
      <div class="detail-dash">:</div>
      <div><div class="detail-team" style="${w===m.team2?'color:var(--winner)':''}">${(m.team2==="-")?"---":(m.team2||"TBD")}</div><div class="detail-score" style="${w===m.team2?'color:var(--winner)':''}">${m.score2!==null?m.score2:"–"}</div></div>
    </div>${penDisp}`;

  if(w) html+=`<div style="text-align:center;margin-bottom:1rem;"><span style="background:rgba(0,200,83,0.12);border:1px solid rgba(0,200,83,0.25);color:var(--green);font-family:'Rajdhani',sans-serif;font-weight:700;letter-spacing:1.5px;font-size:0.78rem;text-transform:uppercase;padding:3px 10px;border-radius:4px;">🏆 G'olib: ${w}</span></div>`;
  if(!m.played) html+=`<div style="text-align:center;margin-top:0.5rem;color:var(--text2);font-family:'Rajdhani',sans-serif;font-size:0.9rem;">Bu o'yin hali o'ynalmagan.</div>`;

  if(m.scorers&&m.scorers.length>0){
    html+=`<div class="scorers-list"><h4>⚽ Gollar</h4>`;
    m.scorers.forEach(s=>{html+=`<div class="scorer-entry"><span class="scorer-minute">${s.minute}'</span><span class="scorer-name">${s.player}</span><span class="scorer-team">${s.team}</span></div>`;});
    html+=`</div>`;
  }
  if(m.bestPlayer&&m.bestPlayer.name){
    const bp=m.bestPlayer;
    html+=`<div class="modal-mvp-box"><div class="modal-mvp-label">⭐ Eng yaxshi o'yinchi</div><div class="modal-mvp-name">${bp.name}</div><div class="modal-mvp-meta">${bp.team} &nbsp;|&nbsp; Reyting: <strong style="color:var(--gold);">${bp.rating}</strong></div></div>`;
  }

  body.innerHTML=html;
  document.getElementById("modal-overlay").classList.add("open");
}
function closeModal(){ document.getElementById("modal-overlay").classList.remove("open"); }

// ══════════════════════════════════════════════════════════
//  ENG YAXSHILAR — Scorers + MVP combined
// ══════════════════════════════════════════════════════════
function renderScorers() {
  // ── Scorers tab ──────────────────────────────────────
  const scorers = TournamentData.topScorers();
  const tbody = document.getElementById("scorers-tbody");
  if(scorers.length===0){
    tbody.innerHTML=`<tr><td colspan="4" style="text-align:center;color:var(--text3);padding:2rem;">Hali gollar kiritilmagan.</td></tr>`;
  } else {
    const max=scorers[0].goals;
    tbody.innerHTML=scorers.map((s,i)=>{
      const rc=i===0?"rank-1":i===1?"rank-2":i===2?"rank-3":"rank-n";
      const pct=Math.round((s.goals/max)*100);
      return `<tr><td><span class="rank-badge ${rc}">${i+1}</span></td><td>${s.player}</td><td style="color:var(--text2)">${s.team}</td><td><div class="goals-bar-wrap"><div class="goals-bar" style="width:${pct}px;max-width:120px;"></div><span class="goals-num">${s.goals}</span></div></td></tr>`;
    }).join("");
  }

  // ── MVP tab ───────────────────────────────────────────
  const mvps = TournamentData.mvpList();
  const mvpTbody = document.getElementById("mvp-tbody");
  if(!mvpTbody) return;
  if(mvps.length===0){
    mvpTbody.innerHTML=`<tr><td colspan="5" style="text-align:center;color:var(--text3);padding:2rem;">Hali eng yaxshi o'yinchi kiritilmagan.</td></tr>`;
    return;
  }
  const maxR=mvps[0].rating;
  mvpTbody.innerHTML=mvps.map((v,i)=>{
    const rc=i===0?"rank-1":i===1?"rank-2":i===2?"rank-3":"rank-n";
    const stars=ratingToStars(v.rating);
    return `<tr>
      <td><span class="rank-badge ${rc}">${i+1}</span></td>
      <td><strong>${v.name}</strong></td>
      <td style="color:var(--text2)">${v.team}</td>
      <td><span class="rating-stars">${stars}</span> <span style="color:var(--gold);font-family:'Bebas Neue',sans-serif;font-size:1.1rem;">${v.rating}</span></td>
      <td style="color:var(--text3);font-size:0.8rem;">${v.round}</td>
    </tr>`;
  }).join("");
}

function ratingToStars(r){
  const n=Math.round(r);
  if(n>=10) return "⭐⭐⭐⭐⭐";
  if(n>=8)  return "⭐⭐⭐⭐";
  if(n>=6)  return "⭐⭐⭐";
  if(n>=4)  return "⭐⭐";
  return "⭐";
}

// Scorers page tab switching
function setupScorersTabs(){
  document.querySelectorAll(".scorers-tab-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll(".scorers-tab-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      const tab=btn.dataset.tab;
      document.getElementById("scorers-panel").style.display=tab==="scorers"?"block":"none";
      document.getElementById("mvp-panel").style.display=tab==="mvp"?"block":"none";
    });
  });
}

// ══════════════════════════════════════════════════════════
//  UPCOMING MATCHES
// ══════════════════════════════════════════════════════════
function renderUpcoming() {
  const grid=document.getElementById("upcoming-grid");
  const list=TournamentData.matches.filter(m=>!m.played&&m.team1&&m.team2&&m.team2!=="-"&&m.team1!=="");
  if(list.length===0){
    grid.innerHTML=`<div style="color:var(--text3);font-family:'Rajdhani',sans-serif;padding:1rem;">Kutilayotgan o'yinlar mavjud emas.</div>`;
    return;
  }
  grid.innerHTML=list.map(m=>`
    <div class="upcoming-card" onclick="openMatchModal('${m.id}')">
      <div class="upcoming-round-tag">${m.round} · ${m.half.toUpperCase()}</div>
      <div class="upcoming-teams"><span>${m.team1||"TBD"}</span><span class="upcoming-vs">VS</span><span>${(m.team2==="-")?"---":(m.team2||"TBD")}</span></div>
      <div class="upcoming-date">📅 ${m.date?formatDate(m.date):"Sana belgilanmagan"}</div>
      <span class="not-played-tag">O'ynalmagan</span>
    </div>`).join("");
}

// ══════════════════════════════════════════════════════════
//  ADMIN PANEL
// ══════════════════════════════════════════════════════════
let adminCurrentRound = "1/16";

function setupAdmin() {
  document.getElementById("login-form").addEventListener("submit", e => {
    e.preventDefault();
    const user=document.getElementById("admin-user").value.trim();
    const pass=document.getElementById("admin-pass").value;
    if(user===TournamentData.admin.user&&pass===TournamentData.admin.pass){
      document.getElementById("login-box").style.display="none";
      document.getElementById("admin-inner").classList.add("visible");
      renderAdminMatches();
    } else {
      document.getElementById("login-error").textContent="Login yoki parol noto'g'ri!";
      document.getElementById("login-error").style.display="block";
    }
  });

  document.getElementById("admin-logout").addEventListener("click",()=>{
    document.getElementById("login-box").style.display="block";
    document.getElementById("admin-inner").classList.remove("visible");
    document.getElementById("admin-user").value="";
    document.getElementById("admin-pass").value="";
    document.getElementById("login-error").style.display="none";
  });

  document.getElementById("admin-btn").addEventListener("click",()=>{
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
    document.querySelectorAll("[data-page]").forEach(b=>b.classList.remove("active"));
    document.getElementById("admin-page").classList.add("active");
  });

  document.querySelectorAll(".admin-tab").forEach(tab=>{
    tab.addEventListener("click",()=>{
      document.querySelectorAll(".admin-tab").forEach(t=>t.classList.remove("active"));
      tab.classList.add("active");
      adminCurrentRound=tab.dataset.round;
      renderAdminMatches();
    });
  });

  // Schedule tab in admin
  document.querySelectorAll(".admin-main-tab").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll(".admin-main-tab").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      const tab=btn.dataset.atab;
      document.getElementById("admin-results-section").style.display=tab==="results"?"block":"none";
      document.getElementById("admin-schedule-section").style.display=tab==="schedule"?"block":"none";
      if(tab==="schedule") renderScheduleSection();
    });
  });

  setupScorersTabs();
}

function renderAdminMatches() {
  const list=document.getElementById("admin-match-list");
  const matches=TournamentData.matches.filter(m=>m.round===adminCurrentRound);
  list.innerHTML="";

  matches.forEach(m=>{
    if(m.team2==="-") return;
    const t1=m.team1||"TBD", t2=(m.team2==="-")?"---":(m.team2||"TBD");
    const date=m.date||"", sc1=m.score1!==null?m.score1:"", sc2=m.score2!==null?m.score2:"";
    const pen1=m.pen1!==null?m.pen1:"", pen2=m.pen2!==null?m.pen2:"";
    const bp=m.bestPlayer||{name:"",team:"",rating:""};

    // Build scorer rows without innerHTML to avoid wiping existing values
    const row=document.createElement("div");
    row.className="admin-match-row"; row.id="admin-row-"+m.id;

    row.innerHTML=`
      <h4><span class="status-dot ${m.played?'dot-green':'dot-gray'}"></span>&nbsp;${t1} vs ${t2}&nbsp;<span style="color:var(--text3);font-size:0.65rem;">[${m.id}]</span></h4>
      <div class="form-group" style="margin-bottom:0.75rem;">
        <label>📅 Sana & Vaqt</label>
        <input class="admin-input" type="datetime-local" id="date-${m.id}" value="${date}" style="max-width:240px;">
      </div>
      <div class="admin-score-row">
        <span class="admin-team-label">${t1}</span>
        <input class="admin-input score-input" type="number" min="0" id="s1-${m.id}" value="${sc1}" placeholder="0">
        <span style="color:var(--text3);font-family:'Bebas Neue',sans-serif;font-size:1.1rem;">:</span>
        <input class="admin-input score-input" type="number" min="0" id="s2-${m.id}" value="${sc2}" placeholder="0">
        <span class="admin-team-label">${t2}</span>
      </div>
      <div class="penalty-section">
        <div class="pen-label">🥅 Penalti <span style="font-size:0.7rem;color:var(--text3);font-weight:400;">(durrang bo'lsa)</span></div>
        <div class="admin-score-row" style="margin-bottom:0;">
          <span class="admin-team-label">${t1}</span>
          <input class="admin-input score-input" type="number" min="0" id="p1-${m.id}" value="${pen1}" placeholder="–" style="border-color:rgba(245,197,24,0.3);">
          <span style="color:var(--text3);font-family:'Bebas Neue',sans-serif;font-size:1.1rem;">:</span>
          <input class="admin-input score-input" type="number" min="0" id="p2-${m.id}" value="${pen2}" placeholder="–" style="border-color:rgba(245,197,24,0.3);">
          <span class="admin-team-label">${t2}</span>
        </div>
      </div>

      <!-- SCORERS — rendered as separate DOM nodes (no innerHTML re-render) -->
      <div class="scorers-admin">
        <div style="font-family:'Rajdhani',sans-serif;font-size:0.72rem;letter-spacing:1.5px;color:var(--text2);text-transform:uppercase;margin-bottom:0.5rem;">⚽ Gol urganlar</div>
        <div id="scorer-list-${m.id}"></div>
        <button class="btn btn-ghost btn-sm" style="margin-top:0.5rem;" onclick="addScorer('${m.id}','${t1}','${t2}')">+ Gol qo'shish</button>
      </div>

      <!-- BEST PLAYER -->
      <div class="best-player-section">
        <div class="best-player-label">⭐ Eng yaxshi o'yinchi</div>
        <div class="best-player-row">
          <input class="admin-input" placeholder="Ism Familiya" id="bp-name-${m.id}" value="${bp.name||''}" style="flex:2;">
          <select class="admin-input" id="bp-team-${m.id}" style="flex:1;">
            <option value="${t1}" ${(bp.team||"")===(t1)?'selected':''}>${t1}</option>
            <option value="${t2}" ${(bp.team||"")===(t2)?'selected':''}>${t2}</option>
          </select>
          <input class="admin-input" placeholder="Ball (1-10)" type="number" min="1" max="10" step="0.5" id="bp-rating-${m.id}" value="${bp.rating||''}" style="width:90px;">
        </div>
      </div>

      <div style="margin-top:0.85rem;display:flex;gap:0.5rem;flex-wrap:wrap;">
        <button class="btn btn-green" style="flex:1;" onclick="saveMatch('${m.id}','${t1}','${t2}')">💾 Saqlash</button>
        ${m.played?`<button class="btn btn-red btn-sm" onclick="resetMatch('${m.id}')">Bekor</button>`:""}
      </div>
      <div id="msg-${m.id}" style="margin-top:0.5rem;font-size:0.82rem;display:none;"></div>`;

    list.appendChild(row);

    // Render scorer rows as DOM nodes (preserves typing)
    renderScorerRows(m.id, t1, t2, m.scorers||[]);
  });

  if(list.innerHTML===""){
    list.innerHTML=`<div style="color:var(--text3);font-family:'Rajdhani',sans-serif;padding:1rem;">Bu raundda o'yinlar mavjud emas.</div>`;
  }

  updateAdminStats();
}

// Render scorer rows as real DOM nodes — prevents value loss on re-render
function renderScorerRows(matchId, t1, t2, scorers){
  const container=document.getElementById("scorer-list-"+matchId);
  if(!container) return;
  container.innerHTML="";
  scorers.forEach((s,i)=>{
    const wrap=document.createElement("div");
    wrap.className="scorer-admin-row"; wrap.id=`scorer-${matchId}-${i}`;

    const nameInp=document.createElement("input");
    nameInp.className="admin-input"; nameInp.placeholder="Ism"; nameInp.value=s.player||"";
    nameInp.id=`sp-${matchId}-${i}`; nameInp.style.cssText="flex:1;min-width:100px;max-width:140px;";

    const teamSel=document.createElement("select");
    teamSel.className="admin-input"; teamSel.id=`st-${matchId}-${i}`; teamSel.style.cssText="max-width:100px;";
    [t1,t2].forEach(t=>{
      const opt=document.createElement("option"); opt.value=t; opt.textContent=t;
      if((s.team||t1)===t) opt.selected=true;
      teamSel.appendChild(opt);
    });

    const minInp=document.createElement("input");
    minInp.className="admin-input"; minInp.type="number"; minInp.min="1"; minInp.max="120";
    minInp.placeholder="Daqiqa"; minInp.value=s.minute||""; minInp.id=`sm-${matchId}-${i}`;
    minInp.style.cssText="max-width:70px;";

    const delBtn=document.createElement("button");
    delBtn.className="btn btn-red btn-sm"; delBtn.textContent="✕";
    delBtn.onclick=()=>removeScorer(matchId,i);

    wrap.appendChild(nameInp); wrap.appendChild(teamSel); wrap.appendChild(minInp); wrap.appendChild(delBtn);
    container.appendChild(wrap);
  });
}

// ── SCHEDULE ADMIN SECTION ────────────────────────────────
function renderScheduleSection(){
  const wrap=document.getElementById("schedule-match-list");
  if(!wrap) return;
  const all=TournamentData.matches.filter(m=>m.team1&&m.team2&&m.team2!=="-"&&m.team1!=="");
  wrap.innerHTML="";
  all.forEach(m=>{
    const t1=m.team1,t2=m.team2;
    const row=document.createElement("div");
    row.className="admin-match-row";
    row.style.cssText="padding:0.9rem 1.2rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap;";
    row.innerHTML=`
      <div style="flex:1;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.95rem;min-width:140px;">
        <span class="status-dot ${m.played?'dot-green':'dot-gray'}" style="margin-right:6px;"></span>
        ${t1} <span style="color:var(--text3);">vs</span> ${t2}
        <span style="color:var(--text3);font-size:0.7rem;margin-left:6px;">${m.round}</span>
      </div>
      <input class="admin-input" type="datetime-local" id="sched-${m.id}" value="${m.date||''}" style="max-width:210px;flex:0 0 auto;">
      <button class="btn btn-green btn-sm" onclick="saveSchedule('${m.id}')">💾 Saqlash</button>
      <span id="sched-msg-${m.id}" style="font-size:0.8rem;color:var(--green);display:none;">✓ Saqlandi</span>`;
    wrap.appendChild(row);
  });
}

function saveSchedule(matchId){
  const m=TournamentData.getMatch(matchId); if(!m) return;
  const val=document.getElementById("sched-"+matchId)?.value;
  m.date=val||"";
  TournamentData.save();
  renderAll();
  const msg=document.getElementById("sched-msg-"+matchId);
  if(msg){msg.style.display="inline";setTimeout(()=>msg.style.display="none",2000);}
}

function updateAdminStats(){
  const played  =TournamentData.matches.filter(m=>m.played).length;
  const pending =TournamentData.matches.filter(m=>!m.played&&m.team2!=="-").length;
  const goals   =TournamentData.topScorers().reduce((a,s)=>a+s.goals,0);
  const teams   =new Set(TournamentData.matches.flatMap(m=>[m.team1,m.team2]).filter(t=>t&&t!=="-"&&t!==""&&t!=="TBD")).size;
  const el=document.getElementById("admin-stats");
  if(el) el.innerHTML=[["✅ O'ynaldi",played,"var(--green)"],["⏳ Kutilmoqda",pending,"var(--gold)"],["⚽ Gollar",goals,"var(--text)"],["🏟️ Jamoalar",teams,"var(--text2)"]].map(([l,v,c])=>`<div style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:1rem;"><div style="font-family:'Bebas Neue',sans-serif;font-size:2rem;color:${c};">${v}</div><div style="font-family:'Rajdhani',sans-serif;font-size:0.72rem;letter-spacing:1.5px;text-transform:uppercase;color:var(--text2);">${l}</div></div>`).join("");
}

function addScorer(matchId,t1,t2){
  const m=TournamentData.getMatch(matchId); if(!m) return;
  m.scorers.push({player:"",team:t1,minute:""});
  TournamentData.save();
  // Only re-render scorer rows, NOT the whole admin list
  renderScorerRows(matchId,t1,t2,m.scorers);
}

function removeScorer(matchId,idx){
  const m=TournamentData.getMatch(matchId); if(!m) return;
  // Collect current input values before splicing
  m.scorers.forEach((_,i)=>{
    const p=document.getElementById(`sp-${matchId}-${i}`)?.value?.trim();
    const t=document.getElementById(`st-${matchId}-${i}`)?.value;
    const min=document.getElementById(`sm-${matchId}-${i}`)?.value;
    if(p!==undefined) m.scorers[i]={player:p,team:t||"",minute:min||""};
  });
  m.scorers.splice(idx,1);
  TournamentData.save();
  const t1=m.team1||"TBD",t2=m.team2||"TBD";
  renderScorerRows(matchId,t1,t2,m.scorers);
}

function saveMatch(matchId,t1,t2){
  const m=TournamentData.getMatch(matchId); if(!m) return;
  const s1r=document.getElementById(`s1-${matchId}`).value;
  const s2r=document.getElementById(`s2-${matchId}`).value;
  const dateVal=document.getElementById(`date-${matchId}`).value;
  const p1r=document.getElementById(`p1-${matchId}`)?.value;
  const p2r=document.getElementById(`p2-${matchId}`)?.value;
  const bpName=document.getElementById(`bp-name-${matchId}`)?.value?.trim()||"";
  const bpTeam=document.getElementById(`bp-team-${matchId}`)?.value||t1;
  const bpRating=document.getElementById(`bp-rating-${matchId}`)?.value||"";

  if(s1r===""||s2r===""){showMsg(matchId,"Iltimos, hisob kiriting.","error");return;}
  const s1=parseInt(s1r),s2=parseInt(s2r);
  if(isNaN(s1)||isNaN(s2)||s1<0||s2<0){showMsg(matchId,"Hisob noto'g'ri.","error");return;}

  let pen1=null,pen2=null;
  if(s1===s2){
    if(p1r!==""&&p2r!==""){
      const pv1=parseInt(p1r),pv2=parseInt(p2r);
      if(!isNaN(pv1)&&!isNaN(pv2)){
        if(pv1===pv2){showMsg(matchId,"Penalti ham durrang bo'lishi mumkin emas!","error");return;}
        pen1=pv1; pen2=pv2;
      }
    }
  }

  // Collect scorer inputs
  const scorers=[];
  m.scorers.forEach((_,i)=>{
    const p=document.getElementById(`sp-${matchId}-${i}`)?.value?.trim();
    const t=document.getElementById(`st-${matchId}-${i}`)?.value;
    const min=document.getElementById(`sm-${matchId}-${i}`)?.value;
    if(p) scorers.push({player:p,team:t||t1,minute:min?parseInt(min):"?"});
  });

  m.score1=s1; m.score2=s2; m.pen1=pen1; m.pen2=pen2;
  m.date=dateVal; m.scorers=scorers; m.played=true;
  m.bestPlayer=bpName?{name:bpName,team:bpTeam,rating:parseFloat(bpRating)||0}:null;

  propagateWinners();
  TournamentData.save();
  renderAll();
  renderAdminMatches();
  const winner=TournamentData.winner(m);
  showMsg(matchId,`✅ Saqlandi! ${winner?"G'olib: "+winner:(s1===s2&&pen1===null?"Durrang — penaltini kiriting!":"")}`,winner?"success":"error");
}

function resetMatch(matchId){
  const m=TournamentData.getMatch(matchId); if(!m) return;
  m.score1=null;m.score2=null;m.pen1=null;m.pen2=null;m.played=false;m.scorers=[];m.bestPlayer=null;
  const prog=PROGRESSION[matchId];
  if(prog){const next=TournamentData.getMatch(prog.target);if(next)next[prog.slot]="";}
  propagateWinners();
  TournamentData.save();
  renderAll();
  renderAdminMatches();
}

function showMsg(matchId,text,type){
  const el=document.getElementById("msg-"+matchId); if(!el) return;
  el.textContent=text; el.className=`alert alert-${type}`; el.style.display="block";
  setTimeout(()=>el.style.display="none",5000);
}

// ── UTILS ─────────────────────────────────────────────────
function formatDate(dt){
  if(!dt) return "";
  try{return new Date(dt).toLocaleDateString("uz-UZ",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});}catch{return dt;}
}
function formatTime(dt){
  if(!dt) return "";
  try{return new Date(dt).toLocaleTimeString("uz-UZ",{hour:"2-digit",minute:"2-digit"});}catch{return "";}
}
