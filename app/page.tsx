"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const AMOUNTS = [5, 10, 20, 50, 100, 500];

type Entry = { name: string; amount: number; title: string };

// ── theme ─────────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setDark(saved === "dark");
    } else {
      setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}

function ThemeToggle({ dark, toggle }: { dark: boolean; toggle: () => void }) {
  return (
    <button onClick={toggle} className="theme-toggle" aria-label="Toggle theme">
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

// ── footer ────────────────────────────────────────────────────────
function Footer({ dark }: { dark: boolean }) {
  const mutedColor = dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)";
  const stripeColor = dark ? "rgba(255,255,255,0.35)" : "#635bff";
  return (
    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
      <a
        href="https://stripe.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: 12, color: stripeColor, textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}
      >
        {/* Stripe "S" mark */}
        <svg width="13" height="13" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="28" height="28" rx="6" fill="#635BFF"/>
          <path d="M13.3 11.2c0-.9.8-1.3 2-1.3 1.8 0 4 .5 5.8 1.5V6.6C19.2 5.6 17.3 5 14.6 5 10.4 5 7.5 7.2 7.5 11.4c0 6.5 8.9 5.5 8.9 8.3 0 1.1-.9 1.4-2.2 1.4-1.9 0-4.4-.8-6.3-1.9v4.8c2 1 4 1.5 6.3 1.5 4.3 0 7.3-2.1 7.3-6.4-.1-7-8.9-5.8-8.9-8.9z" fill="white"/>
        </svg>
        Powered by Stripe
      </a>
      <p style={{ fontSize: 11, color: mutedColor, margin: 0, maxWidth: 320, lineHeight: 1.5 }}>
        This is a gag site. Donations are voluntary gifts.
        No goods or services are provided.
      </p>
    </div>
  );
}

// ── leaderboard row ───────────────────────────────────────────────
function LeaderboardRow({ entry, i, myName, myAmount }: {
  entry: Entry; i: number; myName: string; myAmount: number;
}) {
  const isMe = entry.name === myName && entry.amount === myAmount && i === 0;
  const medals = [
    { emoji: "🥇", color: "#f59e0b" },
    { emoji: "🥈", color: "#94a3b8" },
    { emoji: "🥉", color: "#b45309" },
  ];
  const medal = medals[i];

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "14px 20px",
      background: isMe ? "rgba(34,197,94,0.08)" : "transparent",
      borderLeft: isMe ? "3px solid #22c55e" : medal ? `3px solid ${medal.color}` : "3px solid transparent",
      borderBottom: "1px solid var(--row-divider)",
    }}>
      <div style={{ flexShrink: 0, width: 36, textAlign: "center" }}>
        {medal
          ? <span style={{ fontSize: 20 }}>{medal.emoji}</span>
          : <span style={{ color: "var(--text-muted)", fontWeight: 700, fontSize: 14 }}>{i + 1}</span>
        }
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            fontWeight: isMe ? 700 : 500,
            color: isMe ? "#22c55e" : "var(--text-primary)",
            fontSize: 15,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {entry.name}
          </span>
          {isMe && (
            <span style={{
              fontSize: 11,
              background: "rgba(34,197,94,0.15)",
              color: "#22c55e",
              border: "1px solid rgba(34,197,94,0.3)",
              padding: "2px 8px",
              borderRadius: 999,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}>
              you · just now
            </span>
          )}
        </div>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", fontStyle: "italic", margin: "2px 0 0" }}>
          {entry.title}
        </p>
      </div>

      <div style={{ flexShrink: 0 }}>
        <span style={{
          fontWeight: 800,
          fontSize: 18,
          fontVariantNumeric: "tabular-nums",
          color: isMe ? "#22c55e" : i === 0 ? "#f59e0b" : "var(--text-secondary)",
        }}>
          ${entry.amount}
        </span>
      </div>
    </div>
  );
}

// ── success page ──────────────────────────────────────────────────
function SuccessPage({ myName, myAmount, dark, toggleTheme }: {
  myName: string; myAmount: number; dark: boolean; toggleTheme: () => void;
}) {
  const [daysCounter, setDaysCounter] = useState(47);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loadingBoard, setLoadingBoard] = useState(true);

  useEffect(() => {
    if (daysCounter <= 0) return;
    const t = setTimeout(() => setDaysCounter((d) => d - 1), 30);
    return () => clearTimeout(t);
  }, [daysCounter]);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then(setEntries)
      .finally(() => setLoadingBoard(false));
  }, []);

  return (
    <main style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 0%, var(--bg-glow-grn) 0%, var(--bg) 60%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "64px 16px",
      gap: 48,
    }}>
      <ThemeToggle dark={dark} toggle={toggleTheme} />

      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 12px" }}>
          days since rishaan last ate
        </p>
        <p style={{
          fontSize: "clamp(80px, 20vw, 128px)",
          fontWeight: 900,
          lineHeight: 1,
          margin: 0,
          color: daysCounter === 0 ? "#22c55e" : "#ef4444",
          fontVariantNumeric: "tabular-nums",
          transition: "color 0.5s",
          textShadow: daysCounter === 0 ? "0 0 40px rgba(34,197,94,0.5)" : "0 0 40px rgba(239,68,68,0.35)",
        }}>
          {daysCounter}
        </p>
        {daysCounter === 0 && (
          <p style={{ marginTop: 12, fontSize: 20, fontWeight: 700, color: "#22c55e" }}>
            you saved him. he can eat today.
          </p>
        )}
      </div>

      <div style={{ textAlign: "center", maxWidth: 500 }}>
        <h1 style={{ fontSize: "clamp(28px, 6vw, 44px)", fontWeight: 900, color: "var(--text-primary)", margin: "0 0 12px", lineHeight: 1.1 }}>
          Rishaan has been fed.
        </h1>
        <p style={{ fontSize: 17, color: "var(--text-secondary)", margin: 0 }}>
          You did what others were too cowardly to do.
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 520 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: "var(--divider)" }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "var(--text-muted)" }}>
            Hall of Fame
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--divider)" }} />
        </div>

        <div style={{ background: "var(--card)", border: "1px solid var(--card-border)", borderRadius: 16, overflow: "hidden" }}>
          {loadingBoard ? (
            [...Array(5)].map((_, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderBottom: "1px solid var(--row-divider)" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--skeleton)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: 12, width: "35%", background: "var(--skeleton)", borderRadius: 6, marginBottom: 6 }} />
                  <div style={{ height: 10, width: "25%", background: "var(--skeleton)", borderRadius: 6 }} />
                </div>
                <div style={{ width: 48, height: 16, background: "var(--skeleton)", borderRadius: 6 }} />
              </div>
            ))
          ) : entries.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: 32, fontStyle: "italic" }}>
              no donors yet. you would be first.
            </p>
          ) : (
            entries.map((entry, i) => (
              <LeaderboardRow key={i} entry={entry} i={i} myName={myName} myAmount={myAmount} />
            ))
          )}
        </div>
      </div>

      <a href="/" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "underline" }}>
        give more money
      </a>

      <Footer dark={dark} />
    </main>
  );
}

