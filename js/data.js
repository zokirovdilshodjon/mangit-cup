// ============================================================
// MANG'IT CUP 2026 — Data Store
// Backend: Firebase Realtime Database
// Debug mode: console da xatolarni ko'rsatadi
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

  // ── Firebase init ──────────────────────────────────────
  initFirebase() {
    try {
      if (firebase.apps.length === 0) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      this._db    = firebase.database();
      this._dbRef = this._db.ref(DB_PATH);
      console.log("✅ Firebase initialized. DB path:", DB_PATH);

      // Test write permission immediately
      this._dbRef.child("_ping").set(Date.now())
        .then(() => console.log("✅ Firebase WRITE permission: OK"))
        .catch(e  => console.error("❌ Firebase WRITE permission DENIED:", e.message,
          "\n👉 Firebase Console > Realtime Database > Rules ga o'ting va quyidagini qo'ying:\n" +
          '{\n  "rules": {\n    ".read": true,\n    ".write": true\n  }\n}'));

      return true;
    } catch(e) {
      console.error("❌ Firebase init failed:", e.message);
      return false;
    }
  },

  // ── Load ───────────────────────────────────────────────
  load(onReady) {
    let resolved = false;

    const fallbackTimer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.warn("⏱ Firebase timeout (6s) — localStorage ga o'tildi");
        this._loadLocal(onReady);
      }
    }, 6000);

    if (this._dbRef) {
      console.log("📡 Firebase dan o'qilmoqda...");
      this._dbRef.on("value", (snapshot) => {
        clearTimeout(fallbackTimer);
        if (resolved) {
          // Still update UI on subsequent real-time changes
          const data = snapshot.val();
          if (data && Array.isArray(data) && data.length > 0) {
            this.matches = this._migrate(data);
            localStorage.setItem("mangitcup_cache", JSON.stringify(this.matches));
            if (window.propagateWinners) propagateWinners();
            if (window.renderAll) renderAll();
          }
          return;
        }
        resolved = true;

        const data = snapshot.val();
        console.log("📦 Firebase data received:", data ? "✅ bor" : "❌ bo'sh");

        if (data && Array.isArray(data) && data.length > 0) {
          this.matches = this._migrate(data);
        } else {
          console.log("🌱 Firebase bo'sh — default ma'lumotlar yozilmoqda...");
          this.matches = this._cloneDefaults();
          this._dbRef.set(this.matches)
            .then(() => console.log("✅ Default data Firebase ga yozildi"))
            .catch(e  => console.error("❌ Firebase write failed:", e.message));
        }
        localStorage.setItem("mangitcup_cache", JSON.stringify(this.matches));
        if (onReady) onReady();

      }, (err) => {
        clearTimeout(fallbackTimer);
        if (resolved) return;
        resolved = true;
        console.error("❌ Firebase read error:", err.code, err.message);
        this._loadLocal(onReady);
      });
    } else {
      clearTimeout(fallbackTimer);
      resolved = true;
      console.warn("⚠️ Firebase ulanmagan — localStorage ishlatiladi");
      this._loadLocal(onReady);
    }
  },

  // ── Save ───────────────────────────────────────────────
  save() {
    localStorage.setItem("mangitcup_cache", JSON.stringify(this.matches));

    if (this._dbRef) {
      this._dbRef.set(this.matches)
        .then(() => console.log("✅ Firebase ga saqlandi"))
        .catch(e  => {
          console.error("❌ Firebase save failed:", e.message);
          // Show user-friendly error
          const badge = document.getElementById("conn-badge");
          if (badge) {
            badge.textContent = "❌ Saqlanmadi!";
            badge.style.cssText = "background:rgba(231,76,60,0.2);border:1px solid rgba(231,76,60,0.4);color:#e74c3c;padding:2px 10px;border-radius:12px;font-size:0.75rem;font-family:'Rajdhani',sans-serif;font-weight:700;display:inline-block;";
            setTimeout(() => {
              if (window.updateConnectionBadge) updateConnectionBadge(!!this._dbRef);
            }, 4000);
          }
        });
    }
  },

  // ── Helpers ────────────────────────────────────────────
  _loadLocal(onReady) {
    const cached = localStorage.getItem("mangitcup_cache")
                || localStorage.getItem("mangitcup2026")
                || localStorage.getItem("mangitcup");
    this.matches = cached ? this._migrate(JSON.parse(cached)) : this._cloneDefaults();
    console.log("💾 localStorage dan yuklandi:", this.matches.length, "ta o'yin");
    if (onReady) onReady();
  },

  _cloneDefaults() {
    return JSON.parse(JSON.stringify(this._defaultMatches));
  },

  _migrate(arr) {
    return arr.map(m => ({
      ...m,
      pen1:       m.pen1       ?? null,
      pen2:       m.pen2       ?? null,
      bestPlayer: m.bestPlayer ?? null,
      scorers:    m.scorers    || [],
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
    this.matches.forEach(m => {
      (m.scorers || []).forEach(s => {
        if (!map[s.player]) map[s.player] = { player:s.player, team:s.team, goals:0 };
        map[s.player].goals++;
      });
    });
    return Object.values(map).sort((a,b) => b.goals - a.goals);
  },

  mvpList() {
    return this.matches
      .filter(m => m.bestPlayer && m.bestPlayer.name)
      .map(m => ({
        name:    m.bestPlayer.name,
        team:    m.bestPlayer.team || "",
        rating:  parseFloat(m.bestPlayer.rating) || 0,
        round:   m.round,
        matchId: m.id,
      }))
      .sort((a,b) => b.rating - a.rating);
  },

  todaysMatches() {
    const today = new Date().toISOString().slice(0,10);
    return this.matches.filter(m =>
      m.date && m.team1 && m.team2 && m.team2 !== "-" && m.date.slice(0,10) === today
    );
  },

  scheduledMatches() {
    return this.matches
      .filter(m => m.date && m.team1 && m.team2 && m.team2 !== "-")
      .sort((a,b) => new Date(a.date) - new Date(b.date));
  },
};
