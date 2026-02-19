import { useEffect, useState } from "react";

export default function Home() {
  const [ip, setIp] = useState("Loading...");
  const [party, setParty] = useState(false);
  const [particles, setParticles] = useState([]);

  // Get user IP
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch(() => setIp("Unable to fetch IP"));
  }, []);

  // Rainbow flash loop
  useEffect(() => {
    if (!party) return;

    let hue = 0;
    const interval = setInterval(() => {
      document.body.style.background = `hsl(${hue}, 100%, 50%)`;
      hue = (hue + 10) % 360;
    }, 80);

    return () => clearInterval(interval);
  }, [party]);

  // Spawn particles
  function spawnParticles() {
    const newParticles = [];
    for (let i = 0; i < 80; i++) {
      newParticles.push({
        id: Math.random(),
        left: Math.random() * 100,
        delay: Math.random() * 2,
        color: `hsl(${Math.random() * 360},100%,60%)`,
        size: 6 + Math.random() * 10,
      });
    }
    setParticles(newParticles);
  }

  function activateRespect() {
    setParty(true);
    spawnParticles();
  }

  return (
    <div style={styles.container}>
      <h1>Your IP:</h1>
      <h2 style={{ marginBottom: 40 }}>{ip}</h2>

      <button style={styles.button} onClick={activateRespect}>
        diego respect button
      </button>

      {party && (
        <div style={styles.flashOverlay}></div>
      )}

      {particles.map(p => (
        <div
          key={p.id}
          style={{
            ...styles.particle,
            left: `${p.left}%`,
            background: p.color,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}

      <style jsx global>{`
        @keyframes fall {
          from { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }

        @keyframes flash {
          0%,100% { opacity: 0; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "sans-serif",
    textAlign: "center",
    color: "white",
    background: "black",
    overflow: "hidden"
  },

  button: {
    padding: "18px 32px",
    fontSize: "20px",
    fontWeight: "bold",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(90deg, red, orange, yellow, green, blue, purple)",
    color: "white",
    boxShadow: "0 0 20px white",
    transition: "transform 0.1s",
  },

  flashOverlay: {
    position: "fixed",
    inset: 0,
    background: "white",
    mixBlendMode: "overlay",
    pointerEvents: "none",
    animation: "flash 0.25s infinite",
  },

  particle: {
    position: "fixed",
    top: 0,
    borderRadius: "50%",
    pointerEvents: "none",
    animation: "fall 3s linear forwards",
  }
};