// ── home page ─────────────────────────────────────────────────────
function HomeContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "1";
  const { dark, toggle } = useTheme();

  const [selected, setSelected] = useState(20);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [myName, setMyName] = useState("");
  const [myAmount, setMyAmount] = useState(20);

  useEffect(() => {
    if (isSuccess) {
      setMyName(localStorage.getItem("lastDonationName") ?? "Anonymous");
      setMyAmount(Number(localStorage.getItem("lastDonationAmount") ?? 20));
    }
  }, [isSuccess]);

  async function handlePay() {
    setLoading(true);
    try {
      const donorName = name.trim() || "Anonymous";
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selected, name: donorName }),
      });
      const data = await res.json();
      if (data.url) {
        localStorage.setItem("lastDonationAmount", String(selected));
        localStorage.setItem("lastDonationName", donorName);
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  }

  if (isSuccess) {
    return <SuccessPage myName={myName} myAmount={myAmount} dark={dark} toggleTheme={toggle} />;
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% -10%, var(--bg-glow-red) 0%, var(--bg) 55%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 16px",
      gap: 32,
    }}>
      <ThemeToggle dark={dark} toggle={toggle} />


      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(42px, 12vw, 88px)", fontWeight: 900, lineHeight: 1, margin: 0, letterSpacing: "-2px", color: "var(--text-primary)" }}>
          give rishaan
        </h1>
        <h1 style={{
          fontSize: "clamp(42px, 12vw, 88px)",
          fontWeight: 900,
          lineHeight: 1.05,
          margin: 0,
          letterSpacing: "-2px",
          background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          money.
        </h1>
      </div>

      <div style={{
        background: "var(--card)",
        border: "1px solid var(--card-border)",
        borderRadius: 20,
        padding: "28px 28px 32px",
        width: "100%",
        maxWidth: 400,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        boxShadow: "var(--card-shadow)",
      }}>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>
            Your name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Anonymous"
            maxLength={40}
            style={{
              width: "100%",
              background: "var(--input-bg)",
              border: "1px solid var(--input-border)",
              borderRadius: 10,
              padding: "11px 14px",
              fontSize: 15,
              color: "var(--input-color)",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--input-focus)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--input-border)")}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>
            Amount
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => setSelected(amt)}
                style={{
                  padding: "10px 0",
                  borderRadius: 10,
                  border: selected === amt ? "1px solid rgba(34,197,94,0.6)" : "1px solid var(--btn-border)",
                  background: selected === amt ? "rgba(34,197,94,0.12)" : "var(--btn-bg)",
                  color: selected === amt ? "#22c55e" : "var(--btn-color)",
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                }}
              >
                ${amt}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handlePay}
          disabled={loading}
          className="donate-btn-press"
          style={{
            background: loading ? "#991b1b" : "linear-gradient(to bottom, #ef4444, #dc2626)",
            boxShadow: "0 6px 0 #7f1d1d, 0 8px 24px rgba(239,68,68,0.3)",
            transform: "translateY(0)",
            transition: "transform 0.1s, box-shadow 0.1s",
            border: "none",
            borderRadius: 12,
            padding: "16px 0",
            width: "100%",
            color: "#ffffff",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 0.5,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            fontFamily: "inherit",
          }}
          onMouseDown={(e) => {
            const btn = e.currentTarget;
            btn.style.transform = "translateY(5px)";
            btn.style.boxShadow = "0 1px 0 #7f1d1d, 0 2px 8px rgba(239,68,68,0.2)";
          }}
          onMouseUp={(e) => {
            const btn = e.currentTarget;
            btn.style.transform = "translateY(0)";
            btn.style.boxShadow = "0 6px 0 #7f1d1d, 0 8px 24px rgba(239,68,68,0.3)";
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget;
            btn.style.transform = "translateY(0)";
            btn.style.boxShadow = "0 6px 0 #7f1d1d, 0 8px 24px rgba(239,68,68,0.3)";
          }}
        >
          {loading ? "redirecting…" : `Pay $${selected}`}
        </button>
      </div>

      <Footer dark={dark} />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
