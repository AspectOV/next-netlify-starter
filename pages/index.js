import { useEffect, useState, useRef, useCallback, useMemo } from "react";

const COMBO_PHRASES = [
  "DIEGO APPRECIATED! 🙏",
  "DOUBLE RESPECT! 💥",
  "TRIPLE HONOR! 🔥",
  "MEGA DIEGO! 👑",
  "ULTRA COMBO! ⚡",
  "LEGENDARY!! 🌟",
  "GODLIKE RESPECT!! 💎",
  "UNSTOPPABLE!!! 🚀",
  "DIEGO IS ETERNAL!!!! 🌈",
  "MAX RESPECT ACHIEVED!!!!! ✨",
  "TRANSCENDENT!!!!! 🌀",
  "BEYOND MORTAL!!!!!!! 👁️",
];

const MOUSE_COMMENTS = [
  "nice click bro",
  "u clicked again lol",
  "stop clicking so much",
  "ok calm down",
  "Diego sees you",
  "respectful ✅",
  "the mouse whisperer",
  "clicker detected",
  "legendary mouse user",
  "ur clicking skills are immaculate",
  "certified clicker",
  "finger speed: INSANE",
  "Diego would be proud",
  "clicking at the speed of light",
  "bro won't stop",
];

const ACHIEVEMENTS = [
  { at: 5,   text: "🏅 5 CLICKS — BRONZE RESPECTER" },
  { at: 10,  text: "🥈 10 CLICKS — SILVER RESPECTER" },
  { at: 25,  text: "🥇 25 CLICKS — GOLD RESPECTER" },
  { at: 50,  text: "💎 50 CLICKS — DIAMOND RESPECTER" },
  { at: 100, text: "👑 100 CLICKS — DIEGO'S CHOSEN ONE" },
];

