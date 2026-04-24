// ============================================================
// MANG'IT CUP 2026 — Tournament Data Store
// ============================================================

const TournamentData = {
  name: "MANG'IT CUP",
  season: "2026",

  matches: [
    // RIGHT HALF 1/16
    { id:"R-R16-1", round:"1/16", half:"right", group:"top",    date:"", team1:"2009",   team2:"-",      score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-R16-2", round:"1/16", half:"right", group:"top",    date:"", team1:"1996",   team2:"1994",   score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-R16-3", round:"1/16", half:"right", group:"top",    date:"", team1:"2005",   team2:"-",      score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-R16-4", round:"1/16", half:"right", group:"top",    date:"", team1:"1995",   team2:"FAXR 1", score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-R16-5", round:"1/16", half:"right", group:"bottom", date:"", team1:"2000",   team2:"1997",   score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-R16-6", round:"1/16", half:"right", group:"bottom", date:"", team1:"FA 2",   team2:"-",      score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-R16-7", round:"1/16", half:"right", group:"bottom", date:"", team1:"1993",   team2:"1992",   score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-R16-8", round:"1/16", half:"right", group:"bottom", date:"", team1:"2010",   team2:"-",      score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    // RIGHT HALF 1/8
    { id:"R-R8-1",  round:"1/8",  half:"right", group:"top",    date:"", team1:"2009",   team2:"",       score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-R8-2",  round:"1/8",  half:"right", group:"top",    date:"", team1:"2005",   team2:"",       score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-R8-3",  round:"1/8",  half:"right", group:"bottom", date:"", team1:"",       team2:"FA 2",   score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-R8-4",  round:"1/8",  half:"right", group:"bottom", date:"", team1:"",       team2:"2010",   score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    // RIGHT HALF 1/4
    { id:"R-QF-1",  round:"1/4",  half:"right", group:"top",    date:"", team1:"",       team2:"",       score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"R-QF-2",  round:"1/4",  half:"right", group:"bottom", date:"", team1:"",       team2:"",       score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    // RIGHT SEMI
    { id:"SF-RIGHT",round:"1/2",  half:"right", group:"",       date:"", team1:"",       team2:"",       score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    // FINAL
    { id:"FINAL",   round:"Final",half:"center", group:"",      date:"", team1:"",       team2:"",       score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    // LEFT HALF 1/16
    { id:"L-R16-1", round:"1/16", half:"left",  group:"top",    date:"", team1:"XOMIY",  team2:"-",      score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-R16-2", round:"1/16", half:"left",  group:"top",    date:"", team1:"1990",   team2:"2002",   score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-R16-3", round:"1/16", half:"left",  group:"top",    date:"", team1:"2007",   team2:"-",      score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-R16-4", round:"1/16", half:"left",  group:"top",    date:"", team1:"1998",   team2:"2006",   score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-R16-5", round:"1/16", half:"left",  group:"bottom", date:"", team1:"2003",   team2:"1991",   score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-R16-6", round:"1/16", half:"left",  group:"bottom", date:"", team1:"1999",   team2:"-",      score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-R16-7", round:"1/16", half:"left",  group:"bottom", date:"", team1:"2001",   team2:"2008",   score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-R16-8", round:"1/16", half:"left",  group:"bottom", date:"", team1:"2004",   team2:"-",      score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    // LEFT HALF 1/8
    { id:"L-R8-1",  round:"1/8",  half:"left",  group:"top",    date:"", team1:"XOMIY",  team2:"",       score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-R8-2",  round:"1/8",  half:"left",  group:"top",    date:"", team1:"2007",   team2:"",       score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-R8-3",  round:"1/8",  half:"left",  group:"bottom", date:"", team1:"",       team2:"1999",   score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-R8-4",  round:"1/8",  half:"left",  group:"bottom", date:"", team1:"",       team2:"2004",   score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    // LEFT HALF 1/4
    { id:"L-QF-1",  round:"1/4",  half:"left",  group:"top",    date:"", team1:"",       team2:"",       score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    { id:"L-QF-2",  round:"1/4",  half:"left",  group:"bottom", date:"", team1:"",       team2:"",       score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
    // LEFT SEMI
    { id:"SF-LEFT", round:"1/2",  half:"left",  group:"",       date:"", team1:"",       team2:"",       score1:null, score2:null, pen1:null, pen2:null, played:false, scorers:[], bestPlayer:null },
  ],

  admin: { user:"admin", pass:"mangitcup2026" },

  getMatch(id){ return this.matches.find(m => m.id === id); },

  winner(m){
    if(!m.played || m.score1===null || m.score2===null) return null;
    if(m.team2==="-") return m.team1;
    if(m.score1>m.score2) return m.team1;
    if(m.score2>m.score1) return m.team2;
    if(m.pen1!==null && m.pen2!==null){
      if(m.pen1>m.pen2) return m.team1;
      if(m.pen2>m.pen1) return m.team2;
    }
    return null;
  },

  topScorers(){
    const map = {};
    this.matches.forEach(m => {
      m.scorers.forEach(s => {
        if(!map[s.player]) map[s.player]={player:s.player, team:s.team, goals:0};
        map[s.player].goals++;
      });
    });
    return Object.values(map).sort((a,b)=>b.goals-a.goals);
  },

  mvpList(){
    return this.matches
      .filter(m => m.bestPlayer && m.bestPlayer.name)
      .map(m => ({
        name:    m.bestPlayer.name,
        team:    m.bestPlayer.team||"",
        rating:  parseFloat(m.bestPlayer.rating)||0,
        round:   m.round,
        matchId: m.id,
      }))
      .sort((a,b)=>b.rating-a.rating);
  },

  todaysMatches(){
    const todayStr = new Date().toISOString().slice(0,10);
    return this.matches.filter(m=>
      m.date && m.team1 && m.team2 && m.team2!=="-" && m.date.slice(0,10)===todayStr
    );
  },

  scheduledMatches(){
    return this.matches
      .filter(m=>m.date && m.team1 && m.team2 && m.team2!=="-")
      .sort((a,b)=>new Date(a.date)-new Date(b.date));
  },

  save(){ localStorage.setItem("mangitcup2026", JSON.stringify(this.matches)); },

  load(){
    const saved = localStorage.getItem("mangitcup2026")||localStorage.getItem("mangitcup");
    if(saved){
      const parsed = JSON.parse(saved);
      parsed.forEach(m=>{
        if(m.pen1===undefined)      m.pen1=null;
        if(m.pen2===undefined)      m.pen2=null;
        if(m.bestPlayer===undefined) m.bestPlayer=null;
      });
      this.matches=parsed;
    }
  }
};
