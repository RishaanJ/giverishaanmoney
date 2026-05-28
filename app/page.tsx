"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const AMOUNTS = [5, 10, 20, 50, 100, 500];

type Entry = { name: string; amount: number; title: string };



function LeaderboardRow({ entry, i, myName, myAmount }: {
  entry: Entry; i: number; myName: string; myAmount: number;
}) {
  const isMe = entry.name === myName && entry.amount === myAmount && i === 0;
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div
      className={`flex items-center gap-4 px-5 py-4 transition-colors ${
        isMe
          ? "bg-amber-50 border-l-4 border-amber-400"
          : i === 0
          ? "bg-white border-l-4 border-yellow-400"
          : "bg-white border-l-4 border-transparent"
      } ${i > 0 ? "border-t border-gray-100" : ""}`}
    >
      <div className="flex-shrink-0 w-10 flex justify-center">
        {medals[i] ? (
          <span className="text-2xl">{medals[i]}</span>
        ) : (
          <span className="text-gray-300 font-bold text-sm w-9 h-9 flex items-center justify-center">
            {i + 1}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-gray-900 truncate ${isMe ? "font-bold" : "font-semibold"}`}>
            {entry.name}
          </span>
          {isMe && (
            <span className="text-xs bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
              you · just now
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 italic mt-0.5">{entry.title}</p>
      </div>

      <div className="flex-shrink-0 text-right">
        <span className={`font-black tabular-nums text-lg ${
          isMe ? "text-amber-600" : i === 0 ? "text-yellow-500" : "text-gray-700"
        }`}>
          ${entry.amount}
        </span>
      </div>
    </div>
  );
}

function SuccessPage({ myName, myAmount }: { myName: string; myAmount: number }) {
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
    <main className="min-h-screen flex flex-col items-center justify-center bg-white gap-10 px-4 py-16">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">
          days since rishaan last ate
        </p>
        <p
          className="text-9xl font-black tabular-nums"
          style={{ color: daysCounter === 0 ? "#16a34a" : "#dc2626", transition: "color 0.5s" }}
        >
          {daysCounter}
        </p>
        {daysCounter === 0 && (
          <p className="mt-4 text-2xl font-bold text-green-600">
            you saved him. he can eat today.
          </p>
        )}
      </div>

      <div className="text-center max-w-lg">
        <h1 className="text-4xl sm:text-5xl font-black text-black tracking-tight">
          Rishaan has been fed.
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          You did what others were too cowardly to do.
        </p>
      </div>

      <div className="w-full max-w-xl">

        {loadingBoard ? (
          <div className="rounded-2xl border border-gray-100 shadow-lg divide-y divide-gray-100">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-2 bg-gray-100 rounded w-1/4" />
                </div>
                <div className="h-5 bg-gray-100 rounded w-12" />
              </div>
            ))}
          </div>
        ) : entries.length === 0 ? (
          <p className="text-center text-gray-400 italic py-8">
            no donors yet. you would be first.
          </p>
        ) : (
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            {entries.map((entry, i) => (
              <LeaderboardRow key={i} entry={entry} i={i} myName={myName} myAmount={myAmount} />
            ))}
          </div>
        )}
      </div>

      <a href="/" className="text-sm text-gray-400 underline hover:text-gray-600">
        give more money
      </a>
    </main>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "1";

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
    return <SuccessPage myName={myName} myAmount={myAmount} />;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white gap-10 px-4">
      <h1 className="text-5xl sm:text-7xl font-black text-black tracking-tight text-center">
        give rishaan money
      </h1>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="your name (optional)"
        maxLength={40}
        className="border-2 border-gray-300 rounded-lg px-4 py-3 text-lg text-center w-full max-w-xs focus:outline-none focus:border-black transition-colors"
      />

      <div className="flex flex-wrap gap-3 justify-center">
        {AMOUNTS.map((amt) => (
          <button
            key={amt}
            onClick={() => setSelected(amt)}
            className={`px-5 py-2 rounded border-2 font-semibold text-lg transition-all ${
              selected === amt
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-300 hover:border-gray-500"
            }`}
          >
            ${amt}
          </button>
        ))}
      </div>

      <button
        onClick={handlePay}
        disabled={loading}
        style={{
          background: "linear-gradient(to bottom, #ff4444, #cc0000)",
          boxShadow: "0 8px 0 #7a0000, 0 10px 20px rgba(0,0,0,0.4)",
          transform: loading ? "translateY(6px)" : "translateY(0)",
          transition: "transform 0.1s, box-shadow 0.1s",
        }}
        onMouseDown={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(6px)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 0 #7a0000, 0 4px 8px rgba(0,0,0,0.4)";
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 0 #7a0000, 0 10px 20px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 0 #7a0000, 0 10px 20px rgba(0,0,0,0.4)";
        }}
        className="rounded-xl px-12 py-5 text-white text-2xl font-black tracking-wide uppercase cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "redirecting..." : `pay $${selected}`}
      </button>
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