// Particle pool to reduce GC pressure
const POOL_SIZE = 150;
const particlePool = Array.from({ length: POOL_SIZE }, (_, i) => ({ poolId: i, active: false }));
function acquireParticles(count) {
  const out = [];
  for (let i = 0; i < POOL_SIZE && out.length < count; i++) {
    if (!particlePool[i].active) { particlePool[i].active = true; out.push(i); }
  }
  return out;
}
function releaseParticles(ids) {
  ids.forEach(id => { if (particlePool[id]) particlePool[id].active = false; });
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; overflow: hidden; background: black; }

  @keyframes fall {
    from { transform: translateY(-10vh) rotate(0deg) scale(1); opacity: 1; }
    to   { transform: translateY(110vh) rotate(720deg) scale(0.2); opacity: 0; }
  }
  @keyframes flash {
    0%,100% { opacity: 0; } 50% { opacity: 0.4; }
  }
  @keyframes pulseBtn {
    0%,100% { box-shadow: 0 0 25px 6px #ff00ff, 0 0 70px 12px #00ffff, 0 0 110px 22px #ffff00; }
    33%     { box-shadow: 0 0 35px 9px #00ffff, 0 0 80px 16px #ff00ff, 0 0 130px 28px #ff0000; }
    66%     { box-shadow: 0 0 30px 7px #ffff00, 0 0 75px 14px #ff0000, 0 0 120px 25px #00ff00; }
  }
  @keyframes rainbowBg {
    0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; }
  }
  @keyframes comboIn {
    0%   { transform: translateX(-50%) scale(0.2) translateY(30px); opacity: 0; }
    40%  { transform: translateX(-50%) scale(1.3) translateY(-10px); opacity: 1; }
    70%  { transform: translateX(-50%) scale(1) translateY(0); opacity: 1; }
    100% { transform: translateX(-50%) scale(0.8) translateY(-20px); opacity: 0; }
  }
  @keyframes floatUp {
    0% { transform: translateY(0) scale(1); opacity: 1; }
    100% { transform: translateY(-140px) scale(1.5); opacity: 0; }
  }
  @keyframes mouseSlide {
    0%   { transform: translateX(calc(-50% - 30px)); opacity: 0; }
    20%  { transform: translateX(-50%); opacity: 1; }
    80%  { transform: translateX(-50%); opacity: 1; }
    100% { transform: translateX(calc(-50% + 30px)); opacity: 0; }
  }
  @keyframes glitch {
    0%   { clip-path: inset(0 0 95% 0); transform: translate(-5px, 0); }
    20%  { clip-path: inset(30% 0 50% 0); transform: translate(5px, 0); }
    40%  { clip-path: inset(60% 0 20% 0); transform: translate(-4px, 2px); }
    60%  { clip-path: inset(80% 0 5% 0); transform: translate(4px, -2px); }
    80%  { clip-path: inset(40% 0 40% 0); transform: translate(-2px, 1px); }
    100% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
  }
  @keyframes titlePulse {
    0%,100% { text-shadow: 0 0 10px #fff, 0 0 30px #ff00ff, 0 0 60px #00ffff; }
    50%     { text-shadow: 0 0 20px #fff, 0 0 50px #ffff00, 0 0 80px #ff00ff; }
  }
  @keyframes ddosShake {
    0%,100% { transform: translateX(0); }
    25% { transform: translateX(-5px) rotate(-1.5deg); }
    75% { transform: translateX(5px) rotate(1.5deg); }
  }
  @keyframes orb {
    0%   { transform: rotate(0deg) translateX(110px) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(110px) rotate(-360deg); }
  }
  @keyframes screenShake {
    0%,100% { transform: translate(0,0); }
    20% { transform: translate(-5px, 3px); }
    40% { transform: translate(5px, -3px); }
    60% { transform: translate(-3px, 4px); }
    80% { transform: translate(3px, -1px); }
  }
  @keyframes rippleOut {
    0%   { width: 10px; height: 10px; opacity: 0.8; }
    100% { width: 220px; height: 220px; opacity: 0; }
  }
  @keyframes achieveIn {
    0%   { transform: translateX(-50%) translateY(-60px); opacity: 0; }
    15%  { transform: translateX(-50%) translateY(0); opacity: 1; }
    80%  { transform: translateX(-50%) translateY(0); opacity: 1; }
    100% { transform: translateX(-50%) translateY(-40px); opacity: 0; }
  }
  @keyframes streakPop {
    0%   { transform: scale(0.5); opacity: 0; }
    30%  { transform: scale(1.2); opacity: 1; }
    80%  { transform: scale(1); opacity: 1; }
    100% { transform: scale(0.8); opacity: 0; }
  }

  .diego-btn {
    padding: 22px 52px;
    font-size: 24px;
    font-weight: 900;
    font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 3px;
    border-radius: 16px;
    border: 3px solid rgba(255,255,255,0.85);
    cursor: pointer;
    background: linear-gradient(90deg,#ff0000,#ff7700,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000);
    background-size: 200% 100%;
    color: white;
    text-shadow: 0 2px 8px rgba(0,0,0,0.9);
    animation: pulseBtn 2s ease-in-out infinite, rainbowBg 1.2s linear infinite;
    transition: transform 0.1s;
    position: relative;
    overflow: hidden;
    z-index: 10;
    will-change: transform, box-shadow;
  }
  .diego-btn::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 20px;
    background: linear-gradient(90deg, #ff00ff, #00ffff, #ffff00, #ff00ff);
    background-size: 200%;
    animation: rainbowBg 0.8s linear infinite;
    z-index: -1;
    filter: blur(10px);
    opacity: 0.9;
  }
  .diego-btn:active { transform: scale(0.9) !important; }

  .ddos-btn {
    padding: 14px 40px;
    font-size: 17px;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    border-radius: 8px;
    border: 2px solid #ff3333;
    background: rgba(255,30,30,0.08);
    color: #ff3333;
    cursor: pointer;
    letter-spacing: 3px;
    transition: all 0.2s;
    text-transform: uppercase;
    will-change: transform;
  }
  .ddos-btn:hover {
    background: rgba(255,30,30,0.2);
    box-shadow: 0 0 25px #ff3333, 0 0 50px #ff333355;
    letter-spacing: 4px;
  }
  .ddos-btn.active {
    animation: ddosShake 0.08s infinite;
    background: rgba(255,0,0,0.25);
    border-color: #ff0000;
    box-shadow: 0 0 50px #ff0000, 0 0 100px #ff000055;
    color: #ff8888;
  }
`;

export default function Home() {
  const [ip, setIp] = useState("Loading...");
  const [party, setParty] = useState(false);
  const [particles, setParticles] = useState([]);
  const [combo, setCombo] = useState(0);
  const [comboText, setComboText] = useState(null);
  const [mouseComment, setMouseComment] = useState(null);
  const [ddosing, setDdosing] = useState(false);
  const [ddosProgress, setDdosProgress] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [buttonScale, setButtonScale] = useState(1);
  const [glitchActive, setGlitchActive] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [achievement, setAchievement] = useState(null);
  const [shake, setShake] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [screenColor, setScreenColor] = useState(null);
  const [streakMessage, setStreakMessage] = useState(null);

  const comboTimeoutRef = useRef(null);
  const mouseCommentTimeoutRef = useRef(null);
  const achievementTimeoutRef = useRef(null);
  const streakTimeoutRef = useRef(null);
  const hueRef = useRef(0);
  const bgIntervalRef = useRef(null);
  const glitchIntervalRef = useRef(null);
  const ddosIntervalRef = useRef(null);
  const clickCountRef = useRef(0);
  const comboRef = useRef(0);

  // IP
  useEffect(() => {
    const ctrl = new AbortController();
    fetch("https://api.ipify.org?format=json", { signal: ctrl.signal })
      .then(r => r.json()).then(d => setIp(d.ip)).catch(() => setIp("Unable to fetch IP"));
    return () => ctrl.abort();
  }, []);

  // Rainbow BG
  useEffect(() => {
    if (!party) return;
    bgIntervalRef.current = setInterval(() => {
      hueRef.current = (hueRef.current + 12) % 360;
      document.body.style.background = `hsl(${hueRef.current}, 100%, 8%)`;
    }, 60);
    return () => clearInterval(bgIntervalRef.current);
  }, [party]);

  // Glitch
  useEffect(() => {
    if (!party) return;
    glitchIntervalRef.current = setInterval(() => {
      if (Math.random() > 0.65) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 100 + Math.random() * 250);
      }
    }, 900);
    return () => clearInterval(glitchIntervalRef.current);
  }, [party]);

  // Cleanup all timers
  useEffect(() => () => {
    [comboTimeoutRef, mouseCommentTimeoutRef, achievementTimeoutRef, streakTimeoutRef].forEach(r => clearTimeout(r.current));
    [bgIntervalRef, glitchIntervalRef, ddosIntervalRef].forEach(r => clearInterval(r.current));
  }, []);

  // Pre-generate particle visual data once (pool-indexed)
  const particleData = useMemo(() => Array.from({ length: POOL_SIZE }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    color: `hsl(${Math.random() * 360},100%,60%)`,
    size: 4 + Math.random() * 14,
    isCircle: Math.random() > 0.5,
    duration: 2 + Math.random() * 3,
  })), []);

  const spawnParticles = useCallback(() => {
    const ids = acquireParticles(80);
    if (!ids.length) return;
    setParticles(prev => [...prev, ...ids]);
    setTimeout(() => { releaseParticles(ids); setParticles(prev => prev.filter(id => !ids.includes(id))); }, 5500);
  }, []);

  const spawnFloatingText = useCallback((text, color) => {
    const id = Math.random();
    const x = 15 + Math.random() * 70;
    const y = 25 + Math.random() * 50;
    setFloatingTexts(prev => [...prev, { id, text, x, y, color }]);
    setTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== id)), 2100);
  }, []);

  const spawnRipple = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Math.random();
    setRipples(prev => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700);
  }, []);

  const checkAchievement = useCallback((count) => {
    const ach = ACHIEVEMENTS.find(a => a.at === count);
    if (!ach) return;
    clearTimeout(achievementTimeoutRef.current);
    setAchievement(ach.text);
    setShake(true);
    setTimeout(() => setShake(false), 450);
    achievementTimeoutRef.current = setTimeout(() => setAchievement(null), 3800);
  }, []);

  const activateRespect = useCallback((e) => {
    spawnRipple(e);
    setParty(true);
    spawnParticles();

    const newCount = ++clickCountRef.current;
    setClickCount(newCount);
    checkAchievement(newCount);

    comboRef.current += 1;
    const next = comboRef.current;
    setCombo(next);
    setComboText({ text: COMBO_PHRASES[Math.min(next - 1, COMBO_PHRASES.length - 1)], id: performance.now() });

    if (next >= 5) {
      const msgs = ["ON FIRE 🔥", "SPEEDY 💨", "MASHING 🎮", "RELENTLESS ⚡", "UNSTOPPABLE 💫"];
      setStreakMessage(msgs[next % msgs.length]);
      clearTimeout(streakTimeoutRef.current);
      streakTimeoutRef.current = setTimeout(() => setStreakMessage(null), 1300);
    }

    if (Math.random() > 0.25) {
      setMouseComment({ text: MOUSE_COMMENTS[Math.floor(Math.random() * MOUSE_COMMENTS.length)], id: performance.now() });
      clearTimeout(mouseCommentTimeoutRef.current);
      mouseCommentTimeoutRef.current = setTimeout(() => setMouseComment(null), 2500);
    }

    setButtonScale(1.25);
    setTimeout(() => setButtonScale(1), 120);

    // Screen flash
    const flashColors = ['#ff00ff30','#00ffff30','#ffff0030','#ff000030','#00ff0030'];
    setScreenColor(flashColors[Math.floor(Math.random() * flashColors.length)]);
    setTimeout(() => setScreenColor(null), 110);

    clearTimeout(comboTimeoutRef.current);
    comboTimeoutRef.current = setTimeout(() => { comboRef.current = 0; setCombo(0); }, 2000);

    const colors = ['#ff00ff','#00ffff','#ffff00','#ff4400','#00ff88','#ff0088'];
    const rc = () => colors[Math.floor(Math.random() * colors.length)];
    spawnFloatingText("+RESPECT", rc());
    if (next > 3)  spawnFloatingText("+HONOR", rc());
    if (next > 7)  spawnFloatingText("+CLOUT", rc());
    if (next > 12) spawnFloatingText("DIEGO!!", rc());
  }, [spawnParticles, spawnFloatingText, spawnRipple, checkAchievement]);

  const handleDdos = useCallback(() => {
    if (ddosing) return;
    setDdosing(true);
    setDdosProgress(0);
    let prog = 0;
    ddosIntervalRef.current = setInterval(() => {
      prog += Math.random() * 9 + 2;
      if (prog >= 100) {
        prog = 100;
        clearInterval(ddosIntervalRef.current);
        setTimeout(() => { setDdosing(false); setDdosProgress(0); }, 900);
      }
      setDdosProgress(Math.min(prog, 100));
    }, 85);
  }, [ddosing]);

  const rank = useMemo(() => {
    if (clickCount < 5)  return '🥉';
    if (clickCount < 25) return '🥈';
    if (clickCount < 50) return '🥇';
    if (clickCount < 100) return '💎';
    return '👑';
  }, [clickCount]);

  return (
    <div style={{ ...containerStyle, animation: shake ? 'screenShake 0.45s ease-out' : 'none' }}>
      <style>{CSS}</style>

      {/* Screen flash */}
      {screenColor && <div style={{ position:'fixed', inset:0, background:screenColor, pointerEvents:'none', zIndex:200, mixBlendMode:'screen' }} />}

      {/* Scanlines */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:999, background:'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)' }} />

      {/* Corner brackets */}
      {[{top:16,left:16,bt:'top',bl:'left'},{top:16,right:16,bt:'top',bl:'right'},{bottom:16,left:16,bt:'bottom',bl:'left'},{bottom:16,right:16,bt:'bottom',bl:'right'}].map((c,i) => (
        <div key={i} style={{ position:'fixed', width:28, height:28, zIndex:998, pointerEvents:'none', ...c, [`border${c.bt.charAt(0).toUpperCase()+c.bt.slice(1)}`]:'2px solid #00ffaa', [`border${c.bl.charAt(0).toUpperCase()+c.bl.slice(1)}`]:'2px solid #00ffaa' }} />
      ))}

      {/* Orbiting orbs — more of them */}
      {[0,1,2,3,4,5,6].map(i => (
        <div key={i} style={{
          position:'fixed', left:'50%', top:'50%',
          width: 7 + i*2, height: 7 + i*2,
          borderRadius:'50%',
          background:`hsl(${i*51},100%,65%)`,
          boxShadow:`0 0 18px hsl(${i*51},100%,65%)`,
          animation:`orb ${2.2 + i*0.55}s linear infinite`,
          animationDelay:`${i*0.45}s`,
          pointerEvents:'none', zIndex:1, filter:'blur(1px)',
          marginLeft:-(3.5+i), marginTop:-(3.5+i),
          willChange:'transform',
        }} />
      ))}

      {/* Achievement banner */}
      {achievement && (
        <div style={{
          position:'fixed', top:24, left:'50%',
          fontFamily:"'Bebas Neue', sans-serif", fontSize:22,
          background:'linear-gradient(90deg,rgba(255,215,0,0.95),rgba(255,130,0,0.95))',
          color:'#000', padding:'12px 32px', borderRadius:8,
          letterSpacing:3, boxShadow:'0 0 50px #ffaa00, 0 4px 20px rgba(0,0,0,0.6)',
          animation:'achieveIn 3.8s ease-out forwards',
          whiteSpace:'nowrap', zIndex:300,
        }}>{achievement}</div>
      )}

      {/* Streak */}
      {streakMessage && (
        <div style={{
          position:'fixed', top:'18%', right:28,
          fontFamily:"'Bebas Neue', sans-serif", fontSize:30,
          color:'#ff4400', textShadow:'0 0 22px #ff4400',
          letterSpacing:4, animation:'streakPop 1.3s ease-out forwards',
          pointerEvents:'none', zIndex:100,
        }}>{streakMessage}</div>
      )}

      {/* Main content */}
      <div style={{ position:'relative', zIndex:10, textAlign:'center', padding:'0 24px' }}>

        <div style={{ display:'inline-block', background:'rgba(255,0,0,0.12)', border:'1px solid #ff4444', borderRadius:4, padding:'3px 14px', fontSize:10, letterSpacing:4, color:'#ff4444', marginBottom:10, textTransform:'uppercase', fontFamily:"'Space Mono', monospace" }}>
          ⚠ CLASSIFIED ⚠
        </div>

        <h1 style={{ fontFamily:"'Space Mono', monospace", fontSize:12, color:'#aaffaa', letterSpacing:6, textTransform:'uppercase', margin:'0 0 4px', opacity:0.55 }}>INTEL ACQUIRED</h1>
        <h2 style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:34, color:'#ffffff', letterSpacing:8, margin:'0 0 10px', animation:'titlePulse 2s ease-in-out infinite' }}>YOUR IP ADDRESS</h2>

        {/* IP with glitch */}
        <div style={{ position:'relative', display:'inline-block', marginBottom:4 }}>
          {glitchActive && (
            <div style={{ position:'absolute', inset:0, fontFamily:"'Space Mono', monospace", fontSize:38, fontWeight:700, color:'#ff00ff', letterSpacing:4, animation:'glitch 0.15s steps(1) infinite', pointerEvents:'none' }}>{ip}</div>
          )}
          <div style={{ fontFamily:"'Space Mono', monospace", fontSize:38, fontWeight:700, color:'#00ffaa', textShadow:'0 0 20px #00ffaa, 0 0 50px #00ffaa44', letterSpacing:4 }}>{ip}</div>
        </div>

        <p style={{ fontFamily:"'Space Mono', monospace", fontSize:10, color:'#ff4444', letterSpacing:2, margin:'4px 0 24px', opacity:0.75, textTransform:'uppercase' }}>
          ⚠ FULLY EXPOSED — WE KNOW EVERYTHING ⚠
        </p>

        {/* DDOS */}
        <div style={{ marginBottom:44 }}>
          <button className={`ddos-btn${ddosing ? ' active' : ''}`} onClick={handleDdos}>
            {ddosing ? '💀 ddosing...' : '💻 DDOS'}
          </button>
          {ddosing && (
            <div style={{ marginTop:10, width:210, height:10, background:'rgba(255,50,50,0.15)', borderRadius:5, border:'1px solid #ff3333', position:'relative', overflow:'hidden', margin:'10px auto 0' }}>
              <div style={{ height:'100%', background:'linear-gradient(90deg,#ff0000,#ff6600)', boxShadow:'0 0 8px #ff0000', width:`${ddosProgress}%`, transition:'width 0.1s linear', borderRadius:5 }} />
              <span style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, color:'#ffaaaa', fontFamily:"'Space Mono', monospace", letterSpacing:1 }}>{Math.floor(ddosProgress)}%</span>
            </div>
          )}
        </div>

        {/* Diego Button */}
        <div style={{ position:'relative', display:'inline-block' }}>
          <button className="diego-btn" onClick={activateRespect} style={{ transform:`scale(${buttonScale})` }}>
            {ripples.map(r => (
              <span key={r.id} style={{ position:'absolute', borderRadius:'50%', background:'rgba(255,255,255,0.55)', transform:'translate(-50%,-50%)', left:r.x, top:r.y, animation:'rippleOut 0.7s ease-out forwards', pointerEvents:'none', width:10, height:10 }} />
            ))}
            🫡 DIEGO RESPECT BUTTON 🫡
          </button>
        </div>

        {/* Combo display */}
        {combo > 0 && (
          <div style={{ fontFamily:"'Bebas Neue', sans-serif", letterSpacing:4, marginTop:14, lineHeight:1.1 }}>
            <span style={{ fontSize:13, letterSpacing:4, opacity:0.6, display:'block' }}>COMBO</span>
            <span style={{ fontSize:46, lineHeight:1, color: combo >= 8 ? '#ff00ff' : combo >= 5 ? '#ffff00' : '#00ffff', textShadow: combo >= 8 ? '0 0 20px #ff00ff' : combo >= 5 ? '0 0 20px #ffff00' : '0 0 20px #00ffff' }}>×{combo}</span>
          </div>
        )}

        {/* Stats */}
        {clickCount > 0 && (
          <div style={{ display:'flex', gap:14, justifyContent:'center', marginTop:18 }}>
            {[
              { num: clickCount, label:'RESPECTS', color:'#00ffaa' },
              { num: rank,       label:'RANK',     color:'#ffff00' },
              { num: combo || 0, label:'STREAK',   color:'#ff4400' },
            ].map((s,i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:8, padding:'10px 18px', textAlign:'center', minWidth:68 }}>
                <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:28, color:s.color, letterSpacing:2, lineHeight:1 }}>{s.num}</div>
                <div style={{ fontSize:9, letterSpacing:3, color:'#555', marginTop:3, fontFamily:"'Space Mono', monospace" }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Combo popup */}
      {comboText && (
        <div key={comboText.id} style={{ position:'fixed', top:'34%', left:'50%', fontFamily:"'Bebas Neue', sans-serif", fontSize:58, color:'#fff', textShadow:'0 0 20px #ff00ff, 0 0 45px #00ffff, 0 0 70px #ffff00', pointerEvents:'none', animation:'comboIn 1.2s ease-out forwards', whiteSpace:'nowrap', zIndex:100, letterSpacing:4 }}>
          {comboText.text}
        </div>
      )}

      {/* Mouse comment */}
      {mouseComment && (
        <div key={mouseComment.id} style={{ position:'fixed', bottom:68, left:'50%', fontFamily:"'Space Mono', monospace", fontSize:18, color:'#00ffff', textShadow:'0 0 12px #00ffff', pointerEvents:'none', animation:'mouseSlide 2.5s ease-out forwards', whiteSpace:'nowrap', zIndex:100, letterSpacing:2 }}>
          🖱️ {mouseComment.text}
        </div>
      )}

      {/* Floating texts */}
      {floatingTexts.map(t => (
        <div key={t.id} style={{ position:'fixed', left:`${t.x}%`, top:`${t.y}%`, fontFamily:"'Bebas Neue', sans-serif", fontSize:22, color:t.color, textShadow:`0 0 12px ${t.color}`, pointerEvents:'none', animation:'floatUp 2.1s ease-out forwards', zIndex:50, letterSpacing:3 }}>
          {t.text}
        </div>
      ))}

      {/* Flash overlay */}
      {party && <div style={{ position:'fixed', inset:0, background:'white', mixBlendMode:'overlay', pointerEvents:'none', animation:'flash 0.25s infinite', zIndex:5 }} />}

      {/* Particles — pool-indexed, data memoized */}
      {particles.map(id => {
        const p = particleData[id];
        if (!p) return null;
        return (
          <div key={id} style={{
            position:'fixed', top:0, left:`${p.left}%`,
            width:p.size, height:p.size,
            borderRadius: p.isCircle ? '50%' : '2px',
            background:p.color, boxShadow:`0 0 8px ${p.color}`,
            pointerEvents:'none',
            animation:`fall ${p.duration}s linear forwards`,
            animationDelay:`${p.delay}s`,
            transform: p.isCircle ? undefined : 'rotate(45deg)',
            zIndex:20, willChange:'transform, opacity',
          }} />
        );
      })}
    </div>
  );
}

const containerStyle = {
  minHeight:'100vh', display:'flex', flexDirection:'column',
  justifyContent:'center', alignItems:'center',
  background:'black', color:'white', position:'relative', overflow:'hidden',
};
