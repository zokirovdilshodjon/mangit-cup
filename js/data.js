// ============================================================
// MANG'IT CUP 2026 — Data Store with Firebase RTDB
// URL: https://mangit-cup-e553f-default-rtdb.firebaseio.com
// ============================================================

const TournamentData = {
  name: "MANG'IT CUP",
  season: "2026",
  _db: null,
  _dbRef: null,

  _defaultMatches: [
    { id:"R-R16-1", round:"1/16", half:"right", group:"top",    date:"", team1:"2009",   team2:"-",      score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-R16-2", round:"1/16", half:"right", group:"top",    date:"", team1:"1996",   team2:"1994",   score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-R16-3", round:"1/16", half:"right", group:"top",    date:"", team1:"2005",   team2:"-",      score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-R16-4", round:"1/16", half:"right", group:"top",    date:"", team1:"1995",   team2:"FAXR 1", score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-R16-5", round:"1/16", half:"right", group:"bottom", date:"", team1:"2000",   team2:"1997",   score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-R16-6", round:"1/16", half:"right", group:"bottom", date:"", team1:"FA 2",   team2:"-",      score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-R16-7", round:"1/16", half:"right", group:"bottom", date:"", team1:"1993",   team2:"1992",   score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-R16-8", round:"1/16", half:"right", group:"bottom", date:"", team1:"2010",   team2:"-",      score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-R8-1",  round:"1/8",  half:"right", group:"top",    date:"", team1:"2009",   team2:"",       score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-R8-2",  round:"1/8",  half:"right", group:"top",    date:"", team1:"2005",   team2:"",       score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-R8-3",  round:"1/8",  half:"right", group:"bottom", date:"", team1:"",       team2:"FA 2",   score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-R8-4",  round:"1/8",  half:"right", group:"bottom", date:"", team1:"",       team2:"2010",   score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-QF-1",  round:"1/4",  half:"right", group:"top",    date:"", team1:"",       team2:"",       score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-QF-2",  round:"1/4",  half:"right", group:"bottom", date:"", team1:"",       team2:"",       score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"SF-RIGHT",round:"1/2",  half:"right", group:"",       date:"", team1:"",       team2:"",       score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"FINAL",   round:"Final",half:"center", group:"",      date:"", team1:"",       team2:"",       score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-R16-1", round:"1/16", half:"left",  group:"top",    date:"", team1:"XOMIY",  team2:"-",      score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-R16-2", round:"1/16", half:"left",  group:"top",    date:"", team1:"1990",   team2:"2002",   score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-R16-3", round:"1/16", half:"left",  group:"top",    date:"", team1:"2007",   team2:"-",      score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-R16-4", round:"1/16", half:"left",  group:"top",    date:"", team1:"1998",   team2:"2006",   score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-R16-5", round:"1/16", half:"left",  group:"bottom", date:"", team1:"2003",   team2:"1991",   score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-R16-6", round:"1/16", half:"left",  group:"bottom", date:"", team1:"99&04",   team2:"-",      score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-R16-7", round:"1/16", half:"left",  group:"bottom", date:"", team1:"2001",   team2:"2008",   score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-R16-8", round:"1/16", half:"left",  group:"bottom", date:"", team1:"Ustozlar",   team2:"-",      score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-R8-1",  round:"1/8",  half:"left",  group:"top",    date:"", team1:"XOMIY",  team2:"",       score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-R8-2",  round:"1/8",  half:"left",  group:"top",    date:"", team1:"2007",   team2:"",       score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-R8-3",  round:"1/8",  half:"left",  group:"bottom", date:"", team1:"",       team2:"99&04",   score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-R8-4",  round:"1/8",  half:"left",  group:"bottom", date:"", team1:"",       team2:"Ustozlar",   score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-QF-1",  round:"1/4",  half:"left",  group:"top",    date:"", team1:"",       team2:"",       score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-QF-2",  round:"1/4",  half:"left",  group:"bottom", date:"", team1:"",       team2:"",       score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"SF-LEFT", round:"1/2",  half:"left",  group:"",       date:"", team1:"",       team2:"",       score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
  ],

  matches: [],
  admin: { user:"admin", pass:"mangitcup2026" },

  initFirebase() {
    try {
      if (firebase.apps.length === 0) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      this._db = firebase.database();
      // matches/ ni to'g'ridan-to'g'ri ishlatamiz — array muammosini hal qiladi
      this._dbRef = this._db.ref("mangitcup2026/matches");
      console.log("✅ Firebase ready");
      return true;
    } catch(e) {
      console.error("❌ Firebase init:", e.message);
      return false;
    }
  },

  load(onReady) {
    let done = false;
    const timer = setTimeout(() => {
      if (!done) { done = true; console.warn("⏱ Timeout"); this._loadLocal(onReady); }
    }, 7000);

    if (!this._dbRef) {
      clearTimeout(timer);
      this._loadLocal(onReady);
      return;
    }

    this._dbRef.on("value", snap => {
      const raw = snap.val();
      console.log("Firebase snapshot:", raw ? "ma'lumot bor" : "bo'sh");

      let matches = [];
      if (raw) {
        if (Array.isArray(raw)) {
          matches = raw.filter(Boolean);
        } else if (typeof raw === "object") {
          matches = Object.values(raw).filter(Boolean);
        }
      }

      if (matches.length > 0) {
        // ✅ Ma'lumot bor — faqat o'qib olamiz, HECH NARSA YOZMAYMIZ
        this.matches = this._migrate(matches);
        console.log("✅ Firebase dan", this.matches.length, "ta o'yin yuklandi");
        localStorage.setItem("mangitcup_cache", JSON.stringify(this.matches));

        if (!done) {
          done = true;
          if (onReady) onReady();
        } else {
          // Real-time yangilanish — faqat render qilamiz
          if (window.propagateWinners) propagateWinners();
          if (window.renderAll) renderAll();
        }
      } else {
        // Bo'sh — FAQAT birinchi marta default yozamiz
        if (!done) {
          done = true;
          console.log("🌱 Bo'sh DB — default yozilmoqda");
          this.matches = this._cloneDefaults();
          const obj = {};
          this.matches.forEach((m, i) => { obj[i] = m; });
          // set() qilgandan keyin listener qayta ishga tushadi
          // va yuqoridagi matches.length > 0 ga tushadi
          this._dbRef.set(obj).catch(e => console.error("Seed error:", e));
          // onReady ni chaqirmaymiz — set() tugagach listener o'zi chaqiradi
        }
        // Agar done bo'lsa va bo'sh kelsa — IGNORE qilamiz (ezib yubormayiz!)
      }
    }, err => {
      clearTimeout(timer);
      console.error("❌ Firebase read:", err.message);
      if (!done) { done = true; this._loadLocal(onReady); }
    });
  },

  save() {
    localStorage.setItem("mangitcup_cache", JSON.stringify(this.matches));

    if (!this._dbRef) return;

    // Object sifatida saqla — Firebase array ni buzmasin
    const obj = {};
    this.matches.forEach((m, i) => { obj[i] = m; });

    this._dbRef.set(obj)
      .then(() => {
        console.log("✅ Firebase ga saqlandi");
        this._flash("✅ Saqlandi", "#2ecc71");
      })
      .catch(e => {
        console.error("❌ Save failed:", e.code, e.message);
        this._flash("❌ " + e.message, "#e74c3c");
      });
  },

  _flash(msg, color) {
    const b = document.getElementById("conn-badge");
    if (!b) return;
    const old = { text: b.textContent, color: b.style.color };
    b.textContent = msg; b.style.color = color;
    setTimeout(() => { b.textContent = old.text; b.style.color = old.color; }, 3000);
  },

  _loadLocal(onReady) {
    const c = localStorage.getItem("mangitcup_cache") || localStorage.getItem("mangitcup2026");
    this.matches = c ? this._migrate(JSON.parse(c)) : this._cloneDefaults();
    console.log("💾 Local:", this.matches.length, "ta o'yin");
    if (onReady) onReady();
  },
  _cloneDefaults() { return JSON.parse(JSON.stringify(this._defaultMatches)); },
  _migrate(arr) {
    return arr.map(m => ({
      ...m,
      pen1: m.pen1 ?? null,
      pen2: m.pen2 ?? null,
      bestPlayer: m.bestPlayer ?? null,
      scorers: m.scorers || [],
    }));
  },

  getMatch(id) { return this.matches.find(m => m.id === id); },

  winner(m) {
    if (!m.played || m.score1 === null || m.score2 === null) return null;
    if (m.team2 === "-") return m.team1;
    if (m.score1 > m.score2) return m.team1;
    if (m.score2 > m.score1) return m.team2;
    if (m.pen1 !== null && m.pen2 !== null) {
      if (m.pen1 > m.pen2) return m.team1;
      if (m.pen2 > m.pen1) return m.team2;
    }
    return null;
  },

  topScorers() {
    const map = {};
    this.matches.forEach(m => (m.scorers || []).forEach(s => {
      if (!map[s.player]) map[s.player] = { player:s.player, team:s.team, goals:0 };
      map[s.player].goals++;
    }));
    return Object.values(map).sort((a,b) => b.goals - a.goals);
  },

  mvpList() {
    return this.matches
      .filter(m => m.bestPlayer && m.bestPlayer.name)
      .map(m => ({ name:m.bestPlayer.name, team:m.bestPlayer.team||"", rating:parseFloat(m.bestPlayer.rating)||0, round:m.round }))
      .sort((a,b) => b.rating - a.rating);
  },

  todaysMatches() {
    const t = new Date().toISOString().slice(0,10);
    return this.matches.filter(m => m.date && m.team1 && m.team2 && m.team2 !== "-" && m.date.slice(0,10) === t);
  },

  scheduledMatches() {
    return this.matches
      .filter(m => m.date && m.team1 && m.team2 && m.team2 !== "-")
      .sort((a,b) => new Date(a.date) - new Date(b.date));
  },
};
