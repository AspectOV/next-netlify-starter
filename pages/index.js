import { useEffect, useState, useRef, useCallback } from "react";

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'black',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
  },
};

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
];

export default function Home() {
  const [ip, setIp] = useState("Loading...");
  const [party, setParty] = useState(false);
  const [particles, setParticles] = useState([]);
  const [combo, setCombo] = useState(0);
  const [comboText, setComboText] = useState(null);
  const [mouseComment, setMouseComment] = useState(null);
  const [ddosing, setDdosing] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [buttonScale, setButtonScale] = useState(1);
  const [glitchActive, setGlitchActive] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const comboTimeoutRef = useRef(null);
  const mouseCommentTimeoutRef = useRef(null);
  const hueRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch(() => setIp("Unable to fetch IP"));
  }, []);

  useEffect(() => {
    if (!party) return;
    intervalRef.current = setInterval(() => {
      hueRef.current = (hueRef.current + 15) % 360;
      document.body.style.background = `hsl(${hueRef.current}, 100%, 10%)`;
    }, 60);
    return () => clearInterval(intervalRef.current);
  }, [party]);

  // Random glitch effect after party starts
  useEffect(() => {
    if (!party) return;
    const glitchLoop = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150 + Math.random() * 300);
      }
    }, 800);
    return () => clearInterval(glitchLoop);
  }, [party]);

  const spawnParticles = useCallback(() => {
    const newParticles = Array.from({ length: 100 }, () => ({
      id: Math.random(),
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      color: `hsl(${Math.random() * 360},100%,60%)`,
      size: 4 + Math.random() * 14,
      type: Math.random() > 0.5 ? "circle" : "star",
      duration: 2 + Math.random() * 3,
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(n => n.id === p.id)));
    }, 5000);
  }, []);

  const spawnFloatingText = useCallback((text, color) => {
    const id = Math.random();
    const x = 20 + Math.random() * 60;
    setFloatingTexts(prev => [...prev, { id, text, x, color }]);
    setTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== id)), 2000);
  }, []);

  const activateRespect = useCallback(() => {
    setParty(true);
    spawnParticles();

    setClickCount(prev => prev + 1);

    // Combo system
    setCombo(prev => {
      const next = prev + 1;
      const phrase = COMBO_PHRASES[Math.min(next - 1, COMBO_PHRASES.length - 1)];
      setComboText({ text: phrase, id: Date.now() });
      return next;
    });

    // Mouse comment
    const comment = MOUSE_COMMENTS[Math.floor(Math.random() * MOUSE_COMMENTS.length)];
    setMouseComment({ text: comment, id: Date.now() });
    clearTimeout(mouseCommentTimeoutRef.current);
    mouseCommentTimeoutRef.current = setTimeout(() => setMouseComment(null), 2500);

    // Button bounce
    setButtonScale(1.3);
    setTimeout(() => setButtonScale(1), 150);

    // Reset combo after 2s inactivity
    clearTimeout(comboTimeoutRef.current);
    comboTimeoutRef.current = setTimeout(() => setCombo(0), 2000);

    // Floating "+RESPECT"
    spawnFloatingText("+RESPECT", `hsl(${Math.random()*360},100%,60%)`);
  }, [spawnParticles, spawnFloatingText]);

  const handleDdos = () => {
    if (ddosing) return;
    setDdosing(true);
    setTimeout(() => setDdosing(false), 3000);
  };

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        * { box-sizing: border-box; }

        body { margin: 0; overflow: hidden; background: black; }

        @keyframes fall {
          from { transform: translateY(-10vh) rotate(0deg) scale(1); opacity: 1; }
          to { transform: translateY(110vh) rotate(720deg) scale(0.3); opacity: 0; }
        }
        @keyframes flash {
          0%,100% { opacity: 0; }
          50% { opacity: 0.5; }
        }
        @keyframes pulseBtn {
          0%,100% { box-shadow: 0 0 20px 5px #ff00ff, 0 0 60px 10px #00ffff, 0 0 100px 20px #ffff00; }
          33% { box-shadow: 0 0 30px 8px #00ffff, 0 0 70px 15px #ff00ff, 0 0 120px 25px #ff0000; }
          66% { box-shadow: 0 0 25px 6px #ffff00, 0 0 65px 12px #ff0000, 0 0 110px 22px #00ff00; }
        }
        @keyframes rainbowBg {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes comboIn {
          0% { transform: scale(0.2) translateY(30px); opacity: 0; }
          40% { transform: scale(1.3) translateY(-10px); opacity: 1; }
          70% { transform: scale(1) translateY(0); opacity: 1; }
          100% { transform: scale(0.8) translateY(-20px); opacity: 0; }
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-120px) scale(1.4); opacity: 0; }
        }
        @keyframes mouseSlide {
          0% { transform: translateX(-30px); opacity: 0; }
          20% { transform: translateX(0); opacity: 1; }
          80% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(30px); opacity: 0; }
        }
        @keyframes glitch {
          0% { clip-path: inset(0 0 95% 0); transform: translate(-4px, 0); }
          20% { clip-path: inset(30% 0 50% 0); transform: translate(4px, 0); }
          40% { clip-path: inset(60% 0 20% 0); transform: translate(-4px, 2px); }
          60% { clip-path: inset(80% 0 5% 0); transform: translate(4px, -2px); }
          80% { clip-path: inset(40% 0 40% 0); transform: translate(-2px, 1px); }
          100% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes titlePulse {
          0%,100% { text-shadow: 0 0 10px #fff, 0 0 30px #ff00ff, 0 0 60px #00ffff; }
          50% { text-shadow: 0 0 20px #fff, 0 0 50px #ffff00, 0 0 80px #ff00ff; }
        }
        @keyframes ddosShake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-4px) rotate(-1deg); }
          75% { transform: translateX(4px) rotate(1deg); }
        }
        @keyframes orb {
          0% { transform: rotate(0deg) translateX(80px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
        }
        @keyframes pulse {
          0%,100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 1; }
        }

        .diego-btn {
          padding: 22px 48px;
          font-size: 22px;
          font-weight: 900;
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 3px;
          border-radius: 16px;
          border: 3px solid white;
          cursor: pointer;
          background: linear-gradient(90deg, #ff0000, #ff7700, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);
          background-size: 200% 100%;
          color: white;
          text-shadow: 0 2px 6px rgba(0,0,0,0.8);
          animation: pulseBtn 2s ease-in-out infinite, rainbowBg 1.5s linear infinite;
          transition: transform 0.1s;
          position: relative;
          overflow: hidden;
          z-index: 10;
        }
        .diego-btn::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 18px;
          background: linear-gradient(90deg, #ff00ff, #00ffff, #ffff00, #ff00ff);
          background-size: 200%;
          animation: rainbowBg 1s linear infinite;
          z-index: -1;
          filter: blur(8px);
          opacity: 0.8;
        }
        .diego-btn:active { transform: scale(0.92) !important; }

        .ddos-btn {
          padding: 14px 36px;
          font-size: 18px;
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          border-radius: 8px;
          border: 2px solid #ff3333;
          background: rgba(255,30,30,0.1);
          color: #ff3333;
          cursor: pointer;
          letter-spacing: 2px;
          transition: all 0.2s;
          text-transform: uppercase;
        }
        .ddos-btn:hover {
          background: rgba(255,30,30,0.25);
          box-shadow: 0 0 20px #ff3333;
        }
        .ddos-btn.active {
          animation: ddosShake 0.1s infinite;
          background: rgba(255,0,0,0.3);
          border-color: #ff0000;
          box-shadow: 0 0 40px #ff0000;
          color: #ff6666;
        }
      `}</style>

      {/* Scanline effect */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
      }} />

      {/* Orbiting orbs */}
      {[0,1,2,3].map(i => (
        <div key={i} style={{
          position: 'fixed',
          left: '50%', top: '50%',
          width: 12, height: 12,
          borderRadius: '50%',
          background: `hsl(${i*90},100%,60%)`,
          boxShadow: `0 0 15px hsl(${i*90},100%,60%)`,
          animation: `orb ${3 + i * 0.5}s linear infinite`,
          animationDelay: `${i * 0.75}s`,
          pointerEvents: 'none',
          zIndex: 1,
          filter: 'blur(1px)',
        }} />
      ))}

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <h1 style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 16,
          color: '#aaffaa',
          letterSpacing: 4,
          textTransform: 'uppercase',
          margin: '0 0 4px',
          opacity: 0.7,
        }}>CLASSIFIED INTEL</h1>

        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 28,
          color: '#ffffff',
          letterSpacing: 6,
          margin: '0 0 8px',
          animation: 'titlePulse 2s ease-in-out infinite',
        }}>YOUR IP ADDRESS</h2>

        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 36,
          fontWeight: 700,
          color: '#00ffaa',
          textShadow: '0 0 20px #00ffaa, 0 0 40px #00ffaa',
          marginBottom: 8,
          letterSpacing: 3,
          position: 'relative',
        }}>
          {glitchActive && (
            <div style={{
              position: 'absolute', inset: 0,
              color: '#ff00ff',
              animation: 'glitch 0.15s steps(1) infinite',
              pointerEvents: 'none',
            }}>{ip}</div>
          )}
          {ip}
        </div>

        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          color: '#ff4444',
          letterSpacing: 2,
          margin: '0 0 12px',
          opacity: 0.8,
          textTransform: 'uppercase',
        }}>⚠ fully exposed ⚠</p>

        {/* DDOS Button */}
        <button
          className={`ddos-btn${ddosing ? ' active' : ''}`}
          onClick={handleDdos}
          style={{ marginBottom: 48 }}
        >
          {ddosing ? '💀 ddosing...' : '💻 DDOS'}
        </button>

        <br />

        {/* Diego Button */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            className="diego-btn"
            onClick={activateRespect}
            style={{ transform: `scale(${buttonScale})` }}
          >
            🫡 DIEGO RESPECT BUTTON 🫡
          </button>
        </div>

        {/* Combo counter */}
        {combo > 0 && (
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 18,
            color: '#ffff00',
            letterSpacing: 3,
            marginTop: 10,
            textShadow: '0 0 10px #ffff00',
          }}>
            COMBO x{combo}
          </div>
        )}

        {/* Click count */}
        {clickCount > 0 && (
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            color: '#888',
            marginTop: 6,
            letterSpacing: 2,
          }}>
            total respects given: {clickCount}
          </div>
        )}
      </div>

      {/* Combo text popup */}
      {comboText && (
        <div key={comboText.id} style={{
          position: 'fixed',
          top: '38%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 52,
          color: '#fff',
          textShadow: '0 0 20px #ff00ff, 0 0 40px #00ffff, 0 0 60px #ffff00',
          pointerEvents: 'none',
          animation: 'comboIn 1.2s ease-out forwards',
          whiteSpace: 'nowrap',
          zIndex: 100,
          letterSpacing: 4,
        }}>
          {comboText.text}
        </div>
      )}

      {/* Mouse comment */}
      {mouseComment && (
        <div key={mouseComment.id} style={{
          position: 'fixed',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Space Mono', monospace",
          fontSize: 20,
          color: '#00ffff',
          textShadow: '0 0 10px #00ffff',
          pointerEvents: 'none',
          animation: 'mouseSlide 2.5s ease-out forwards',
          whiteSpace: 'nowrap',
          zIndex: 100,
          letterSpacing: 2,
        }}>
          🖱️ {mouseComment.text}
        </div>
      )}

      {/* Floating +RESPECT texts */}
      {floatingTexts.map(t => (
        <div key={t.id} style={{
          position: 'fixed',
          bottom: '45%',
          left: `${t.x}%`,
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 24,
          color: t.color,
          textShadow: `0 0 10px ${t.color}`,
          pointerEvents: 'none',
          animation: 'floatUp 2s ease-out forwards',
          zIndex: 50,
          letterSpacing: 2,
        }}>
          {t.text}
        </div>
      ))}

      {/* Flash overlay */}
      {party && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'white',
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
          animation: 'flash 0.2s infinite',
          zIndex: 5,
        }} />
      )}

      {/* Particles */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'fixed',
          top: 0,
          left: `${p.left}%`,
          width: p.size,
          height: p.size,
          borderRadius: p.type === 'circle' ? '50%' : '2px',
          background: p.color,
          boxShadow: `0 0 6px ${p.color}`,
          pointerEvents: 'none',
          animation: `fall ${p.duration}s linear forwards`,
          animationDelay: `${p.delay}s`,
          transform: p.type === 'star' ? 'rotate(45deg)' : 'none',
          zIndex: 20,
        }} />
      ))}
    </div>
  );
}
